# Test info

- Name: Visual Tests >> Hero visual test at mobile viewport
- Location: /Users/sselvara/adobe/adobe/Franklin/aem-visual-cheker/visual-tests/visual.spec.js:9:3

# Error details

```
Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
Call log:
  - navigating to "/tools/sidekick/library.html?plugin=blocks&path=/tools/sidekick/library/templates/hero&index=0&vtest=true", waiting until "load"

    at /Users/sselvara/adobe/adobe/Franklin/aem-visual-cheker/visual-tests/visual.spec.js:14:16
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test.describe('Visual Tests', () => {
   4 |   test.beforeEach(async ({ page }) => {
   5 |     // Set default viewport size
   6 |     await page.setViewportSize({ width: 1280, height: 2000 });
   7 |   });
   8 |
   9 |   test('Hero visual test at mobile viewport', async ({ page }) => {
   10 |     // Set viewport size
   11 |     await page.setViewportSize({ width: 320, height: 568 });
   12 |     
   13 |     // Navigate to the block variation
>  14 |     await page.goto('/tools/sidekick/library.html?plugin=blocks&path=/tools/sidekick/library/templates/hero&index=0&vtest=true');
      |                ^ Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
   15 |     
   16 |     // Wait for the library component to load
   17 |     await page.waitForSelector('sidekick-library', { timeout: 30000 });
   18 |     
   19 |     // Wait for the iframe to load and switch to its context
   20 |     const iframe = await page.waitForSelector('sidekick-library >> sp-theme >> plugin-renderer >> .view block-renderer >> iframe', { timeout: 30000 });
   21 |     const frame = await iframe.contentFrame();
   22 |     if (!frame) throw new Error('Could not get iframe content frame');
   23 |     
   24 |     // Wait for the block to be fully rendered
   25 |     const block = await frame.waitForSelector('.hero', { timeout: 30000, state: 'visible' });
   26 |     
   27 |     // Small delay to ensure layout is stable
   28 |     await page.waitForTimeout(1000);
   29 |
   30 |     await block.scrollIntoViewIfNeeded();
   31 |     await page.evaluate(el => {
   32 |       el.style.overflow = 'visible';
   33 |       el.style.maxHeight = 'none';
   34 |     }, block);
   35 |     
   36 |     // Get the bounding box of the block
   37 |     const box = await block.boundingBox();
   38 |     if (!box) throw new Error('Could not get bounding box for Hero');
   39 |     
   40 |     // Take a screenshot of only the block area
   41 |     const screenshotName = 1 > 1 ? 'hero-variation-0-mobile.png' : 'hero-mobile.png';
   42 |     await expect(page).toHaveScreenshot(screenshotName, {
   43 |       clip: box,
   44 |       timeout: 30000,
   45 |       maxDiffPixels: 500,
   46 |       threshold: 0.4,
   47 |       animations: 'disabled',
   48 |       fullPage: box.height > 568
   49 |     });
   50 |   });
   51 |
   52 |   test('Hero visual test at tablet viewport', async ({ page }) => {
   53 |     // Set viewport size
   54 |     await page.setViewportSize({ width: 768, height: 1024 });
   55 |     
   56 |     // Navigate to the block variation
   57 |     await page.goto('/tools/sidekick/library.html?plugin=blocks&path=/tools/sidekick/library/templates/hero&index=0&vtest=true');
   58 |     
   59 |     // Wait for the library component to load
   60 |     await page.waitForSelector('sidekick-library', { timeout: 30000 });
   61 |     
   62 |     // Wait for the iframe to load and switch to its context
   63 |     const iframe = await page.waitForSelector('sidekick-library >> sp-theme >> plugin-renderer >> .view block-renderer >> iframe', { timeout: 30000 });
   64 |     const frame = await iframe.contentFrame();
   65 |     if (!frame) throw new Error('Could not get iframe content frame');
   66 |     
   67 |     // Wait for the block to be fully rendered
   68 |     const block = await frame.waitForSelector('.hero', { timeout: 30000, state: 'visible' });
   69 |     
   70 |     // Small delay to ensure layout is stable after breakpoint transition
   71 |     await page.waitForTimeout(1000);
   72 |
   73 |     await block.scrollIntoViewIfNeeded();
   74 |     await page.evaluate(el => {
   75 |       el.style.overflow = 'visible';
   76 |       el.style.maxHeight = 'none';
   77 |     }, block);
   78 |     
   79 |     // Get the bounding box of the block
   80 |     const box = await block.boundingBox();
   81 |     if (!box) throw new Error('Could not get bounding box for Hero');
   82 |     
   83 |     // Take a screenshot of only the block area
   84 |     const screenshotName = 1 > 1 ? 'hero-variation-0-tablet.png' : 'hero-tablet.png';
   85 |     await expect(page).toHaveScreenshot(screenshotName, {
   86 |       clip: box,
   87 |       timeout: 30000,
   88 |       maxDiffPixels: 500,
   89 |       threshold: 0.4,
   90 |       animations: 'disabled',
   91 |       fullPage: box.height > 1024
   92 |     });
   93 |   });
   94 |
   95 |   test('Hero visual test at desktop viewport', async ({ page }) => {
   96 |     // Set viewport size
   97 |     await page.setViewportSize({ width: 1024, height: 768 });
   98 |     
   99 |     // Navigate to the block variation
  100 |     await page.goto('/tools/sidekick/library.html?plugin=blocks&path=/tools/sidekick/library/templates/hero&index=0&vtest=true');
  101 |     
  102 |     // Wait for the library component to load
  103 |     await page.waitForSelector('sidekick-library', { timeout: 30000 });
  104 |     
  105 |     // Wait for the iframe to load and switch to its context
  106 |     const iframe = await page.waitForSelector('sidekick-library >> sp-theme >> plugin-renderer >> .view block-renderer >> iframe', { timeout: 30000 });
  107 |     const frame = await iframe.contentFrame();
  108 |     if (!frame) throw new Error('Could not get iframe content frame');
  109 |     
  110 |     // Wait for the block to be fully rendered
  111 |     const block = await frame.waitForSelector('.hero', { timeout: 30000, state: 'visible' });
  112 |     
  113 |     // Small delay to ensure layout is stable
  114 |     await page.waitForTimeout(1000);
```