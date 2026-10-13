import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 1 : 0,
  reporter: 'list',
  use: {baseURL: 'http://127.0.0.1:4321', trace: 'retain-on-failure', ...(process.env['PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH'] ? {launchOptions: {executablePath: process.env['PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH']}} : {})},
  projects: [
    {name: 'chromium', use: {...devices['Desktop Chrome']}},
    {name: 'mobile-chromium', use: {...devices['Pixel 7']}},
  ],
  webServer: {command: 'npm run preview -- --port 4321 --ignore-lock', url: 'http://127.0.0.1:4321', reuseExistingServer: !process.env['CI']},
});
