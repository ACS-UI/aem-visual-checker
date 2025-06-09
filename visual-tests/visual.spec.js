import { test, expect } from '@playwright/test';

test.describe('Visual Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set default viewport size
    await page.setViewportSize({ width: 1280, height: 2000 });
  });

  test('Hero visual test at mobile viewport', async ({ page }) => {
    // Set viewport size
    await page.setViewportSize({ width: 320, height: 568 });
    
    // Navigate to the block variation
    await page.goto('http://localhost:3000/tools/sidekick/library.html?plugin=blocks&path=/tools/sidekick/library/templates/hero&index=0&vtest=true');
    
    // Wait for the library component to load
    await page.waitForSelector('sidekick-library', { timeout: 30000 });
    
    // Wait for the iframe to load and switch to its context
    const iframe = await page.waitForSelector('sidekick-library >> sp-theme >> plugin-renderer >> .view block-renderer >> iframe', { timeout: 30000 });
    const frame = await iframe.contentFrame();
    if (!frame) throw new Error('Could not get iframe content frame');
    
    // Wait for the block to be fully rendered
    const block = await frame.waitForSelector('.hero', { timeout: 30000, state: 'visible' });
    
    // Small delay to ensure layout is stable
    await page.waitForTimeout(1000);

    await block.scrollIntoViewIfNeeded();
    await page.evaluate(el => {
      el.style.overflow = 'visible';
      el.style.maxHeight = 'none';
    }, block);
    
    // Get the bounding box of the block
    const box = await block.boundingBox();
    if (!box) throw new Error('Could not get bounding box for Hero');
    
    // Take a screenshot of only the block area
    const screenshotName = 1 > 1 ? 'hero-variation-0-mobile.png' : 'hero-mobile.png';
    await expect(page).toHaveScreenshot(screenshotName, {
      clip: box,
      timeout: 30000,
      maxDiffPixels: 500,
      threshold: 0.4,
      animations: 'disabled',
      fullPage: box.height > 568
    });
  });

  test('Hero visual test at tablet viewport', async ({ page }) => {
    // Set viewport size
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // Navigate to the block variation
    await page.goto('http://localhost:3000/tools/sidekick/library.html?plugin=blocks&path=/tools/sidekick/library/templates/hero&index=0&vtest=true');
    
    // Wait for the library component to load
    await page.waitForSelector('sidekick-library', { timeout: 30000 });
    
    // Wait for the iframe to load and switch to its context
    const iframe = await page.waitForSelector('sidekick-library >> sp-theme >> plugin-renderer >> .view block-renderer >> iframe', { timeout: 30000 });
    const frame = await iframe.contentFrame();
    if (!frame) throw new Error('Could not get iframe content frame');
    
    // Wait for the block to be fully rendered
    const block = await frame.waitForSelector('.hero', { timeout: 30000, state: 'visible' });
    
    // Small delay to ensure layout is stable after breakpoint transition
    await page.waitForTimeout(1000);

    await block.scrollIntoViewIfNeeded();
    await page.evaluate(el => {
      el.style.overflow = 'visible';
      el.style.maxHeight = 'none';
    }, block);
    
    // Get the bounding box of the block
    const box = await block.boundingBox();
    if (!box) throw new Error('Could not get bounding box for Hero');
    
    // Take a screenshot of only the block area
    const screenshotName = 1 > 1 ? 'hero-variation-0-tablet.png' : 'hero-tablet.png';
    await expect(page).toHaveScreenshot(screenshotName, {
      clip: box,
      timeout: 30000,
      maxDiffPixels: 500,
      threshold: 0.4,
      animations: 'disabled',
      fullPage: box.height > 1024
    });
  });

  test('Hero visual test at desktop viewport', async ({ page }) => {
    // Set viewport size
    await page.setViewportSize({ width: 1024, height: 768 });
    
    // Navigate to the block variation
    await page.goto('http://localhost:3000/tools/sidekick/library.html?plugin=blocks&path=/tools/sidekick/library/templates/hero&index=0&vtest=true');
    
    // Wait for the library component to load
    await page.waitForSelector('sidekick-library', { timeout: 30000 });
    
    // Wait for the iframe to load and switch to its context
    const iframe = await page.waitForSelector('sidekick-library >> sp-theme >> plugin-renderer >> .view block-renderer >> iframe', { timeout: 30000 });
    const frame = await iframe.contentFrame();
    if (!frame) throw new Error('Could not get iframe content frame');
    
    // Wait for the block to be fully rendered
    const block = await frame.waitForSelector('.hero', { timeout: 30000, state: 'visible' });
    
    // Small delay to ensure layout is stable
    await page.waitForTimeout(1000);

    await block.scrollIntoViewIfNeeded();
    await page.evaluate(el => {
      el.style.overflow = 'visible';
      el.style.maxHeight = 'none';
    }, block);
    
    // Get the bounding box of the block
    const box = await block.boundingBox();
    if (!box) throw new Error('Could not get bounding box for Hero');
    
    // Take a screenshot of only the block area
    const screenshotName = 1 > 1 ? 'hero-variation-0-desktop.png' : 'hero-desktop.png';
    await expect(page).toHaveScreenshot(screenshotName, {
      clip: box,
      timeout: 30000,
      maxDiffPixels: 500,
      threshold: 0.4,
      animations: 'disabled',
      fullPage: box.height > 768
    });
  });

  test('Hero visual test at large viewport', async ({ page }) => {
    // Set viewport size
    await page.setViewportSize({ width: 1440, height: 900 });
    
    // Navigate to the block variation
    await page.goto('http://localhost:3000/tools/sidekick/library.html?plugin=blocks&path=/tools/sidekick/library/templates/hero&index=0&vtest=true');
    
    // Wait for the library component to load
    await page.waitForSelector('sidekick-library', { timeout: 30000 });
    
    // Wait for the iframe to load and switch to its context
    const iframe = await page.waitForSelector('sidekick-library >> sp-theme >> plugin-renderer >> .view block-renderer >> iframe', { timeout: 30000 });
    const frame = await iframe.contentFrame();
    if (!frame) throw new Error('Could not get iframe content frame');
    
    // Wait for the block to be fully rendered
    const block = await frame.waitForSelector('.hero', { timeout: 30000, state: 'visible' });
    
    // Small delay to ensure layout is stable
    await page.waitForTimeout(1000);

    await block.scrollIntoViewIfNeeded();
    await page.evaluate(el => {
      el.style.overflow = 'visible';
      el.style.maxHeight = 'none';
    }, block);
    
    // Get the bounding box of the block
    const box = await block.boundingBox();
    if (!box) throw new Error('Could not get bounding box for Hero');
    
    // Take a screenshot of only the block area
    const screenshotName = 1 > 1 ? 'hero-variation-0-large.png' : 'hero-large.png';
    await expect(page).toHaveScreenshot(screenshotName, {
      clip: box,
      timeout: 30000,
      maxDiffPixels: 500,
      threshold: 0.4,
      animations: 'disabled',
      fullPage: box.height > 900
    });
  });

  test('Tabs variation 0 visual test at mobile viewport', async ({ page }) => {
    // Set viewport size
    await page.setViewportSize({ width: 320, height: 568 });
    
    // Navigate to the block variation
    await page.goto('http://localhost:3000/tools/sidekick/library.html?plugin=blocks&path=/tools/sidekick/library/templates/tabs&index=0&vtest=true');
    
    // Wait for the library component to load
    await page.waitForSelector('sidekick-library', { timeout: 30000 });
    
    // Wait for the iframe to load and switch to its context
    const iframe = await page.waitForSelector('sidekick-library >> sp-theme >> plugin-renderer >> .view block-renderer >> iframe', { timeout: 30000 });
    const frame = await iframe.contentFrame();
    if (!frame) throw new Error('Could not get iframe content frame');
    
    // Wait for the block to be fully rendered
    const block = await frame.waitForSelector('.tabs', { timeout: 30000, state: 'visible' });
    
    // Small delay to ensure layout is stable
    await page.waitForTimeout(1000);

    await block.scrollIntoViewIfNeeded();
    await page.evaluate(el => {
      el.style.overflow = 'visible';
      el.style.maxHeight = 'none';
    }, block);
    
    // Get the bounding box of the block
    const box = await block.boundingBox();
    if (!box) throw new Error('Could not get bounding box for Tabs');
    
    // Take a screenshot of only the block area
    const screenshotName = 2 > 1 ? 'tabs-variation-0-mobile.png' : 'tabs-mobile.png';
    await expect(page).toHaveScreenshot(screenshotName, {
      clip: box,
      timeout: 30000,
      maxDiffPixels: 500,
      threshold: 0.4,
      animations: 'disabled',
      fullPage: box.height > 568
    });
  });

  test('Tabs variation 0 visual test at tablet viewport', async ({ page }) => {
    // Set viewport size
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // Navigate to the block variation
    await page.goto('http://localhost:3000/tools/sidekick/library.html?plugin=blocks&path=/tools/sidekick/library/templates/tabs&index=0&vtest=true');
    
    // Wait for the library component to load
    await page.waitForSelector('sidekick-library', { timeout: 30000 });
    
    // Wait for the iframe to load and switch to its context
    const iframe = await page.waitForSelector('sidekick-library >> sp-theme >> plugin-renderer >> .view block-renderer >> iframe', { timeout: 30000 });
    const frame = await iframe.contentFrame();
    if (!frame) throw new Error('Could not get iframe content frame');
    
    // Wait for the block to be fully rendered
    const block = await frame.waitForSelector('.tabs', { timeout: 30000, state: 'visible' });
    
    // Small delay to ensure layout is stable after breakpoint transition
    await page.waitForTimeout(1000);

    await block.scrollIntoViewIfNeeded();
    await page.evaluate(el => {
      el.style.overflow = 'visible';
      el.style.maxHeight = 'none';
    }, block);
    
    // Get the bounding box of the block
    const box = await block.boundingBox();
    if (!box) throw new Error('Could not get bounding box for Tabs');
    
    // Take a screenshot of only the block area
    const screenshotName = 2 > 1 ? 'tabs-variation-0-tablet.png' : 'tabs-tablet.png';
    await expect(page).toHaveScreenshot(screenshotName, {
      clip: box,
      timeout: 30000,
      maxDiffPixels: 500,
      threshold: 0.4,
      animations: 'disabled',
      fullPage: box.height > 1024
    });
  });

  test('Tabs variation 0 visual test at desktop viewport', async ({ page }) => {
    // Set viewport size
    await page.setViewportSize({ width: 1024, height: 768 });
    
    // Navigate to the block variation
    await page.goto('http://localhost:3000/tools/sidekick/library.html?plugin=blocks&path=/tools/sidekick/library/templates/tabs&index=0&vtest=true');
    
    // Wait for the library component to load
    await page.waitForSelector('sidekick-library', { timeout: 30000 });
    
    // Wait for the iframe to load and switch to its context
    const iframe = await page.waitForSelector('sidekick-library >> sp-theme >> plugin-renderer >> .view block-renderer >> iframe', { timeout: 30000 });
    const frame = await iframe.contentFrame();
    if (!frame) throw new Error('Could not get iframe content frame');
    
    // Wait for the block to be fully rendered
    const block = await frame.waitForSelector('.tabs', { timeout: 30000, state: 'visible' });
    
    // Small delay to ensure layout is stable
    await page.waitForTimeout(1000);

    await block.scrollIntoViewIfNeeded();
    await page.evaluate(el => {
      el.style.overflow = 'visible';
      el.style.maxHeight = 'none';
    }, block);
    
    // Get the bounding box of the block
    const box = await block.boundingBox();
    if (!box) throw new Error('Could not get bounding box for Tabs');
    
    // Take a screenshot of only the block area
    const screenshotName = 2 > 1 ? 'tabs-variation-0-desktop.png' : 'tabs-desktop.png';
    await expect(page).toHaveScreenshot(screenshotName, {
      clip: box,
      timeout: 30000,
      maxDiffPixels: 500,
      threshold: 0.4,
      animations: 'disabled',
      fullPage: box.height > 768
    });
  });

  test('Tabs variation 0 visual test at large viewport', async ({ page }) => {
    // Set viewport size
    await page.setViewportSize({ width: 1440, height: 900 });
    
    // Navigate to the block variation
    await page.goto('http://localhost:3000/tools/sidekick/library.html?plugin=blocks&path=/tools/sidekick/library/templates/tabs&index=0&vtest=true');
    
    // Wait for the library component to load
    await page.waitForSelector('sidekick-library', { timeout: 30000 });
    
    // Wait for the iframe to load and switch to its context
    const iframe = await page.waitForSelector('sidekick-library >> sp-theme >> plugin-renderer >> .view block-renderer >> iframe', { timeout: 30000 });
    const frame = await iframe.contentFrame();
    if (!frame) throw new Error('Could not get iframe content frame');
    
    // Wait for the block to be fully rendered
    const block = await frame.waitForSelector('.tabs', { timeout: 30000, state: 'visible' });
    
    // Small delay to ensure layout is stable
    await page.waitForTimeout(1000);

    await block.scrollIntoViewIfNeeded();
    await page.evaluate(el => {
      el.style.overflow = 'visible';
      el.style.maxHeight = 'none';
    }, block);
    
    // Get the bounding box of the block
    const box = await block.boundingBox();
    if (!box) throw new Error('Could not get bounding box for Tabs');
    
    // Take a screenshot of only the block area
    const screenshotName = 2 > 1 ? 'tabs-variation-0-large.png' : 'tabs-large.png';
    await expect(page).toHaveScreenshot(screenshotName, {
      clip: box,
      timeout: 30000,
      maxDiffPixels: 500,
      threshold: 0.4,
      animations: 'disabled',
      fullPage: box.height > 900
    });
  });

  test('Tabs variation 1 visual test at mobile viewport', async ({ page }) => {
    // Set viewport size
    await page.setViewportSize({ width: 320, height: 568 });
    
    // Navigate to the block variation
    await page.goto('http://localhost:3000/tools/sidekick/library.html?plugin=blocks&path=/tools/sidekick/library/templates/tabs&index=1&vtest=true');
    
    // Wait for the library component to load
    await page.waitForSelector('sidekick-library', { timeout: 30000 });
    
    // Wait for the iframe to load and switch to its context
    const iframe = await page.waitForSelector('sidekick-library >> sp-theme >> plugin-renderer >> .view block-renderer >> iframe', { timeout: 30000 });
    const frame = await iframe.contentFrame();
    if (!frame) throw new Error('Could not get iframe content frame');
    
    // Wait for the block to be fully rendered
    const block = await frame.waitForSelector('.tabs', { timeout: 30000, state: 'visible' });
    
    // Small delay to ensure layout is stable
    await page.waitForTimeout(1000);

    await block.scrollIntoViewIfNeeded();
    await page.evaluate(el => {
      el.style.overflow = 'visible';
      el.style.maxHeight = 'none';
    }, block);
    
    // Get the bounding box of the block
    const box = await block.boundingBox();
    if (!box) throw new Error('Could not get bounding box for Tabs');
    
    // Take a screenshot of only the block area
    const screenshotName = 2 > 1 ? 'tabs-variation-1-mobile.png' : 'tabs-mobile.png';
    await expect(page).toHaveScreenshot(screenshotName, {
      clip: box,
      timeout: 30000,
      maxDiffPixels: 500,
      threshold: 0.4,
      animations: 'disabled',
      fullPage: box.height > 568
    });
  });

  test('Tabs variation 1 visual test at tablet viewport', async ({ page }) => {
    // Set viewport size
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // Navigate to the block variation
    await page.goto('http://localhost:3000/tools/sidekick/library.html?plugin=blocks&path=/tools/sidekick/library/templates/tabs&index=1&vtest=true');
    
    // Wait for the library component to load
    await page.waitForSelector('sidekick-library', { timeout: 30000 });
    
    // Wait for the iframe to load and switch to its context
    const iframe = await page.waitForSelector('sidekick-library >> sp-theme >> plugin-renderer >> .view block-renderer >> iframe', { timeout: 30000 });
    const frame = await iframe.contentFrame();
    if (!frame) throw new Error('Could not get iframe content frame');
    
    // Wait for the block to be fully rendered
    const block = await frame.waitForSelector('.tabs', { timeout: 30000, state: 'visible' });
    
    // Small delay to ensure layout is stable after breakpoint transition
    await page.waitForTimeout(1000);

    await block.scrollIntoViewIfNeeded();
    await page.evaluate(el => {
      el.style.overflow = 'visible';
      el.style.maxHeight = 'none';
    }, block);
    
    // Get the bounding box of the block
    const box = await block.boundingBox();
    if (!box) throw new Error('Could not get bounding box for Tabs');
    
    // Take a screenshot of only the block area
    const screenshotName = 2 > 1 ? 'tabs-variation-1-tablet.png' : 'tabs-tablet.png';
    await expect(page).toHaveScreenshot(screenshotName, {
      clip: box,
      timeout: 30000,
      maxDiffPixels: 500,
      threshold: 0.4,
      animations: 'disabled',
      fullPage: box.height > 1024
    });
  });

  test('Tabs variation 1 visual test at desktop viewport', async ({ page }) => {
    // Set viewport size
    await page.setViewportSize({ width: 1024, height: 768 });
    
    // Navigate to the block variation
    await page.goto('http://localhost:3000/tools/sidekick/library.html?plugin=blocks&path=/tools/sidekick/library/templates/tabs&index=1&vtest=true');
    
    // Wait for the library component to load
    await page.waitForSelector('sidekick-library', { timeout: 30000 });
    
    // Wait for the iframe to load and switch to its context
    const iframe = await page.waitForSelector('sidekick-library >> sp-theme >> plugin-renderer >> .view block-renderer >> iframe', { timeout: 30000 });
    const frame = await iframe.contentFrame();
    if (!frame) throw new Error('Could not get iframe content frame');
    
    // Wait for the block to be fully rendered
    const block = await frame.waitForSelector('.tabs', { timeout: 30000, state: 'visible' });
    
    // Small delay to ensure layout is stable
    await page.waitForTimeout(1000);

    await block.scrollIntoViewIfNeeded();
    await page.evaluate(el => {
      el.style.overflow = 'visible';
      el.style.maxHeight = 'none';
    }, block);
    
    // Get the bounding box of the block
    const box = await block.boundingBox();
    if (!box) throw new Error('Could not get bounding box for Tabs');
    
    // Take a screenshot of only the block area
    const screenshotName = 2 > 1 ? 'tabs-variation-1-desktop.png' : 'tabs-desktop.png';
    await expect(page).toHaveScreenshot(screenshotName, {
      clip: box,
      timeout: 30000,
      maxDiffPixels: 500,
      threshold: 0.4,
      animations: 'disabled',
      fullPage: box.height > 768
    });
  });

  test('Tabs variation 1 visual test at large viewport', async ({ page }) => {
    // Set viewport size
    await page.setViewportSize({ width: 1440, height: 900 });
    
    // Navigate to the block variation
    await page.goto('http://localhost:3000/tools/sidekick/library.html?plugin=blocks&path=/tools/sidekick/library/templates/tabs&index=1&vtest=true');
    
    // Wait for the library component to load
    await page.waitForSelector('sidekick-library', { timeout: 30000 });
    
    // Wait for the iframe to load and switch to its context
    const iframe = await page.waitForSelector('sidekick-library >> sp-theme >> plugin-renderer >> .view block-renderer >> iframe', { timeout: 30000 });
    const frame = await iframe.contentFrame();
    if (!frame) throw new Error('Could not get iframe content frame');
    
    // Wait for the block to be fully rendered
    const block = await frame.waitForSelector('.tabs', { timeout: 30000, state: 'visible' });
    
    // Small delay to ensure layout is stable
    await page.waitForTimeout(1000);

    await block.scrollIntoViewIfNeeded();
    await page.evaluate(el => {
      el.style.overflow = 'visible';
      el.style.maxHeight = 'none';
    }, block);
    
    // Get the bounding box of the block
    const box = await block.boundingBox();
    if (!box) throw new Error('Could not get bounding box for Tabs');
    
    // Take a screenshot of only the block area
    const screenshotName = 2 > 1 ? 'tabs-variation-1-large.png' : 'tabs-large.png';
    await expect(page).toHaveScreenshot(screenshotName, {
      clip: box,
      timeout: 30000,
      maxDiffPixels: 500,
      threshold: 0.4,
      animations: 'disabled',
      fullPage: box.height > 900
    });
  });
});