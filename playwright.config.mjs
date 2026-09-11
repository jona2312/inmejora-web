import { defineConfig } from '@playwright/test';
import { launchOptions } from './tests/browser/isolation.mjs';
export default defineConfig({
  testDir: './tests/browser', timeout: 30000, workers: 2, retries: 0,
  reporter: [['list'], ['json', { outputFile: 'browser-results/results.json' }], ['html', { outputFolder: 'browser-report', open: 'never' }]],
  use: { browserName: 'chromium', launchOptions, serviceWorkers: 'block', screenshot: 'only-on-failure', trace: 'retain-on-failure', baseURL: 'http://127.0.0.1:4173' },
  projects: [360, 390, 768, 1440].map(width => ({ name: `${width}px`, use: { viewport: { width, height: 900 } } })),
  webServer: { command: 'node scripts/browser/server.mjs', url: 'http://127.0.0.1:4173', reuseExistingServer: !process.env.CI },
});
