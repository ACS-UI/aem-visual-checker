import { test, expect, devices } from '@playwright/test';

// DEVICE: tabs - desktop
const { chromium, devices } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false
  });
  const context = await browser.newContext({
    ...devices['Desktop Chrome'],
  });
  const page = await context.newPage();
  await page.goto('http://localhost:3000/tools/sidekick/library/templates/tabs');
  await page.locator('img').click();
  await page.getByRole('paragraph').filter({ hasText: 'Boilerplate' }).click();
  await page.close();

  // ---------------------
  await context.close();
  await browser.close();
})();
// END DEVICE: tabs - desktop
