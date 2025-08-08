import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tools/visual-tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }]],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: {
      mode: 'retain-on-failure',
    },
    viewport: { width: 1280, height: 720 },
    // Improve text rendering consistency
    colorScheme: 'light',
  },
  expect: {
    toMatchSnapshot: {
      maxDiffPixels: process.env.CI ? 15000 : 500,
      threshold: process.env.CI ? 0.6 : 0.1,
    },
  },
  // Custom snapshot path to remove platform name from snapshot files
  snapshotPathTemplate: '{testDir}/{testFileDir}/{testFileName}-snapshots/{arg}{ext}',
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: [
            '--font-render-hinting=none',
            '--disable-font-subpixel-positioning',
            '--disable-lcd-text',
          ]
        }
      },
    },
  ],
  webServer: process.env.CI ? undefined : {
    command: 'aem up',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
}); 