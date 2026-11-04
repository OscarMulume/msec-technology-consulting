// Petit serveur statique pour les tests de bout en bout : sert un dossier construit sous /msec-technology-consulting/.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(process.argv[2] ?? 'dist-e2e');
const port = Number(process.argv[3] ?? 4323);
const base = '/msec-technology-consulting';

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
};

async function resolveFile(urlPath) {
  const relative = decodeURIComponent(urlPath.slice(base.length)).replace(/^\/+/, '');
  const target = path.resolve(root, relative);
  if (target !== root && !target.startsWith(root + path.sep)) return null;
  for (const candidate of [target, path.join(target, 'index.html')]) {
    try {
      if ((await stat(candidate)).isFile()) return candidate;
    } catch {
      // essai suivant
    }
  }
  return null;
}

createServer(async (request, response) => {
  const { pathname } = new URL(request.url ?? '/', 'http://localhost');
  if (pathname !== base && !pathname.startsWith(`${base}/`)) {
    response.writeHead(404).end('hors base');
    return;
  }
  const file = await resolveFile(pathname);
  if (!file) {
    response.writeHead(404).end('introuvable');
    return;
  }
  response.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] ?? 'application/octet-stream' });
  response.end(await readFile(file));
}).listen(port, '127.0.0.1', () => console.log(`e2e : http://127.0.0.1:${port}${base}/`));
