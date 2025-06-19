import { test, expect } from '@playwright/test';

test.describe('Visual Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set default viewport size
    await page.setViewportSize({ width: 1280, height: 2000 });
  });

  test('cards visual test at mobile viewport', async ({ page }) => {
    // Set viewport size
    await page.setViewportSize({ width: 320, height: 568 });
    
    // Navigate to the block variation
    await page.goto('/tools/sidekick/library.html?plugin=blocks&path=/tools/sidekick/library/templates/cards&index=0&vtest=true');
    
    // Wait for the library component to load
    await page.waitForSelector('sidekick-library', { timeout: 30000 });
    
    // Wait for the iframe to load and switch to its context
    const iframe = await page.waitForSelector('sidekick-library >> sp-theme >> plugin-renderer >> .view block-renderer >> iframe', { timeout: 30000 });
    const frame = await iframe.contentFrame();
    if (!frame) throw new Error('Could not get iframe content frame');
    
    // Wait for the block to be fully rendered
    const block = await frame.waitForSelector('.cards', { timeout: 30000, state: 'visible' });
    
    // Small delay to ensure layout is stable
    await page.waitForTimeout(1000);

    await block.scrollIntoViewIfNeeded();
    await page.evaluate(el => {
      el.style.overflow = 'visible';
      el.style.maxHeight = 'none';
    }, block);
    
    // Get the bounding box of the block
    const box = await block.boundingBox();
    if (!box) throw new Error('Could not get bounding box for Cards');
    
    // Take a screenshot of only the block area
    const screenshotName = 'cards-0-mobile.png';
    await expect(page).toHaveScreenshot(screenshotName, {
      clip: box,
      timeout: 30000,
      maxDiffPixels: 500,
      threshold: 0.1,
      animations: 'disabled',
      fullPage: box.height > 568
    });
  });
  test('cards visual test at tablet viewport', async ({ page }) => {
    // Set viewport size
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // Navigate to the block variation
    await page.goto('/tools/sidekick/library.html?plugin=blocks&path=/tools/sidekick/library/templates/cards&index=0&vtest=true');
    
    // Wait for the library component to load
    await page.waitForSelector('sidekick-library', { timeout: 30000 });
    
    // Wait for the iframe to load and switch to its context
    const iframe = await page.waitForSelector('sidekick-library >> sp-theme >> plugin-renderer >> .view block-renderer >> iframe', { timeout: 30000 });
    const frame = await iframe.contentFrame();
    if (!frame) throw new Error('Could not get iframe content frame');
    
    // Wait for the block to be fully rendered
    const block = await frame.waitForSelector('.cards', { timeout: 30000, state: 'visible' });
    
    // Small delay to ensure layout is stable after breakpoint transition
    await page.waitForTimeout(1000);

    await block.scrollIntoViewIfNeeded();
    await page.evaluate(el => {
      el.style.overflow = 'visible';
      el.style.maxHeight = 'none';
    }, block);
    
    // Get the bounding box of the block
    const box = await block.boundingBox();
    if (!box) throw new Error('Could not get bounding box for Cards');
    
    // Take a screenshot of only the block area
    const screenshotName = 'cards-0-tablet.png';
    await expect(page).toHaveScreenshot(screenshotName, {
      clip: box,
      timeout: 30000,
      maxDiffPixels: 500,
      threshold: 0.1,
      animations: 'disabled',
      fullPage: box.height > 1024
    });
  });
  test('cards visual test at desktop viewport', async ({ page }) => {
    // Set viewport size
    await page.setViewportSize({ width: 1024, height: 768 });
    
    // Navigate to the block variation
    await page.goto('/tools/sidekick/library.html?plugin=blocks&path=/tools/sidekick/library/templates/cards&index=0&vtest=true');
    
    // Wait for the library component to load
    await page.waitForSelector('sidekick-library', { timeout: 30000 });
    
    // Wait for the iframe to load and switch to its context
    const iframe = await page.waitForSelector('sidekick-library >> sp-theme >> plugin-renderer >> .view block-renderer >> iframe', { timeout: 30000 });
    const frame = await iframe.contentFrame();
    if (!frame) throw new Error('Could not get iframe content frame');
    
    // Wait for the block to be fully rendered
    const block = await frame.waitForSelector('.cards', { timeout: 30000, state: 'visible' });
    
    // Small delay to ensure layout is stable
    await page.waitForTimeout(1000);

    await block.scrollIntoViewIfNeeded();
    await page.evaluate(el => {
      el.style.overflow = 'visible';
      el.style.maxHeight = 'none';
    }, block);
    
    // Get the bounding box of the block
    const box = await block.boundingBox();
    if (!box) throw new Error('Could not get bounding box for Cards');
    
    // Take a screenshot of only the block area
    const screenshotName = 'cards-0-desktop.png';
    await expect(page).toHaveScreenshot(screenshotName, {
      clip: box,
      timeout: 30000,
      maxDiffPixels: 500,
      threshold: 0.1,
      animations: 'disabled',
      fullPage: box.height > 768
    });
  });
  test('cards visual test at large viewport', async ({ page }) => {
    // Set viewport size
    await page.setViewportSize({ width: 1440, height: 900 });
    
    // Navigate to the block variation
    await page.goto('/tools/sidekick/library.html?plugin=blocks&path=/tools/sidekick/library/templates/cards&index=0&vtest=true');
    
    // Wait for the library component to load
    await page.waitForSelector('sidekick-library', { timeout: 30000 });
    
    // Wait for the iframe to load and switch to its context
    const iframe = await page.waitForSelector('sidekick-library >> sp-theme >> plugin-renderer >> .view block-renderer >> iframe', { timeout: 30000 });
    const frame = await iframe.contentFrame();
    if (!frame) throw new Error('Could not get iframe content frame');
    
    // Wait for the block to be fully rendered
    const block = await frame.waitForSelector('.cards', { timeout: 30000, state: 'visible' });
    
    // Small delay to ensure layout is stable
    await page.waitForTimeout(1000);

    await block.scrollIntoViewIfNeeded();
    await page.evaluate(el => {
      el.style.overflow = 'visible';
      el.style.maxHeight = 'none';
    }, block);
    
    // Get the bounding box of the block
    const box = await block.boundingBox();
    if (!box) throw new Error('Could not get bounding box for Cards');
    
    // Take a screenshot of only the block area
    const screenshotName = 'cards-0-large.png';
    await expect(page).toHaveScreenshot(screenshotName, {
      clip: box,
      timeout: 30000,
      maxDiffPixels: 500,
      threshold: 0.1,
      animations: 'disabled',
      fullPage: box.height > 900
    });
  });
  test('hero visual test at mobile viewport', async ({ page }) => {
    // Set viewport size
    await page.setViewportSize({ width: 320, height: 568 });
    
    // Navigate to the block variation
    await page.goto('/tools/sidekick/library.html?plugin=blocks&path=/tools/sidekick/library/templates/hero&index=0&vtest=true');
    
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
    const screenshotName = 'hero-0-mobile.png';
    await expect(page).toHaveScreenshot(screenshotName, {
      clip: box,
      timeout: 30000,
      maxDiffPixels: 500,
      threshold: 0.1,
      animations: 'disabled',
      fullPage: box.height > 568
    });
  });
  test('hero visual test at tablet viewport', async ({ page }) => {
    // Set viewport size
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // Navigate to the block variation
    await page.goto('/tools/sidekick/library.html?plugin=blocks&path=/tools/sidekick/library/templates/hero&index=0&vtest=true');
    
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
    const screenshotName = 'hero-0-tablet.png';
    await expect(page).toHaveScreenshot(screenshotName, {
      clip: box,
      timeout: 30000,
      maxDiffPixels: 500,
      threshold: 0.1,
      animations: 'disabled',
      fullPage: box.height > 1024
    });
  });
  test('hero visual test at desktop viewport', async ({ page }) => {
    // Set viewport size
    await page.setViewportSize({ width: 1024, height: 768 });
    
    // Navigate to the block variation
    await page.goto('/tools/sidekick/library.html?plugin=blocks&path=/tools/sidekick/library/templates/hero&index=0&vtest=true');
    
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
    const screenshotName = 'hero-0-desktop.png';
    await expect(page).toHaveScreenshot(screenshotName, {
      clip: box,
      timeout: 30000,
      maxDiffPixels: 500,
      threshold: 0.1,
      animations: 'disabled',
      fullPage: box.height > 768
    });
  });
  test('hero visual test at large viewport', async ({ page }) => {
    // Set viewport size
    await page.setViewportSize({ width: 1440, height: 900 });
    
    // Navigate to the block variation
    await page.goto('/tools/sidekick/library.html?plugin=blocks&path=/tools/sidekick/library/templates/hero&index=0&vtest=true');
    
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
    const screenshotName = 'hero-0-large.png';
    await expect(page).toHaveScreenshot(screenshotName, {
      clip: box,
      timeout: 30000,
      maxDiffPixels: 500,
      threshold: 0.1,
      animations: 'disabled',
      fullPage: box.height > 900
    });
  });
  test('tabs visual test at mobile viewport', async ({ page }) => {
    // Set viewport size
    await page.setViewportSize({ width: 320, height: 568 });
    
    // Navigate to the block variation
    await page.goto('/tools/sidekick/library.html?plugin=blocks&path=/tools/sidekick/library/templates/tabs&index=0&vtest=true');
    
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
    const screenshotName = 'tabs-0-mobile.png';
    await expect(page).toHaveScreenshot(screenshotName, {
      clip: box,
      timeout: 30000,
      maxDiffPixels: 500,
      threshold: 0.1,
      animations: 'disabled',
      fullPage: box.height > 568
    });
  });
  test('tabs visual test at tablet viewport', async ({ page }) => {
    // Set viewport size
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // Navigate to the block variation
    await page.goto('/tools/sidekick/library.html?plugin=blocks&path=/tools/sidekick/library/templates/tabs&index=0&vtest=true');
    
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
    const screenshotName = 'tabs-0-tablet.png';
    await expect(page).toHaveScreenshot(screenshotName, {
      clip: box,
      timeout: 30000,
      maxDiffPixels: 500,
      threshold: 0.1,
      animations: 'disabled',
      fullPage: box.height > 1024
    });
  });
  test('tabs visual test at desktop viewport', async ({ page }) => {
    // Set viewport size
    await page.setViewportSize({ width: 1024, height: 768 });
    
    // Navigate to the block variation
    await page.goto('/tools/sidekick/library.html?plugin=blocks&path=/tools/sidekick/library/templates/tabs&index=0&vtest=true');
    
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
    const screenshotName = 'tabs-0-desktop.png';
    await expect(page).toHaveScreenshot(screenshotName, {
      clip: box,
      timeout: 30000,
      maxDiffPixels: 500,
      threshold: 0.1,
      animations: 'disabled',
      fullPage: box.height > 768
    });
  });
  test('tabs visual test at large viewport', async ({ page }) => {
    // Set viewport size
    await page.setViewportSize({ width: 1440, height: 900 });
    
    // Navigate to the block variation
    await page.goto('/tools/sidekick/library.html?plugin=blocks&path=/tools/sidekick/library/templates/tabs&index=0&vtest=true');
    
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
    const screenshotName = 'tabs-0-large.png';
    await expect(page).toHaveScreenshot(screenshotName, {
      clip: box,
      timeout: 30000,
      maxDiffPixels: 500,
      threshold: 0.1,
      animations: 'disabled',
      fullPage: box.height > 900
    });
  });
  test('tabs (reverse) visual test at mobile viewport', async ({ page }) => {
    // Set viewport size
    await page.setViewportSize({ width: 320, height: 568 });
    
    // Navigate to the block variation
    await page.goto('/tools/sidekick/library.html?plugin=blocks&path=/tools/sidekick/library/templates/tabs&index=1&vtest=true');
    
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
    const screenshotName = 'tabs-1-mobile.png';
    await expect(page).toHaveScreenshot(screenshotName, {
      clip: box,
      timeout: 30000,
      maxDiffPixels: 500,
      threshold: 0.1,
      animations: 'disabled',
      fullPage: box.height > 568
    });
  });
  test('tabs (reverse) visual test at tablet viewport', async ({ page }) => {
    // Set viewport size
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // Navigate to the block variation
    await page.goto('/tools/sidekick/library.html?plugin=blocks&path=/tools/sidekick/library/templates/tabs&index=1&vtest=true');
    
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
    const screenshotName = 'tabs-1-tablet.png';
    await expect(page).toHaveScreenshot(screenshotName, {
      clip: box,
      timeout: 30000,
      maxDiffPixels: 500,
      threshold: 0.1,
      animations: 'disabled',
      fullPage: box.height > 1024
    });
  });
  test('tabs (reverse) visual test at desktop viewport', async ({ page }) => {
    // Set viewport size
    await page.setViewportSize({ width: 1024, height: 768 });
    
    // Navigate to the block variation
    await page.goto('/tools/sidekick/library.html?plugin=blocks&path=/tools/sidekick/library/templates/tabs&index=1&vtest=true');
    
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
    const screenshotName = 'tabs-1-desktop.png';
    await expect(page).toHaveScreenshot(screenshotName, {
      clip: box,
      timeout: 30000,
      maxDiffPixels: 500,
      threshold: 0.1,
      animations: 'disabled',
      fullPage: box.height > 768
    });
  });
  test('tabs (reverse) visual test at large viewport', async ({ page }) => {
    // Set viewport size
    await page.setViewportSize({ width: 1440, height: 900 });
    
    // Navigate to the block variation
    await page.goto('/tools/sidekick/library.html?plugin=blocks&path=/tools/sidekick/library/templates/tabs&index=1&vtest=true');
    
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
    const screenshotName = 'tabs-1-large.png';
    await expect(page).toHaveScreenshot(screenshotName, {
      clip: box,
      timeout: 30000,
      maxDiffPixels: 500,
      threshold: 0.1,
      animations: 'disabled',
      fullPage: box.height > 900
    });
  });
});