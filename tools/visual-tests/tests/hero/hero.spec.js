import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/tools/sidekick/library/templates/hero');
  await page.getByText('Heading in Block').click();
  await page.getByText('Boilerplate Example Content').click();
  await page.getByText('Example Content Default').click();
  await page.getByText('Getting Started Build your').click();
  await page.getByText('Documentation Architecture').click();
});