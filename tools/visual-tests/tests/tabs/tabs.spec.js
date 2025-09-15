import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/tools/sidekick/library/templates/tabs');
  await page.getByRole('tab', { name: 'Tab Three' }).nth(1).click();
  await page.getByRole('tab', { name: 'Tab Two' }).nth(1).click();
  await page.getByRole('tab', { name: 'Tab One' }).nth(1).click();
  await page.getByRole('tab', { name: 'Tab Three' }).first().click();
  await page.getByRole('tab', { name: 'Tab Two' }).first().click();
  await page.getByRole('tab', { name: 'Tab One3434' }).first().click();
});