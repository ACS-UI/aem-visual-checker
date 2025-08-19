# Test info

- Name: Visual Tests >> hero visual test at Desktop viewport
- Location: C:\Users\gsnair\Documents\Projects\eds-test\aem-visual-cheker\tools\visual-tests\visual.spec.js:321:3

# Error details

```
Error: expect(Buffer).toMatchSnapshot(expected)

  Expected an image 673px by 380px, received 1023px by 380px. 136484 pixels (ratio 0.36 of all image pixels) are different.

Expected: C:\Users\gsnair\Documents\Projects\eds-test\aem-visual-cheker\tools\visual-tests\visual.spec.js-snapshots\hero-0-Desktop.png
Received: C:\Users\gsnair\Documents\Projects\eds-test\aem-visual-cheker\test-results\visual-Visual-Tests-hero-visual-test-at-Desktop-viewport-chromium\hero-0-Desktop-actual.png
    Diff: C:\Users\gsnair\Documents\Projects\eds-test\aem-visual-cheker\test-results\visual-Visual-Tests-hero-visual-test-at-Desktop-viewport-chromium\hero-0-Desktop-diff.png

    at C:\Users\gsnair\Documents\Projects\eds-test\aem-visual-cheker\tools\visual-tests\visual.spec.js:367:24
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
  267 |     });
  268 |   });
  269 |   test('hero visual test at Tablet viewport', async ({ page }) => {
  270 |     // Set viewport size
  271 |     await page.setViewportSize({ width: 768, height: 1024 });
  272 |     
  273 |     // Navigate to the block variation
  274 |     await page.goto('/tools/sidekick/library.html?plugin=blocks&path=/tools/sidekick/library/templates/hero&index=0&vtest=true');
  275 |     
  276 |     // Wait for the library component to load
  277 |     await page.waitForSelector('sidekick-library', { timeout: 30000 });
  278 |     
  279 |     // Wait for the iframe to load and switch to its context
  280 |     const iframe = await page.waitForSelector('sidekick-library >> sp-theme >> plugin-renderer >> .view block-renderer >> iframe', { timeout: 30000 });
  281 |     const frame = await iframe.contentFrame();
  282 |     if (!frame) throw new Error('Could not get iframe content frame');
  283 |     
  284 |     // Wait for the block to be fully rendered
  285 |     const block = await frame.waitForSelector('.hero', { timeout: 30000, state: 'visible' });
  286 |     
  287 |     // Small delay to ensure layout is stable
  288 |     await page.waitForTimeout(1000);
  289 |
  290 |     await block.scrollIntoViewIfNeeded();
  291 |     await page.evaluate(el => {
  292 |       el.style.overflow = 'visible';
  293 |       el.style.maxHeight = 'none';
  294 |     }, block);
  295 |     
  296 |     // Get the bounding box of the block
  297 |     const box = await block.boundingBox();
  298 |     if (!box) throw new Error('Could not get bounding box for Hero');
  299 |
  300 |     await page.setViewportSize({ 
  301 |       width: 768,
  302 |       height: Math.round(box.height + box.y),
  303 |     });
  304 |
  305 |     // Take a screenshot of only the block area
  306 |     const screenshotName = 'hero-0-Tablet.png';
  307 |     const screenshot = await page.screenshot({
  308 |       clip: box,
  309 |       timeout: 30000,
  310 |       animations: 'disabled',
  311 |       type: 'png',
  312 |     });
  313 |
  314 |     // Use strict visual comparison settings for detecting color and layout changes
  315 |     expect(screenshot).toMatchSnapshot(screenshotName, {
  316 |       maxDiffPixels: 500,         // Reduced tolerance for better sensitivity
  317 |       threshold: 0.1,            // 5% color difference tolerance (more sensitive)
  318 |       // maxDiffPixelRatio: 0.005,  // 0.5% of total pixels tolerance
  319 |     });
  320 |   });
  321 |   test('hero visual test at Desktop viewport', async ({ page }) => {
  322 |     // Set viewport size
  323 |     await page.setViewportSize({ width: 1024, height: 768 });
  324 |     
  325 |     // Navigate to the block variation
  326 |     await page.goto('/tools/sidekick/library.html?plugin=blocks&path=/tools/sidekick/library/templates/hero&index=0&vtest=true');
  327 |     
  328 |     // Wait for the library component to load
  329 |     await page.waitForSelector('sidekick-library', { timeout: 30000 });
  330 |     
  331 |     // Wait for the iframe to load and switch to its context
  332 |     const iframe = await page.waitForSelector('sidekick-library >> sp-theme >> plugin-renderer >> .view block-renderer >> iframe', { timeout: 30000 });
  333 |     const frame = await iframe.contentFrame();
  334 |     if (!frame) throw new Error('Could not get iframe content frame');
  335 |     
  336 |     // Wait for the block to be fully rendered
  337 |     const block = await frame.waitForSelector('.hero', { timeout: 30000, state: 'visible' });
  338 |     
  339 |     // Small delay to ensure layout is stable
  340 |     await page.waitForTimeout(1000);
  341 |
  342 |     await block.scrollIntoViewIfNeeded();
  343 |     await page.evaluate(el => {
  344 |       el.style.overflow = 'visible';
  345 |       el.style.maxHeight = 'none';
  346 |     }, block);
  347 |     
  348 |     // Get the bounding box of the block
  349 |     const box = await block.boundingBox();
  350 |     if (!box) throw new Error('Could not get bounding box for Hero');
  351 |
  352 |     await page.setViewportSize({ 
  353 |       width: 1024,
  354 |       height: Math.round(box.height + box.y),
  355 |     });
  356 |
  357 |     // Take a screenshot of only the block area
  358 |     const screenshotName = 'hero-0-Desktop.png';
  359 |     const screenshot = await page.screenshot({
  360 |       clip: box,
  361 |       timeout: 30000,
  362 |       animations: 'disabled',
  363 |       type: 'png',
  364 |     });
  365 |
  366 |     // Use strict visual comparison settings for detecting color and layout changes
> 367 |     expect(screenshot).toMatchSnapshot(screenshotName, {
      |                        ^ Error: expect(Buffer).toMatchSnapshot(expected)
  368 |       maxDiffPixels: 500,         // Reduced tolerance for better sensitivity
  369 |       threshold: 0.1,            // 5% color difference tolerance (more sensitive)
  370 |       // maxDiffPixelRatio: 0.005,  // 0.5% of total pixels tolerance
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
```