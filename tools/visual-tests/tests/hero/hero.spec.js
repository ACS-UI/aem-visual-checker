import { test, expect, devices } from '@playwright/test';
// DEVICE: hero - desktop

test.use({
  ...devices['Desktop Chrome'],
});

test('Interaction Tests - hero interation test at desktop viewport', async ({ browser }) => {
  const context = await browser.newContext(devices['Desktop Chrome']);
  const page = await context.newPage();
  await page.goto('http://localhost:3000/tools/sidekick/library/templates/hero');
  await page.getByText('Documentation Architecture').click();
  await page.getByText('Getting Started Build your').click();
  await page.getByText('Example Content Default').click();
});
// END DEVICE: hero - desktop
