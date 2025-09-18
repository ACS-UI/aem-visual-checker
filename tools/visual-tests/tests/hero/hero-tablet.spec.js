import { test, expect, devices } from '@playwright/test';

test.use({
  ...devices['iPad Pro 11'],
});

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/tools/sidekick/library/templates/hero');
});