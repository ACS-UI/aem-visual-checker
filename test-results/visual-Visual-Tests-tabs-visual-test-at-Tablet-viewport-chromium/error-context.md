# Test info

- Name: Visual Tests >> tabs visual test at Tablet viewport
- Location: C:\Users\gsnair\Documents\Projects\eds-test\aem-visual-cheker\tools\visual-tests\visual.spec.js:477:3

# Error details

```
Error: expect(Buffer).toMatchSnapshot(expected)

  8225 pixels (ratio 0.05 of all image pixels) are different.

Expected: C:\Users\gsnair\Documents\Projects\eds-test\aem-visual-cheker\tools\visual-tests\visual.spec.js-snapshots\tabs-0-Tablet.png
Received: C:\Users\gsnair\Documents\Projects\eds-test\aem-visual-cheker\test-results\visual-Visual-Tests-tabs-visual-test-at-Tablet-viewport-chromium\tabs-0-Tablet-actual.png
    Diff: C:\Users\gsnair\Documents\Projects\eds-test\aem-visual-cheker\test-results\visual-Visual-Tests-tabs-visual-test-at-Tablet-viewport-chromium\tabs-0-Tablet-diff.png

    at C:\Users\gsnair\Documents\Projects\eds-test\aem-visual-cheker\tools\visual-tests\visual.spec.js:523:24
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
  471 |     expect(screenshot).toMatchSnapshot(screenshotName, {
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
> 523 |     expect(screenshot).toMatchSnapshot(screenshotName, {
      |                        ^ Error: expect(Buffer).toMatchSnapshot(expected)
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
  572 |     });
  573 |
  574 |     // Use strict visual comparison settings for detecting color and layout changes
  575 |     expect(screenshot).toMatchSnapshot(screenshotName, {
  576 |       maxDiffPixels: 500,         // Reduced tolerance for better sensitivity
  577 |       threshold: 0.1,            // 5% color difference tolerance (more sensitive)
  578 |       // maxDiffPixelRatio: 0.005,  // 0.5% of total pixels tolerance
  579 |     });
  580 |   });
  581 |   test('tabs visual test at Large viewport', async ({ page }) => {
  582 |     // Set viewport size
  583 |     await page.setViewportSize({ width: 1440, height: 900 });
  584 |     
  585 |     // Navigate to the block variation
  586 |     await page.goto('/tools/sidekick/library.html?plugin=blocks&path=/tools/sidekick/library/templates/tabs&index=0&vtest=true');
  587 |     
  588 |     // Wait for the library component to load
  589 |     await page.waitForSelector('sidekick-library', { timeout: 30000 });
  590 |     
  591 |     // Wait for the iframe to load and switch to its context
  592 |     const iframe = await page.waitForSelector('sidekick-library >> sp-theme >> plugin-renderer >> .view block-renderer >> iframe', { timeout: 30000 });
  593 |     const frame = await iframe.contentFrame();
  594 |     if (!frame) throw new Error('Could not get iframe content frame');
  595 |     
  596 |     // Wait for the block to be fully rendered
  597 |     const block = await frame.waitForSelector('.tabs', { timeout: 30000, state: 'visible' });
  598 |     
  599 |     // Small delay to ensure layout is stable
  600 |     await page.waitForTimeout(1000);
  601 |
  602 |     await block.scrollIntoViewIfNeeded();
  603 |     await page.evaluate(el => {
  604 |       el.style.overflow = 'visible';
  605 |       el.style.maxHeight = 'none';
  606 |     }, block);
  607 |     
  608 |     // Get the bounding box of the block
  609 |     const box = await block.boundingBox();
  610 |     if (!box) throw new Error('Could not get bounding box for Tabs');
  611 |
  612 |     await page.setViewportSize({ 
  613 |       width: 1440,
  614 |       height: Math.round(box.height + box.y),
  615 |     });
  616 |
  617 |     // Take a screenshot of only the block area
  618 |     const screenshotName = 'tabs-0-Large.png';
  619 |     const screenshot = await page.screenshot({
  620 |       clip: box,
  621 |       timeout: 30000,
  622 |       animations: 'disabled',
  623 |       type: 'png',
```