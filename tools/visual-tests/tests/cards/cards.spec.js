import { test, expect, devices } from '@playwright/test';
// DEVICE: desktop
test.use({
  ...devices['Desktop Chrome'],
});
test('desktop test', async ({ browser }) => {
  const context = await browser.newContext(devices['Desktop Chrome']);
  const page = await context.newPage();
  await page.goto('http://localhost:3000/tools/sidekick/library/templates/cards');
  await page.getByText('Example Content Default').click();
  await page.getByText('Getting Started Build your').click();
  await page.getByText('Documentation Architecture').click();
  await page.getByText('Example Content Default').click();
});
// END DEVICE: desktop
// DEVICE: tablet
test.use({
  ...devices['iPad Mini'],
});
test('tablet test', async ({ browser }) => {
  const context = await browser.newContext(devices['iPad Mini']);
  const page = await context.newPage();
  await page.goto('http://localhost:3000/tools/sidekick/library/templates/cards');
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page.getByRole('button', { name: 'Close navigation' }).click();
});
// END DEVICE: tablet

// DEVICE: mobile

test.use({
  ...devices['Pixel 5'],
});

test('mobile test', async ({ browser }) => {
  const context = await browser.newContext(devices['Pixel 5']);
  const page = await context.newPage();
  await page.goto('http://localhost:3000/tools/sidekick/library/templates/cards');
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page.getByRole('button', { name: 'Close navigation' }).click();
});
// END DEVICE: mobile
