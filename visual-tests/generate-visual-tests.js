import fs from 'fs';
import path from 'path';
import http from 'http';

import { VIEWPORTS as configViewports } from '../test-config/config.js';

const VIEWPORTS = configViewports || [
  { width: 320, height: 568, name: 'mobile' },
  { width: 768, height: 1024, name: 'tablet' },
  { width: 1024, height: 768, name: 'desktop' },
  { width: 1440, height: 900, name: 'large' },
];

function fetchLibraryBlocks() {
  return new Promise((resolve) => {
    const options = {
      hostname: '127.0.0.1',
      port: 3000,
      path: '/tools/sidekick/library/library.json',
      method: 'GET',
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData.data || []);
        } catch (error) {
          console.error('Error parsing JSON:', error);
          resolve([]);
        }
      });
    });

    req.on('error', (error) => {
      console.error('Error fetching library blocks:', error);
      resolve([]);
    });

    req.end();
  });
}

function generateTestSpec(blocks) {
  const imports = 'import { test, expect } from \'@playwright/test\';\n\n';
  const testContent = blocks.flatMap((block) => {
    // Determine how many variations this block has
    const variationCount = block.variations || 1;

    // Generate tests for each variation
    const variationTests = [];
    for (let variationIndex = 0; variationIndex < variationCount; variationIndex += 1) {
      const variationSuffix = variationCount > 1 ? ` variation ${variationIndex}` : '';
      const testName = `${block.name}${variationSuffix} visual test`;

      // Generate tests for each viewport for this variation
      const viewportTests = VIEWPORTS.map((viewport) => `
  test('${testName} at ${viewport.name} viewport', async ({ page }) => {
    // Set viewport size
    await page.setViewportSize({ width: ${viewport.width}, height: ${viewport.height} });
    
    // Navigate to the block variation
    await page.goto('/tools/sidekick/library.html?plugin=blocks&path=${block.path}&index=${variationIndex}&vtest=true');
    
    // Wait for the library component to load
    await page.waitForSelector('sidekick-library', { timeout: 30000 });
    
    // Wait for the iframe to load and switch to its context
    const iframe = await page.waitForSelector('sidekick-library >> sp-theme >> plugin-renderer >> .view block-renderer >> iframe', { timeout: 30000 });
    const frame = await iframe.contentFrame();
    if (!frame) throw new Error('Could not get iframe content frame');
    
    // Wait for the block to be fully rendered
    const block = await frame.waitForSelector('.${block.name.toLowerCase()}', { timeout: 30000, state: 'visible' });
    
    // Small delay to ensure layout is stable${viewport.name === 'tablet' ? ' after breakpoint transition' : ''}
    await page.waitForTimeout(1000);

    await block.scrollIntoViewIfNeeded();
    await page.evaluate(el => {
      el.style.overflow = 'visible';
      el.style.maxHeight = 'none';
    }, block);
    
    // Get the bounding box of the block
    const box = await block.boundingBox();
    if (!box) throw new Error('Could not get bounding box for ${block.name}');
    
    // Take a screenshot of only the block area
    const screenshotName = ${variationCount} > 1 ? '${block.name.toLowerCase()}-variation-${variationIndex}-${viewport.name}.png' : '${block.name.toLowerCase()}-${viewport.name}.png';
    await expect(page).toHaveScreenshot(screenshotName, {
      clip: box,
      timeout: 30000,
      maxDiffPixels: 500,
      threshold: 0.4,
      animations: 'disabled',
      fullPage: box.height > ${viewport.height}
    });
  });`);

      variationTests.push(...viewportTests);
    }

    return variationTests;
  }).join('\n');

  return `${imports}test.describe('Visual Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set default viewport size
    await page.setViewportSize({ width: 1280, height: 2000 });
  });
${testContent}\n});`;
}

async function generateVisualTests() {
  // Fetch library blocks
  const blocks = await fetchLibraryBlocks();
  if (blocks.length === 0) {
    console.log('No blocks found in library');
    return;
  }
  console.log('Found blocks:', blocks);
  // Generate test spec content
  const testSpec = generateTestSpec(blocks);
  // Write to test file
  const testDir = 'visual-tests';
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }
  fs.writeFileSync(path.join(testDir, 'visual.spec.js'), testSpec);
  console.log(`Generated visual test spec for ${blocks.length} blocks in visual-tests/visual.spec.js`);
}

// Run the generator
generateVisualTests().catch(console.error);
