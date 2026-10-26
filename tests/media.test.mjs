import assert from 'node:assert/strict';
import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import sharp from 'sharp';
import { imageEntries, mediaVariants } from '../scripts/image-manifest.mjs';

const MEDIA_DIR = path.resolve('public/media');
const MAX_WEBP_1600_BYTES = 250 * 1024;
const MAX_SERVED_BYTES = 300 * 1024;

async function filesIn(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...await filesIn(fullPath));
    else result.push(fullPath);
  }
  return result;
}

test('les 9 nouvelles images existent dans toutes les tailles', async () => {
  assert.equal(imageEntries.length, 9);
  for (const entry of imageEntries) {
    for (const variant of mediaVariants) {
      const extension = variant.format === 'webp' ? 'webp' : 'jpg';
      const file = path.join(MEDIA_DIR, `${entry.slug}${variant.suffix}.${extension}`);
      const info = await stat(file);
      assert.ok(info.isFile(), `${file} manquant`);
      const meta = await sharp(file).metadata();
      assert.equal(meta.width, variant.width, `${file} doit faire ${variant.width} px de large`);
    }
  }
});

test('le WebP 1600 px reste sous 250 Ko', async () => {
  for (const entry of imageEntries) {
    const file = path.join(MEDIA_DIR, `${entry.slug}.webp`);
    const info = await stat(file);
    assert.ok(info.size <= MAX_WEBP_1600_BYTES, `${entry.slug}.webp pèse ${Math.round(info.size / 1024)} Ko`);
  }
});

test('aucune image servie ne dépasse 300 Ko', async () => {
  for (const file of await filesIn(MEDIA_DIR)) {
    const info = await stat(file);
    assert.ok(info.size <= MAX_SERVED_BYTES, `${path.basename(file)} pèse ${Math.round(info.size / 1024)} Ko`);
  }
});

test('aucun PNG lourd dans public/media hors og-image.png', async () => {
  for (const file of await filesIn(MEDIA_DIR)) {
    if (file.endsWith('.png')) {
      assert.equal(path.basename(file), 'og-image.png', `${path.basename(file)} ne doit pas être versionné`);
    }
  }
});
