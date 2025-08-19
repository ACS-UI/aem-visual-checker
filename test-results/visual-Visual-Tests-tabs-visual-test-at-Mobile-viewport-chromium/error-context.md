# Test info

- Name: Visual Tests >> tabs visual test at Mobile viewport
- Location: C:\Users\gsnair\Documents\Projects\eds-test\aem-visual-cheker\tools\visual-tests\visual.spec.js:425:3

# Error details

```
Error: expect(Buffer).toMatchSnapshot(expected)

  6500 pixels (ratio 0.07 of all image pixels) are different.

Expected: C:\Users\gsnair\Documents\Projects\eds-test\aem-visual-cheker\tools\visual-tests\visual.spec.js-snapshots\tabs-0-Mobile.png
Received: C:\Users\gsnair\Documents\Projects\eds-test\aem-visual-cheker\test-results\visual-Visual-Tests-tabs-visual-test-at-Mobile-viewport-chromium\tabs-0-Mobile-actual.png
    Diff: C:\Users\gsnair\Documents\Projects\eds-test\aem-visual-cheker\test-results\visual-Visual-Tests-tabs-visual-test-at-Mobile-viewport-chromium\tabs-0-Mobile-diff.png

    at C:\Users\gsnair\Documents\Projects\eds-test\aem-visual-cheker\tools\visual-tests\visual.spec.js:471:24
```

# Page snapshot

```yaml
- main:
  - iframe
  - separator
  - separator
```

# Test source

