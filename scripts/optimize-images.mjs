import { mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { imageEntries, mediaVariants } from './image-manifest.mjs';

const MAX_WEBP_1600_BYTES = 250 * 1024;
const MAX_JPG_1600_BYTES = 300 * 1024;

const args = process.argv.slice(2);
const readArg = (name, fallback) => {
  const index = args.indexOf(name);
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
};

const sourceDir = path.resolve(readArg('--src', 'assets/images/source'));
const outputDir = path.resolve(readArg('--out', 'public/media'));

const kb = (bytes) => `${(bytes / 1024).toFixed(0)} Ko`;

async function render(input, output, variant, quality) {
  let pipeline = sharp(input).rotate().resize({ width: variant.width });
  pipeline = variant.format === 'webp'
    ? pipeline.webp({ quality, effort: 6 })
    : pipeline.jpeg({ quality, mozjpeg: true, progressive: true });
  const info = await pipeline.toFile(output);
  return { bytes: info.size, width: info.width, height: info.height, quality };
}

async function renderWithinBudget(input, output, variant, limit) {
  let quality = variant.quality;
  let result = await render(input, output, variant, quality);
  while (result.bytes > limit && quality > 70) {
    quality -= 2;
    result = await render(input, output, variant, quality);
  }
  return result;
}

async function main() {
  await mkdir(outputDir, { recursive: true });
  const rows = [];
  let failures = 0;

  for (const entry of imageEntries) {
    const input = path.join(sourceDir, entry.source);
    let sourceInfo;
    try {
      sourceInfo = await stat(input);
    } catch {
      console.error(`Source manquante : ${input}`);
      failures += 1;
      continue;
    }

    const row = { slug: entry.slug, before: sourceInfo.size };
    for (const variant of mediaVariants) {
      const extension = variant.format === 'webp' ? 'webp' : 'jpg';
      const filename = `${entry.slug}${variant.suffix}.${extension}`;
      const output = path.join(outputDir, filename);
      const limit = variant.key === 'webp1600'
        ? MAX_WEBP_1600_BYTES
        : variant.key === 'jpg1600'
          ? MAX_JPG_1600_BYTES
          : Number.POSITIVE_INFINITY;
      const result = limit === Number.POSITIVE_INFINITY
        ? await render(input, output, variant, variant.quality)
        : await renderWithinBudget(input, output, variant, limit);
      row[variant.key] = result.bytes;
      if (variant.key === 'webp1600') {
        row.width = result.width;
        row.height = result.height;
        row.webpQuality = result.quality;
      }
      if (variant.key === 'jpg1600') row.jpgQuality = result.quality;
      if (result.bytes > limit) {
        console.error(`${filename} dépasse ${kb(limit)} (${kb(result.bytes)})`);
        failures += 1;
      }
    }
    rows.push(row);
  }

  const header = ['Image', 'Source', 'WebP 1600', 'WebP 1024', 'WebP 640', 'WebP 320', 'JPG 1600'];
  const cells = [
    header,
    ...rows.map((row) => [
      row.slug,
      kb(row.before),
      kb(row.webp1600),
      kb(row.webpMd),
      kb(row.webpSm),
      kb(row.webpThumb),
      kb(row.jpg1600),
    ]),
  ];
  const widths = header.map((_, index) => Math.max(...cells.map((line) => line[index].length)));
  for (const line of cells) {
    console.log(line.map((cell, index) => cell.padEnd(widths[index])).join('  '));
  }

  console.log('\nDimensions 1600 px :');
  for (const row of rows) console.log(`${row.slug}: ${row.width}x${row.height}`);

  const adjusted = rows.filter((row) => row.webpQuality < 80 || row.jpgQuality < 82);
  if (adjusted.length > 0) {
    console.log('\nQualité ajustée pour tenir les budgets :');
    for (const row of adjusted) {
      console.log(`${row.slug}: webp q${row.webpQuality}, jpg q${row.jpgQuality}`);
    }
  }

  if (failures > 0) process.exitCode = 1;
}

await main();
