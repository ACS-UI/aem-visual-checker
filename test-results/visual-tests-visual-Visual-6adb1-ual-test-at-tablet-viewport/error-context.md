# Test info

- Name: Visual Tests >> Tabs variation 1 visual test at tablet viewport
- Location: /Users/sselvara/adobe/adobe/Franklin/aem-visual-cheker/visual-tests/visual.spec.js:396:3

# Error details

```
Error: page.waitForSelector: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('sidekick-library') to be visible
    49 × locator resolved to hidden <sidekick-library></sidekick-library>

    at /Users/sselvara/adobe/adobe/Franklin/aem-visual-cheker/visual-tests/visual.spec.js:404:16
```

# Test source

```ts
  304 |       threshold: 0.4,
  305 |       animations: 'disabled',
  306 |       fullPage: box.height > 768
  307 |     });
  308 |   });
  309 |
  310 |   test('Tabs variation 0 visual test at large viewport', async ({ page }) => {
  311 |     // Set viewport size
  312 |     await page.setViewportSize({ width: 1440, height: 900 });
  313 |     
  314 |     // Navigate to the block variation
  315 |     await page.goto('http://localhost:3000/tools/sidekick/library.html?plugin=blocks&path=/tools/sidekick/library/templates/tabs&index=0&vtest=true');
  316 |     
  317 |     // Wait for the library component to load
  318 |     await page.waitForSelector('sidekick-library', { timeout: 30000 });
  319 |     
  320 |     // Wait for the iframe to load and switch to its context
  321 |     const iframe = await page.waitForSelector('sidekick-library >> sp-theme >> plugin-renderer >> .view block-renderer >> iframe', { timeout: 30000 });
  322 |     const frame = await iframe.contentFrame();
  323 |     if (!frame) throw new Error('Could not get iframe content frame');
  324 |     
  325 |     // Wait for the block to be fully rendered
  326 |     const block = await frame.waitForSelector('.tabs', { timeout: 30000, state: 'visible' });
  327 |     
  328 |     // Small delay to ensure layout is stable
  329 |     await page.waitForTimeout(1000);
  330 |
  331 |     await block.scrollIntoViewIfNeeded();
  332 |     await page.evaluate(el => {
  333 |       el.style.overflow = 'visible';
  334 |       el.style.maxHeight = 'none';
  335 |     }, block);
  336 |     
  337 |     // Get the bounding box of the block
  338 |     const box = await block.boundingBox();
  339 |     if (!box) throw new Error('Could not get bounding box for Tabs');
  340 |     
  341 |     // Take a screenshot of only the block area
  342 |     const screenshotName = 2 > 1 ? 'tabs-variation-0-large.png' : 'tabs-large.png';
  343 |     await expect(page).toHaveScreenshot(screenshotName, {
  344 |       clip: box,
  345 |       timeout: 30000,
  346 |       maxDiffPixels: 500,
  347 |       threshold: 0.4,
  348 |       animations: 'disabled',
  349 |       fullPage: box.height > 900
  350 |     });
  351 |   });
  352 |
  353 |   test('Tabs variation 1 visual test at mobile viewport', async ({ page }) => {
  354 |     // Set viewport size
  355 |     await page.setViewportSize({ width: 320, height: 568 });
  356 |     
  357 |     // Navigate to the block variation
  358 |     await page.goto('http://localhost:3000/tools/sidekick/library.html?plugin=blocks&path=/tools/sidekick/library/templates/tabs&index=1&vtest=true');
  359 |     
  360 |     // Wait for the library component to load
  361 |     await page.waitForSelector('sidekick-library', { timeout: 30000 });
  362 |     
  363 |     // Wait for the iframe to load and switch to its context
  364 |     const iframe = await page.waitForSelector('sidekick-library >> sp-theme >> plugin-renderer >> .view block-renderer >> iframe', { timeout: 30000 });
  365 |     const frame = await iframe.contentFrame();
  366 |     if (!frame) throw new Error('Could not get iframe content frame');
  367 |     
  368 |     // Wait for the block to be fully rendered
  369 |     const block = await frame.waitForSelector('.tabs', { timeout: 30000, state: 'visible' });
  370 |     
  371 |     // Small delay to ensure layout is stable
  372 |     await page.waitForTimeout(1000);
  373 |
  374 |     await block.scrollIntoViewIfNeeded();
  375 |     await page.evaluate(el => {
  376 |       el.style.overflow = 'visible';
  377 |       el.style.maxHeight = 'none';
  378 |     }, block);
  379 |     
  380 |     // Get the bounding box of the block
  381 |     const box = await block.boundingBox();
  382 |     if (!box) throw new Error('Could not get bounding box for Tabs');
  383 |     
  384 |     // Take a screenshot of only the block area
  385 |     const screenshotName = 2 > 1 ? 'tabs-variation-1-mobile.png' : 'tabs-mobile.png';
  386 |     await expect(page).toHaveScreenshot(screenshotName, {
  387 |       clip: box,
  388 |       timeout: 30000,
  389 |       maxDiffPixels: 500,
  390 |       threshold: 0.4,
  391 |       animations: 'disabled',
  392 |       fullPage: box.height > 568
  393 |     });
  394 |   });
  395 |
  396 |   test('Tabs variation 1 visual test at tablet viewport', async ({ page }) => {
  397 |     // Set viewport size
  398 |     await page.setViewportSize({ width: 768, height: 1024 });
  399 |     
  400 |     // Navigate to the block variation
  401 |     await page.goto('http://localhost:3000/tools/sidekick/library.html?plugin=blocks&path=/tools/sidekick/library/templates/tabs&index=1&vtest=true');
  402 |     
  403 |     // Wait for the library component to load
> 404 |     await page.waitForSelector('sidekick-library', { timeout: 30000 });
      |                ^ Error: page.waitForSelector: Test timeout of 30000ms exceeded.
  405 |     
  406 |     // Wait for the iframe to load and switch to its context
  407 |     const iframe = await page.waitForSelector('sidekick-library >> sp-theme >> plugin-renderer >> .view block-renderer >> iframe', { timeout: 30000 });
  408 |     const frame = await iframe.contentFrame();
  409 |     if (!frame) throw new Error('Could not get iframe content frame');
  410 |     
  411 |     // Wait for the block to be fully rendered
  412 |     const block = await frame.waitForSelector('.tabs', { timeout: 30000, state: 'visible' });
  413 |     
  414 |     // Small delay to ensure layout is stable after breakpoint transition
  415 |     await page.waitForTimeout(1000);
  416 |
  417 |     await block.scrollIntoViewIfNeeded();
  418 |     await page.evaluate(el => {
  419 |       el.style.overflow = 'visible';
  420 |       el.style.maxHeight = 'none';
  421 |     }, block);
  422 |     
  423 |     // Get the bounding box of the block
  424 |     const box = await block.boundingBox();
  425 |     if (!box) throw new Error('Could not get bounding box for Tabs');
  426 |     
  427 |     // Take a screenshot of only the block area
  428 |     const screenshotName = 2 > 1 ? 'tabs-variation-1-tablet.png' : 'tabs-tablet.png';
  429 |     await expect(page).toHaveScreenshot(screenshotName, {
  430 |       clip: box,
  431 |       timeout: 30000,
  432 |       maxDiffPixels: 500,
  433 |       threshold: 0.4,
  434 |       animations: 'disabled',
  435 |       fullPage: box.height > 1024
  436 |     });
  437 |   });
  438 |
  439 |   test('Tabs variation 1 visual test at desktop viewport', async ({ page }) => {
  440 |     // Set viewport size
  441 |     await page.setViewportSize({ width: 1024, height: 768 });
  442 |     
  443 |     // Navigate to the block variation
  444 |     await page.goto('http://localhost:3000/tools/sidekick/library.html?plugin=blocks&path=/tools/sidekick/library/templates/tabs&index=1&vtest=true');
  445 |     
  446 |     // Wait for the library component to load
  447 |     await page.waitForSelector('sidekick-library', { timeout: 30000 });
  448 |     
  449 |     // Wait for the iframe to load and switch to its context
  450 |     const iframe = await page.waitForSelector('sidekick-library >> sp-theme >> plugin-renderer >> .view block-renderer >> iframe', { timeout: 30000 });
  451 |     const frame = await iframe.contentFrame();
  452 |     if (!frame) throw new Error('Could not get iframe content frame');
  453 |     
  454 |     // Wait for the block to be fully rendered
  455 |     const block = await frame.waitForSelector('.tabs', { timeout: 30000, state: 'visible' });
  456 |     
  457 |     // Small delay to ensure layout is stable
  458 |     await page.waitForTimeout(1000);
  459 |
  460 |     await block.scrollIntoViewIfNeeded();
  461 |     await page.evaluate(el => {
  462 |       el.style.overflow = 'visible';
  463 |       el.style.maxHeight = 'none';
  464 |     }, block);
  465 |     
  466 |     // Get the bounding box of the block
  467 |     const box = await block.boundingBox();
  468 |     if (!box) throw new Error('Could not get bounding box for Tabs');
  469 |     
  470 |     // Take a screenshot of only the block area
  471 |     const screenshotName = 2 > 1 ? 'tabs-variation-1-desktop.png' : 'tabs-desktop.png';
  472 |     await expect(page).toHaveScreenshot(screenshotName, {
  473 |       clip: box,
  474 |       timeout: 30000,
  475 |       maxDiffPixels: 500,
  476 |       threshold: 0.4,
  477 |       animations: 'disabled',
  478 |       fullPage: box.height > 768
  479 |     });
  480 |   });
  481 |
  482 |   test('Tabs variation 1 visual test at large viewport', async ({ page }) => {
  483 |     // Set viewport size
  484 |     await page.setViewportSize({ width: 1440, height: 900 });
  485 |     
  486 |     // Navigate to the block variation
  487 |     await page.goto('http://localhost:3000/tools/sidekick/library.html?plugin=blocks&path=/tools/sidekick/library/templates/tabs&index=1&vtest=true');
  488 |     
  489 |     // Wait for the library component to load
  490 |     await page.waitForSelector('sidekick-library', { timeout: 30000 });
  491 |     
  492 |     // Wait for the iframe to load and switch to its context
  493 |     const iframe = await page.waitForSelector('sidekick-library >> sp-theme >> plugin-renderer >> .view block-renderer >> iframe', { timeout: 30000 });
  494 |     const frame = await iframe.contentFrame();
  495 |     if (!frame) throw new Error('Could not get iframe content frame');
  496 |     
  497 |     // Wait for the block to be fully rendered
  498 |     const block = await frame.waitForSelector('.tabs', { timeout: 30000, state: 'visible' });
  499 |     
  500 |     // Small delay to ensure layout is stable
  501 |     await page.waitForTimeout(1000);
  502 |
  503 |     await block.scrollIntoViewIfNeeded();
  504 |     await page.evaluate(el => {
```