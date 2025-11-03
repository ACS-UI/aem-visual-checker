# Visual Testing Framework - Quick Reference Guide

A quick reference for commands, workflows, and troubleshooting.

---

## 📋 Command Reference

### Setup Commands

```bash
# Install dependencies
npm install

# Setup environment
echo "FIGMA_ACCESS_TOKEN=your_token_here" > .env

# Start both servers (AEM + Test Server)
npm start
```

### Testing Commands

```bash
# Run all visual tests
npm run test:visual

# Run tests in UI mode (interactive)
npm run test:visual:ui

# Run tests for all blocks
npm run test:visual:blocks

# Run tests for specific block
npm run test:visual:block -- tools/visual-tests/blocks/cards

# Update all snapshots
npm run test:visual:update

# Update snapshots for specific block
npm run test:visual:block:update -- tools/visual-tests/blocks/cards

# View test report
npm run test:visual:report
```

### Figma Commands

```bash
# Download all images from Figma
npm run test:visual:figma

# Generate test files from library
npm run test:visual:generate
```

### Server Commands

```bash
# Start test server only
npm run test:visual:server

# Start both servers concurrently
npm start
```

---

## 🔄 Common Workflows

### Workflow 1: Adding a New Block

```bash
# 1. Create block folder
mkdir -p tools/visual-tests/blocks/my-block

# 2. Create config.js
cat > tools/visual-tests/blocks/my-block/config.js << 'EOF'
export const FIGMA_CONFIG = [
  {
    name: 'my-block-0-Desktop',
    figmaUrl: 'https://www.figma.com/design/YOUR_FILE_ID/...?node-id=1-2',
    format: 'png',
    scale: 1,
  },
  {
    name: 'my-block-0-Mobile',
    figmaUrl: 'https://www.figma.com/design/YOUR_FILE_ID/...?node-id=1-3',
    format: 'png',
    scale: 2,
  },
];
EOF

# 3. Download Figma baselines
npm run test:visual:figma

# 4. Generate test file
npm run test:visual:generate

# 5. Run tests
npm run test:visual:block -- tools/visual-tests/blocks/my-block
```

### Workflow 2: Updating Design from Figma

```bash
# 1. Designer updates Figma design
# 2. Download updated baselines
npm run test:visual:figma

# 3. Run tests to verify implementation
npm run test:visual:block -- tools/visual-tests/blocks/cards

# 4. If tests fail, update implementation
# 5. Re-run tests until they pass
```

### Workflow 3: Interactive Testing

```bash
# 1. Start servers
npm start

# 2. Open browser
# Navigate to: http://localhost:3000/tools/sidekick/library.html?plugin=blocks

# 3. Select a block from sidebar

# 4. Click "Run Test" button

# 5. View results in modal
```

### Workflow 4: CI/CD Integration

```bash
# In CI environment
export CI=true

# Run tests
npm run test:visual

# Tests will:
# - Retry failed tests 2 times
# - Run with single worker
# - Generate HTML report
# - Fail build if tests fail
```

---

## 📁 File Structure Quick Reference

```
tools/visual-tests/
├── blocks/                              # Block-specific tests
│   ├── [block-name]/
│   │   ├── [block-name].spec.js        # Test file
│   │   ├── config.js                    # Figma config (optional)
│   │   └── [block-name].spec.js-snapshots/
│   │       ├── [block-name]-0-Desktop.png
│   │       ├── [block-name]-0-Mobile.png
│   │       ├── [block-name]-0-Tablet.png
│   │       └── [block-name]-0-Large.png
│   └── ...
├── figma-util.js                        # Figma integration
├── generate-visual-tests.js             # Test generator
├── visual-test.js                       # UI integration
├── server.js                            # Test server
├── start-visual-test-server.js          # Server starter
└── package.json                         # Dependencies
```

---

## ⚙️ Configuration Quick Reference

### Environment Variables (.env)

```env
# Required for Figma integration
FIGMA_ACCESS_TOKEN=figd_xxxxxxxxxxxxxxxxxxxxx

# Optional server configuration
PORT=3001

# CI environment flag
CI=false
```

### Global Config (test-config/config.js)

```javascript
export const VIEWPORTS = [
  { width: '320px', height: '568px', label: 'Mobile', icon: 'device-phone' },
  { width: '768px', height: '1024px', label: 'Tablet', icon: 'device-tablet' },
  { width: '1024px', height: '768px', label: 'Desktop', icon: 'device-desktop' },
  { width: '1440px', height: '900px', label: 'Large', icon: 'device-desktop', default: true },
];

export const OVERLAY = {
  imageRoot: '/tools/visual-tests/blocks',
};

export const SIDEKICK_CONFIG = {
  JSONPath: '/tools/sidekick/library/library.json',
  templatesPath: '/tools/sidekick/library/templates/',
};
```

### Block Config (blocks/[block]/config.js)

