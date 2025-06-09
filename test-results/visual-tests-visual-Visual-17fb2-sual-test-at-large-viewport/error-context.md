# Test info

- Name: Visual Tests >> Hero visual test at large viewport
- Location: /Users/sselvara/adobe/adobe/Franklin/aem-visual-cheker/visual-tests/visual.spec.js:138:3

# Error details

```
Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
Call log:
  - navigating to "/tools/sidekick/library.html?plugin=blocks&path=/tools/sidekick/library/templates/hero&index=0&vtest=true", waiting until "load"

    at /Users/sselvara/adobe/adobe/Franklin/aem-visual-cheker/visual-tests/visual.spec.js:143:16
```

# Test source

```ts
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
  115 |
  116 |     await block.scrollIntoViewIfNeeded();
  117 |     await page.evaluate(el => {
  118 |       el.style.overflow = 'visible';
  119 |       el.style.maxHeight = 'none';
  120 |     }, block);
  121 |     
  122 |     // Get the bounding box of the block
  123 |     const box = await block.boundingBox();
  124 |     if (!box) throw new Error('Could not get bounding box for Hero');
  125 |     
  126 |     // Take a screenshot of only the block area
  127 |     const screenshotName = 1 > 1 ? 'hero-variation-0-desktop.png' : 'hero-desktop.png';
  128 |     await expect(page).toHaveScreenshot(screenshotName, {
  129 |       clip: box,
  130 |       timeout: 30000,
  131 |       maxDiffPixels: 500,
  132 |       threshold: 0.4,
  133 |       animations: 'disabled',
  134 |       fullPage: box.height > 768
  135 |     });
  136 |   });
  137 |
  138 |   test('Hero visual test at large viewport', async ({ page }) => {
  139 |     // Set viewport size
  140 |     await page.setViewportSize({ width: 1440, height: 900 });
  141 |     
  142 |     // Navigate to the block variation
> 143 |     await page.goto('/tools/sidekick/library.html?plugin=blocks&path=/tools/sidekick/library/templates/hero&index=0&vtest=true');
      |                ^ Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
  144 |     
  145 |     // Wait for the library component to load
  146 |     await page.waitForSelector('sidekick-library', { timeout: 30000 });
  147 |     
  148 |     // Wait for the iframe to load and switch to its context
  149 |     const iframe = await page.waitForSelector('sidekick-library >> sp-theme >> plugin-renderer >> .view block-renderer >> iframe', { timeout: 30000 });
  150 |     const frame = await iframe.contentFrame();
  151 |     if (!frame) throw new Error('Could not get iframe content frame');
  152 |     
  153 |     // Wait for the block to be fully rendered
  154 |     const block = await frame.waitForSelector('.hero', { timeout: 30000, state: 'visible' });
  155 |     
  156 |     // Small delay to ensure layout is stable
  157 |     await page.waitForTimeout(1000);
  158 |
  159 |     await block.scrollIntoViewIfNeeded();
  160 |     await page.evaluate(el => {
  161 |       el.style.overflow = 'visible';
  162 |       el.style.maxHeight = 'none';
  163 |     }, block);
  164 |     
  165 |     // Get the bounding box of the block
  166 |     const box = await block.boundingBox();
  167 |     if (!box) throw new Error('Could not get bounding box for Hero');
  168 |     
  169 |     // Take a screenshot of only the block area
  170 |     const screenshotName = 1 > 1 ? 'hero-variation-0-large.png' : 'hero-large.png';
  171 |     await expect(page).toHaveScreenshot(screenshotName, {
  172 |       clip: box,
  173 |       timeout: 30000,
  174 |       maxDiffPixels: 500,
  175 |       threshold: 0.4,
  176 |       animations: 'disabled',
  177 |       fullPage: box.height > 900
  178 |     });
  179 |   });
  180 |
  181 |   test('Tabs variation 0 visual test at mobile viewport', async ({ page }) => {
  182 |     // Set viewport size
  183 |     await page.setViewportSize({ width: 320, height: 568 });
  184 |     
  185 |     // Navigate to the block variation
  186 |     await page.goto('/tools/sidekick/library.html?plugin=blocks&path=/tools/sidekick/library/templates/tabs&index=0&vtest=true');
  187 |     
  188 |     // Wait for the library component to load
  189 |     await page.waitForSelector('sidekick-library', { timeout: 30000 });
  190 |     
  191 |     // Wait for the iframe to load and switch to its context
  192 |     const iframe = await page.waitForSelector('sidekick-library >> sp-theme >> plugin-renderer >> .view block-renderer >> iframe', { timeout: 30000 });
  193 |     const frame = await iframe.contentFrame();
  194 |     if (!frame) throw new Error('Could not get iframe content frame');
  195 |     
  196 |     // Wait for the block to be fully rendered
  197 |     const block = await frame.waitForSelector('.tabs', { timeout: 30000, state: 'visible' });
  198 |     
  199 |     // Small delay to ensure layout is stable
  200 |     await page.waitForTimeout(1000);
  201 |
  202 |     await block.scrollIntoViewIfNeeded();
  203 |     await page.evaluate(el => {
  204 |       el.style.overflow = 'visible';
  205 |       el.style.maxHeight = 'none';
  206 |     }, block);
  207 |     
  208 |     // Get the bounding box of the block
  209 |     const box = await block.boundingBox();
  210 |     if (!box) throw new Error('Could not get bounding box for Tabs');
  211 |     
  212 |     // Take a screenshot of only the block area
  213 |     const screenshotName = 2 > 1 ? 'tabs-variation-0-mobile.png' : 'tabs-mobile.png';
  214 |     await expect(page).toHaveScreenshot(screenshotName, {
  215 |       clip: box,
  216 |       timeout: 30000,
  217 |       maxDiffPixels: 500,
  218 |       threshold: 0.4,
  219 |       animations: 'disabled',
  220 |       fullPage: box.height > 568
  221 |     });
  222 |   });
  223 |
  224 |   test('Tabs variation 0 visual test at tablet viewport', async ({ page }) => {
  225 |     // Set viewport size
  226 |     await page.setViewportSize({ width: 768, height: 1024 });
  227 |     
  228 |     // Navigate to the block variation
  229 |     await page.goto('/tools/sidekick/library.html?plugin=blocks&path=/tools/sidekick/library/templates/tabs&index=0&vtest=true');
  230 |     
  231 |     // Wait for the library component to load
  232 |     await page.waitForSelector('sidekick-library', { timeout: 30000 });
  233 |     
  234 |     // Wait for the iframe to load and switch to its context
  235 |     const iframe = await page.waitForSelector('sidekick-library >> sp-theme >> plugin-renderer >> .view block-renderer >> iframe', { timeout: 30000 });
  236 |     const frame = await iframe.contentFrame();
  237 |     if (!frame) throw new Error('Could not get iframe content frame');
  238 |     
  239 |     // Wait for the block to be fully rendered
  240 |     const block = await frame.waitForSelector('.tabs', { timeout: 30000, state: 'visible' });
  241 |     
  242 |     // Small delay to ensure layout is stable after breakpoint transition
  243 |     await page.waitForTimeout(1000);
```