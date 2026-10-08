import { defineConfig } from '@playwright/test';

const production = process.env.PLAYWRIGHT_PRODUCTION === '1';
const localURL = production ? 'http://127.0.0.1:4173' : 'http://127.0.0.1:5173';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || localURL,
    trace: 'retain-on-failure',
    colorScheme: 'light',
    channel: process.env.PLAYWRIGHT_CHANNEL || undefined,
  },
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: production
          ? 'npm run preview -- --host 127.0.0.1 --port 4173 --strictPort'
          : 'npm run dev -- --port 5173 --strictPort',
        url: localURL,
        reuseExistingServer: !process.env.CI,
      },
});