```javascript
export const FIGMA_CONFIG = [
  {
    name: 'block-0-Desktop',              // Snapshot filename
    figmaUrl: 'https://figma.com/...',    // Figma design URL
    format: 'png',                         // Image format
    scale: 1,                              // Scale factor
  },
];
```

### Playwright Config (playwright.config.ts)

```typescript
export default defineConfig({
  testDir: './tools/visual-tests',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  snapshotPathTemplate: '{testDir}/{testFileDir}/{testFileName}-snapshots/{arg}{ext}',
});
```

---

## 🔧 Troubleshooting Guide

### Issue: "Port already in use"

**Error:**
```
Error: listen EADDRINUSE: address already in use :::3001
```

**Solution:**
```bash
# Server automatically finds next available port
# Check actual port in tools/visual-tests/port.txt
cat tools/visual-tests/port.txt

# Or kill existing process
# Windows:
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3001 | xargs kill -9
```

### Issue: "Figma token required"

**Error:**
```
Error: Figma token is required. Set FIGMA_TOKEN environment variable
```

**Solution:**
```bash
# Create .env file with token
echo "FIGMA_ACCESS_TOKEN=your_token_here" > .env

# Get token from Figma:
# 1. Go to Figma → Settings → Account
# 2. Scroll to "Personal Access Tokens"
# 3. Click "Create new token"
# 4. Copy token and add to .env
```

### Issue: "Screenshot comparison failed"

**Error:**
```
Error: Screenshot comparison failed
Expected: 1000x800
Received: 1000x810
```

**Solution:**
```bash
# If changes are intentional, update snapshots
npm run test:visual:update

# Or update specific block
npm run test:visual:block:update -- tools/visual-tests/blocks/cards

# Or download fresh from Figma
npm run test:visual:figma
```

### Issue: "Block not found"

**Error:**
```
Error: Could not get bounding box for .cards
```

**Solution:**
1. Check block CSS class name matches selector
2. Verify block is rendered in library
3. Check block path in test configuration
4. Increase timeout in test file:
```javascript
const block = await frame.waitForSelector('.cards', { 
  timeout: 60000,  // Increase to 60 seconds
  state: 'visible' 
});
```

### Issue: "Test server not running"

**Error:**
```
Red indicator in UI: "Server is not running"
```

**Solution:**
```bash
# Start test server
npm run test:visual:server

# Or start both servers
npm start

# Check server health
curl http://localhost:3001/api/health
# Should return: {"status":"ok"}
```

### Issue: "Tests pass locally but fail in CI"

**Possible Causes:**
1. Font rendering differences
2. Timing issues
3. Different viewport sizes
4. Missing dependencies

**Solution:**
```bash
# 1. Ensure CI uses same Node version
# Check .nvmrc or package.json engines

# 2. Install all dependencies in CI
npm ci  # Instead of npm install

# 3. Increase retries in CI
# Already configured: retries: process.env.CI ? 2 : 0

# 4. Generate snapshots in CI environment
npm run test:visual:update
# Commit CI-generated snapshots
```

### Issue: "Figma download fails"

**Error:**
```
Error: Figma API request failed with status 403
```

**Solution:**
1. Check token is valid and not expired
2. Verify token has read access to file
3. Check Figma file is not private
4. Ensure node-id is correct in URL

```bash
# Test Figma API directly
curl -H "X-Figma-Token: YOUR_TOKEN" \
  "https://api.figma.com/v1/files/YOUR_FILE_ID"
```

---

## 📊 Snapshot Naming Convention

### Format
```
[block-name]-[variation-index]-[Viewport].png
```

### Examples
```
cards-0-Desktop.png      # Cards block, variation 0, Desktop viewport
cards-0-Mobile.png       # Cards block, variation 0, Mobile viewport
tabs-1-Tablet.png        # Tabs block, variation 1, Tablet viewport
hero-0-Large.png         # Hero block, variation 0, Large viewport
```

### Rules
- Block name: lowercase with hyphens
- Variation index: 0-based number
- Viewport: PascalCase (Mobile, Tablet, Desktop, Large)
- Extension: .png (or configured format)

---

## 🎯 Testing Best Practices

### DO ✅

1. **Test Early and Often**
   ```bash
   # Test during development
   npm run test:visual:block -- tools/visual-tests/blocks/my-block
   ```

2. **Use Figma as Source of Truth**
   ```bash
   # Always download from Figma
   npm run test:visual:figma
   ```

3. **Review Snapshot Changes**
   ```bash
   # Use git diff to review changes
   git diff tools/visual-tests/blocks/
   ```

4. **Run Tests Before Committing**
   ```bash
   # Ensure tests pass
   npm run test:visual
   ```

5. **Document Configuration**
   ```javascript
   // Add comments to config.js
   export const FIGMA_CONFIG = [
     {
       name: 'cards-0-Desktop',
       figmaUrl: '...',  // Updated: 2025-11-03
       format: 'png',
       scale: 1,
     },
   ];
   ```

### DON'T ❌

