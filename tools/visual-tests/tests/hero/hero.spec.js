import { test, expect, devices } from '@playwright/test';
// DEVICE: desktop

test.use({
  ...devices['Desktop Chrome'],
});

test('desktop test', async ({ browser }) => {
  const context = await browser.newContext(devices['Desktop Chrome']);
  const page = await context.newPage();
  await page.goto('http://localhost:3000/tools/sidekick/library/templates/hero');
  await page.getByText('Heading in Block').click();
  await page.getByText('Heading in Block').click();
});
// END DEVICE: desktop
