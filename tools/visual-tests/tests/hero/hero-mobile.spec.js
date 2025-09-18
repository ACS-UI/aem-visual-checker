import { test, expect, devices } from '@playwright/test';

test.use({
  ...devices['iPhone 13'],
});

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/tools/sidekick/library/templates/hero');
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page.getByRole('button', { name: 'Close navigation' }).click();
});