1. **Don't Commit .env File**
   ```bash
   # .env should be in .gitignore
   echo ".env" >> .gitignore
   ```

2. **Don't Update Snapshots Without Review**
   ```bash
   # Always review changes first
   npm run test:visual:report
   # Then update if intentional
   npm run test:visual:update
   ```

3. **Don't Mix Manual and Figma Snapshots**
   ```bash
   # Choose one approach per block
   # Prefer Figma for consistency
   ```

4. **Don't Skip Tests in CI**
   ```yaml
   # Always run tests in CI/CD
   - name: Run Visual Tests
     run: npm run test:visual
   ```

5. **Don't Hardcode Tokens**
   ```javascript
   // ❌ Bad
   const token = 'figd_xxxxxxxxxxxxx';
   
   // ✅ Good
   const token = process.env.FIGMA_ACCESS_TOKEN;
   ```

---

## 🚀 Performance Tips

### Speed Up Test Execution

1. **Test Specific Blocks During Development**
   ```bash
   # Instead of running all tests
   npm run test:visual:block -- tools/visual-tests/blocks/cards
   ```

2. **Use Parallel Execution**
   ```typescript
   // Already configured in playwright.config.ts
   fullyParallel: true,
   ```

3. **Reduce Timeouts for Fast Blocks**
   ```javascript
   // In test file
   const block = await frame.waitForSelector('.cards', { 
     timeout: 10000,  // Reduce from 30000
   });
   ```

4. **Skip Slow Tests During Development**
   ```javascript
   test.skip('slow test', async ({ page }) => {
     // This test will be skipped
   });
   ```

### Optimize Figma Downloads

1. **Download Only Changed Blocks**
   ```bash
   # Manually run figma-util for specific block
   node -e "
   import('./tools/visual-tests/figma-util.js').then(m => 
     m.processBlock('cards', './tools/visual-tests/blocks')
   );
   "
   ```

2. **Use Lower Scale for Development**
   ```javascript
   export const FIGMA_CONFIG = [
     {
       name: 'cards-0-Desktop',
       figmaUrl: '...',
       scale: 1,  // Use 1x instead of 2x during dev
     },
   ];
   ```

---

## 📝 Cheat Sheet

### Quick Commands

| Task | Command |
|------|---------|
| Install | `npm install` |
| Start servers | `npm start` |
| Run all tests | `npm run test:visual` |
| Test one block | `npm run test:visual:block -- blocks/cards` |
| Update snapshots | `npm run test:visual:update` |
| Download Figma | `npm run test:visual:figma` |
| Generate tests | `npm run test:visual:generate` |
| View report | `npm run test:visual:report` |
| UI mode | `npm run test:visual:ui` |

### Quick Paths

| Item | Path |
|------|------|
| Block tests | `tools/visual-tests/blocks/[block]/` |
| Snapshots | `tools/visual-tests/blocks/[block]/[block].spec.js-snapshots/` |
| Config | `test-config/config.js` |
| Figma util | `tools/visual-tests/figma-util.js` |
| Server | `tools/visual-tests/server.js` |
| Report | `playwright-report/index.html` |

### Quick URLs

| Service | URL |
|---------|-----|
| AEM Server | `http://localhost:3000` |
| Test Server | `http://localhost:3001` |
| Library | `http://localhost:3000/tools/sidekick/library.html` |
| Health Check | `http://localhost:3001/api/health` |
| Report | `http://localhost:3001/playwright-report/index.html` |

---

## 🔗 External Resources

### Documentation
- **Playwright**: https://playwright.dev/
- **Figma API**: https://www.figma.com/developers/api
- **AEM Sidekick**: https://www.aem.live/developer/sidekick

### Tools
- **Figma**: https://www.figma.com/
- **Playwright Inspector**: `npx playwright test --debug`
- **Playwright Trace Viewer**: `npx playwright show-trace trace.zip`

### Getting Help
- **Playwright Discord**: https://discord.gg/playwright
- **Figma Community**: https://forum.figma.com/

---

## 📞 Support

### Internal Resources
- Full Documentation: `docs/VISUAL_TESTING_DOCUMENTATION.md`
- Presentation Summary: `docs/PRESENTATION_SUMMARY.md`
- Visual Diagrams: `docs/VISUAL_DIAGRAMS.md`
- This Guide: `docs/QUICK_REFERENCE.md`

### Common Questions

**Q: How do I get a Figma token?**  
A: Go to Figma → Settings → Account → Personal Access Tokens → Create new token

**Q: Can I test multiple blocks at once?**  
A: Yes, use `npm run test:visual:blocks` or specify multiple paths

**Q: How do I test in different browsers?**  
A: Configure additional projects in `playwright.config.ts`

**Q: Can I run tests in headless mode?**  
A: Yes, tests run headless by default. Use `--headed` flag for headed mode

**Q: How do I debug failing tests?**  
A: Use `npm run test:visual:ui` for interactive debugging

---

**Last Updated:** November 3, 2025  
**Version:** 1.0  
**Branch:** figma

