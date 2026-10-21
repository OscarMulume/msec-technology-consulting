import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const BASE = '/msec-technology-consulting';
const DIST = path.resolve('dist');
const ORIGIN = 'https://oscarmulume.github.io';
const SKIP_PROTOCOLS = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;

const htmlFiles = [];

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await walk(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      htmlFiles.push(fullPath);
    }
  }
}

function toUrlPath(file) {
  const relative = path.relative(DIST, file).split(path.sep).join('/');
  const withoutIndex = relative.replace(/index\.html$/, '');
  return `/${withoutIndex}`;
}

function stripBase(urlPath) {
  if (urlPath === BASE || urlPath === `${BASE}/`) return '/';
  if (urlPath.startsWith(`${BASE}/`)) return urlPath.slice(BASE.length);
  return urlPath;
}

function decodeUrl(value) {
  return decodeURIComponent(value.replaceAll('&amp;', '&'));
}

function resolveTarget(rawValue, currentPath) {
  let value = decodeUrl(rawValue.trim());
  if (!value || SKIP_PROTOCOLS.test(value)) {
    if (value.startsWith(ORIGIN)) {
      value = value.slice(ORIGIN.length) || '/';
    } else {
      return null;
    }
  }

  let pathname = value;
  let hash = '';

  const hashIndex = value.indexOf('#');
  if (hashIndex >= 0) {
    pathname = value.slice(0, hashIndex);
    hash = value.slice(hashIndex + 1);
  }

  const queryIndex = pathname.indexOf('?');
  if (queryIndex >= 0) pathname = pathname.slice(0, queryIndex);

  if (!pathname) pathname = currentPath;

  if (!pathname.startsWith('/')) {
    const directory = pathname.endsWith('/') ? pathname : path.posix.dirname(pathname);
    pathname = path.posix.normalize(path.posix.join(path.posix.dirname(currentPath), directory));
    if (!pathname.startsWith('/')) pathname = `/${pathname}`;
  }

  pathname = stripBase(pathname);

  if (pathname.endsWith('/')) pathname += 'index.html';
  else if (!path.posix.extname(pathname)) pathname = `${pathname}/index.html`;

  return { pathname, hash };
}

async function main() {
  await walk(DIST);
  const broken = [];
  const idsByFile = new Map();
  let checked = 0;

  for (const file of htmlFiles) {
    const html = await readFile(file, 'utf8');
    const currentPath = toUrlPath(file);
    const attributePattern = /\b(?:href|src)=["']([^"']+)["']/gi;
    const srcsetPattern = /\bsrcset=["']([^"']+)["']/gi;
    const values = [];

    for (const match of html.matchAll(attributePattern)) values.push(match[1]);
    for (const match of html.matchAll(srcsetPattern)) {
      for (const candidate of match[1].split(',')) {
        values.push(candidate.trim().split(/\s+/)[0]);
      }
    }

    for (const rawValue of values) {
      const target = resolveTarget(rawValue, currentPath);
      if (!target) continue;
      checked += 1;

      const targetFile = path.join(DIST, target.pathname.replace(/^\//, ''));
      try {
        const info = await stat(targetFile);
        if (!info.isFile()) throw new Error('Not a file');
      } catch {
        broken.push(`${currentPath} -> ${rawValue} (missing ${target.pathname})`);
        continue;
      }

      if (!target.hash) continue;

      if (!idsByFile.has(targetFile)) {
        const targetHtml = await readFile(targetFile, 'utf8');
        const ids = new Set(
          [...targetHtml.matchAll(/\bid=["']([^"']+)["']/g)].map((match) => match[1]),
        );
        idsByFile.set(targetFile, ids);
      }

      if (!idsByFile.get(targetFile).has(decodeUrl(target.hash))) {
        broken.push(`${currentPath} -> ${rawValue} (missing anchor #${target.hash})`);
      }
    }
  }

  if (broken.length > 0) {
    console.error(`Broken links found (${broken.length}):`);
    for (const item of broken) console.error(`- ${item}`);
    process.exit(1);
  }

  console.log(`Link check passed: ${checked} local references across ${htmlFiles.length} HTML files.`);
}

await main();