```ts
  371 |     });
  372 |   });
  373 |   test('hero visual test at Large viewport', async ({ page }) => {
  374 |     // Set viewport size
  375 |     await page.setViewportSize({ width: 1440, height: 900 });
  376 |     
  377 |     // Navigate to the block variation
  378 |     await page.goto('/tools/sidekick/library.html?plugin=blocks&path=/tools/sidekick/library/templates/hero&index=0&vtest=true');
  379 |     
  380 |     // Wait for the library component to load
  381 |     await page.waitForSelector('sidekick-library', { timeout: 30000 });
  382 |     
  383 |     // Wait for the iframe to load and switch to its context
  384 |     const iframe = await page.waitForSelector('sidekick-library >> sp-theme >> plugin-renderer >> .view block-renderer >> iframe', { timeout: 30000 });
  385 |     const frame = await iframe.contentFrame();
  386 |     if (!frame) throw new Error('Could not get iframe content frame');
  387 |     
  388 |     // Wait for the block to be fully rendered
  389 |     const block = await frame.waitForSelector('.hero', { timeout: 30000, state: 'visible' });
  390 |     
  391 |     // Small delay to ensure layout is stable
  392 |     await page.waitForTimeout(1000);
  393 |
  394 |     await block.scrollIntoViewIfNeeded();
  395 |     await page.evaluate(el => {
  396 |       el.style.overflow = 'visible';
  397 |       el.style.maxHeight = 'none';
  398 |     }, block);
  399 |     
  400 |     // Get the bounding box of the block
  401 |     const box = await block.boundingBox();
  402 |     if (!box) throw new Error('Could not get bounding box for Hero');
  403 |
  404 |     await page.setViewportSize({ 
  405 |       width: 1440,
  406 |       height: Math.round(box.height + box.y),
  407 |     });
  408 |
  409 |     // Take a screenshot of only the block area
  410 |     const screenshotName = 'hero-0-Large.png';
  411 |     const screenshot = await page.screenshot({
  412 |       clip: box,
  413 |       timeout: 30000,
  414 |       animations: 'disabled',
  415 |       type: 'png',
  416 |     });
  417 |
  418 |     // Use strict visual comparison settings for detecting color and layout changes
  419 |     expect(screenshot).toMatchSnapshot(screenshotName, {
  420 |       maxDiffPixels: 500,         // Reduced tolerance for better sensitivity
  421 |       threshold: 0.1,            // 5% color difference tolerance (more sensitive)
  422 |       // maxDiffPixelRatio: 0.005,  // 0.5% of total pixels tolerance
  423 |     });
  424 |   });
  425 |   test('tabs visual test at Mobile viewport', async ({ page }) => {
  426 |     // Set viewport size
  427 |     await page.setViewportSize({ width: 320, height: 568 });
  428 |     
  429 |     // Navigate to the block variation
  430 |     await page.goto('/tools/sidekick/library.html?plugin=blocks&path=/tools/sidekick/library/templates/tabs&index=0&vtest=true');
  431 |     
  432 |     // Wait for the library component to load
  433 |     await page.waitForSelector('sidekick-library', { timeout: 30000 });
  434 |     
  435 |     // Wait for the iframe to load and switch to its context
  436 |     const iframe = await page.waitForSelector('sidekick-library >> sp-theme >> plugin-renderer >> .view block-renderer >> iframe', { timeout: 30000 });
  437 |     const frame = await iframe.contentFrame();
  438 |     if (!frame) throw new Error('Could not get iframe content frame');
  439 |     
  440 |     // Wait for the block to be fully rendered
  441 |     const block = await frame.waitForSelector('.tabs', { timeout: 30000, state: 'visible' });
  442 |     
  443 |     // Small delay to ensure layout is stable
  444 |     await page.waitForTimeout(1000);
  445 |
  446 |     await block.scrollIntoViewIfNeeded();
  447 |     await page.evaluate(el => {
  448 |       el.style.overflow = 'visible';
  449 |       el.style.maxHeight = 'none';
  450 |     }, block);
  451 |     
  452 |     // Get the bounding box of the block
  453 |     const box = await block.boundingBox();
  454 |     if (!box) throw new Error('Could not get bounding box for Tabs');
  455 |
  456 |     await page.setViewportSize({ 
  457 |       width: 320,
  458 |       height: Math.round(box.height + box.y),
  459 |     });
  460 |
  461 |     // Take a screenshot of only the block area
  462 |     const screenshotName = 'tabs-0-Mobile.png';
  463 |     const screenshot = await page.screenshot({
  464 |       clip: box,
  465 |       timeout: 30000,
  466 |       animations: 'disabled',
  467 |       type: 'png',
  468 |     });
  469 |
  470 |     // Use strict visual comparison settings for detecting color and layout changes
> 471 |     expect(screenshot).toMatchSnapshot(screenshotName, {
      |                        ^ Error: expect(Buffer).toMatchSnapshot(expected)
  472 |       maxDiffPixels: 500,         // Reduced tolerance for better sensitivity
  473 |       threshold: 0.1,            // 5% color difference tolerance (more sensitive)
  474 |       // maxDiffPixelRatio: 0.005,  // 0.5% of total pixels tolerance
  475 |     });
  476 |   });
  477 |   test('tabs visual test at Tablet viewport', async ({ page }) => {
  478 |     // Set viewport size
  479 |     await page.setViewportSize({ width: 768, height: 1024 });
  480 |     
  481 |     // Navigate to the block variation
  482 |     await page.goto('/tools/sidekick/library.html?plugin=blocks&path=/tools/sidekick/library/templates/tabs&index=0&vtest=true');
  483 |     
  484 |     // Wait for the library component to load
  485 |     await page.waitForSelector('sidekick-library', { timeout: 30000 });
  486 |     
  487 |     // Wait for the iframe to load and switch to its context
  488 |     const iframe = await page.waitForSelector('sidekick-library >> sp-theme >> plugin-renderer >> .view block-renderer >> iframe', { timeout: 30000 });
  489 |     const frame = await iframe.contentFrame();
  490 |     if (!frame) throw new Error('Could not get iframe content frame');
  491 |     
  492 |     // Wait for the block to be fully rendered
  493 |     const block = await frame.waitForSelector('.tabs', { timeout: 30000, state: 'visible' });
  494 |     
  495 |     // Small delay to ensure layout is stable
  496 |     await page.waitForTimeout(1000);
  497 |
  498 |     await block.scrollIntoViewIfNeeded();
  499 |     await page.evaluate(el => {
  500 |       el.style.overflow = 'visible';
  501 |       el.style.maxHeight = 'none';
  502 |     }, block);
  503 |     
  504 |     // Get the bounding box of the block
  505 |     const box = await block.boundingBox();
  506 |     if (!box) throw new Error('Could not get bounding box for Tabs');
  507 |
  508 |     await page.setViewportSize({ 
  509 |       width: 768,
  510 |       height: Math.round(box.height + box.y),
  511 |     });
  512 |
  513 |     // Take a screenshot of only the block area
  514 |     const screenshotName = 'tabs-0-Tablet.png';
  515 |     const screenshot = await page.screenshot({
  516 |       clip: box,
  517 |       timeout: 30000,
  518 |       animations: 'disabled',
  519 |       type: 'png',
  520 |     });
  521 |
  522 |     // Use strict visual comparison settings for detecting color and layout changes
  523 |     expect(screenshot).toMatchSnapshot(screenshotName, {
  524 |       maxDiffPixels: 500,         // Reduced tolerance for better sensitivity
  525 |       threshold: 0.1,            // 5% color difference tolerance (more sensitive)
  526 |       // maxDiffPixelRatio: 0.005,  // 0.5% of total pixels tolerance
  527 |     });
  528 |   });
  529 |   test('tabs visual test at Desktop viewport', async ({ page }) => {
  530 |     // Set viewport size
  531 |     await page.setViewportSize({ width: 1024, height: 768 });
  532 |     
  533 |     // Navigate to the block variation
  534 |     await page.goto('/tools/sidekick/library.html?plugin=blocks&path=/tools/sidekick/library/templates/tabs&index=0&vtest=true');
  535 |     
  536 |     // Wait for the library component to load
  537 |     await page.waitForSelector('sidekick-library', { timeout: 30000 });
  538 |     
  539 |     // Wait for the iframe to load and switch to its context
  540 |     const iframe = await page.waitForSelector('sidekick-library >> sp-theme >> plugin-renderer >> .view block-renderer >> iframe', { timeout: 30000 });
  541 |     const frame = await iframe.contentFrame();
  542 |     if (!frame) throw new Error('Could not get iframe content frame');
  543 |     
  544 |     // Wait for the block to be fully rendered
  545 |     const block = await frame.waitForSelector('.tabs', { timeout: 30000, state: 'visible' });
  546 |     
  547 |     // Small delay to ensure layout is stable
  548 |     await page.waitForTimeout(1000);
  549 |
  550 |     await block.scrollIntoViewIfNeeded();
  551 |     await page.evaluate(el => {
  552 |       el.style.overflow = 'visible';
  553 |       el.style.maxHeight = 'none';
  554 |     }, block);
  555 |     
  556 |     // Get the bounding box of the block
  557 |     const box = await block.boundingBox();
  558 |     if (!box) throw new Error('Could not get bounding box for Tabs');
  559 |
  560 |     await page.setViewportSize({ 
  561 |       width: 1024,
  562 |       height: Math.round(box.height + box.y),
  563 |     });
  564 |
  565 |     // Take a screenshot of only the block area
  566 |     const screenshotName = 'tabs-0-Desktop.png';
  567 |     const screenshot = await page.screenshot({
  568 |       clip: box,
  569 |       timeout: 30000,
  570 |       animations: 'disabled',
  571 |       type: 'png',
```