// Construit le site AVEC l'assistant activé dans dist-e2e, puis lance Playwright.
import { spawnSync } from 'node:child_process';

const shell = process.platform === 'win32';
const env = { ...process.env, PUBLIC_ASSISTANT_ENABLED: 'true' };

function run(command, args) {
  const result = spawnSync(command, args, { stdio: 'inherit', env, shell });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

run('npx', ['astro', 'build', '--outDir', 'dist-e2e']);
run('npx', ['playwright', 'test', '-c', 'tests/e2e/playwright.config.mjs', ...process.argv.slice(2)]);
