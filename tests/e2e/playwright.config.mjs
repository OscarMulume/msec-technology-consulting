import { defineConfig, devices } from '@playwright/test';

const PORT = 4323;

export default defineConfig({
  testDir: '.',
  testMatch: '*.spec.mjs',
  timeout: 20_000,
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: `http://127.0.0.1:${PORT}/msec-technology-consulting/`,
    trace: 'off',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `node tests/e2e/serve.mjs dist-e2e ${PORT}`,
    cwd: '../..',
    url: `http://127.0.0.1:${PORT}/msec-technology-consulting/`,
    reuseExistingServer: false,
    timeout: 20_000,
  },
});
