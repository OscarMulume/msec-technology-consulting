import { readFile } from 'node:fs/promises';
import path from 'node:path';

const FILES = ['dist/index.html', 'dist/en/index.html'];

function collectCredlyUrls(html) {
  return [...html.matchAll(/https:\/\/www\.credly\.com\/[^"'<>\\\s]+/g)].map((match) => match[0]);
}

async function main() {
  const urls = new Set();
  for (const file of FILES) {
    const html = await readFile(path.resolve(file), 'utf8');
    for (const url of collectCredlyUrls(html)) urls.add(url);
  }

  if (urls.size === 0) {
    console.error('Aucun lien Credly trouvé dans le build.');
    process.exit(1);
  }

  let failures = 0;
  for (const url of [...urls].sort()) {
    try {
      const response = await fetch(url, {
        redirect: 'follow',
        signal: AbortSignal.timeout(20000),
        headers: { 'user-agent': 'Mozilla/5.0 (compatible; M-SEC link check)' },
      });
      const ok = response.status >= 200 && response.status < 400;
      console.log(`${ok ? 'OK' : 'ECHEC'} ${response.status} ${url}`);
      if (!ok) failures += 1;
    } catch (error) {
      console.error(`ECHEC ${error instanceof Error ? error.message : String(error)} ${url}`);
      failures += 1;
    }
  }

  if (failures > 0) {
    console.error(`Liens Credly en échec : ${failures} / ${urls.size}`);
    process.exit(1);
  }

  console.log(`Liens Credly valides : ${urls.size} / ${urls.size}`);
}

await main();
