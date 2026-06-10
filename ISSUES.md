# AEM Visual Checker — Issues & Action Plan

Generated: 2026-06-10

---

## Critical Bugs (will cause failures)

### 1. `server.js:41–78` — Port retry loop never actually retries

**Problem:** `app.listen()` emits `EADDRINUSE` as an async event, not a thrown exception. The `try/catch` wrapper never fires, so the server crashes instead of trying the next port.

**File:** [tools/visual-tests/server.js](tools/visual-tests/server.js#L41-L78)

```js
// BROKEN — catch never reached for EADDRINUSE
try {
  app.listen(currentPort); // error is emitted, not thrown
} catch (error) {
  if (error.code === 'EADDRINUSE') { currentPort += 1; } // dead
}
```

**Fix:** Wrap `app.listen()` in a Promise that resolves on `'listening'` and rejects on `'error'`. Flatten `tryStartServerOnPort` back into `startServer`.

```js
function listenOnPort(currentPort) {
  return new Promise((resolve, reject) => {
    const serverInstance = app.listen(currentPort, () => resolve(serverInstance));
    serverInstance.on('error', reject);
  });
}

async function startServer() {
  let currentPort = port;
  while (currentPort <= MAX_PORT) {
    if (await isOurServer(currentPort)) { console.log(`Already running on ${currentPort}`); process.exit(0); }
    try {
      await listenOnPort(currentPort);
      fs.writeFileSync(portFilePath, currentPort.toString(), 'utf8');
      console.log(`Visual test server running on port ${currentPort}`);
      return;
    } catch (error) {
      if (error.code === 'EADDRINUSE') { currentPort += 1; }
      else { console.error('Server failed to start:', error); process.exit(1); }
    }
  }
  console.error(`No available port between ${process.env.PORT || 3001} and ${MAX_PORT}`);
  process.exit(1);
}
```

---

### 2. `server.js:129` — Command injection via unsanitized `component`

**Problem:** The `component` value from the POST body is interpolated directly into a shell command string. A crafted value like `cards; rm -rf /` would execute arbitrary commands.

**File:** [tools/visual-tests/server.js](tools/visual-tests/server.js#L129)

```js
// UNSAFE
const testCommand = `npm run test:visual:block -- tools/visual-tests/blocks/${component}`;
exec(testCommand, { ... });
```

**Fix:** Validate `component` against an allowlist pattern before use.

```js
if (!/^[a-z0-9-]+$/.test(component)) {
  return res.status(400).json({ error: 'Invalid component name' });
}
```

---

### 3. `test-config/config.js:21` — `viewportSizes` always produces `{ undefined: ... }`

**Problem:** `VIEWPORTS` objects have a `label` property, not `name`. Every entry is keyed as `undefined`, collapsing to a single entry with the last viewport's values. The export is also never imported anywhere.

**File:** [test-config/config.js](test-config/config.js#L21)

```js
// BROKEN
acc[viewport.name] = { width: viewport.width, height: viewport.height };
// FIX
acc[viewport.label] = { width: viewport.width, height: viewport.height };
```

---

### 4. `tools/visual-overlay/index.js:460` — Fallback image path missing `/`

**Problem:** Concatenation of `imageRoot` and the snapshot directory path omits the separator.

**File:** [tools/visual-overlay/index.js](tools/visual-overlay/index.js#L460)

```js
// BROKEN — produces: /tools/visual-tests/blocksvisual.spec.js-snapshots/...
const fallbackImagePath = `${this.imageRoot}visual.spec.js-snapshots/${fallbackImageName}`;

// FIX
const fallbackImagePath = `${this.imageRoot}/visual.spec.js-snapshots/${fallbackImageName}`;
```

---

### 5. `tools/sidekick/library/` — Directory referenced but absent from repo

**Problem:** Three files reference paths under `tools/sidekick/library/` which doesn't exist in the repo:
- [tools/sidekick/library.html](tools/sidekick/library.html#L69) → `/tools/sidekick/library/library.json`
- [test-config/config.js](test-config/config.js#L27) → `/tools/sidekick/library/library.json` + `/tools/sidekick/library/templates/`
- [tools/visual-tests/generate-visual-tests.js](tools/visual-tests/generate-visual-tests.js#L22) → templates path

**Context:** `library.json` and templates are served by `aem up` proxied from SharePoint (via `fstab.yaml`), so they don't need to be on disk at dev time. However, `generate-visual-tests.js` constructs block template URLs that embed this path — if SharePoint doesn't have the templates at exactly `/tools/sidekick/library/templates/{blockName}`, the generated tests will navigate to wrong URLs.

**Action:** Document the required SharePoint folder structure in README. Optionally expose `templatesPath` as a configurable variable in `test-config/config.js` so projects can override it without editing source.

---

## Non-critical Bugs (wrong behaviour, won't crash)

### 6. `figma-util.js:149` — Wrong env var name in error message

**File:** [tools/visual-tests/figma-util.js](tools/visual-tests/figma-util.js#L149)

```js
// WRONG — says FIGMA_TOKEN but variable is FIGMA_ACCESS_TOKEN
throw new Error('Figma token is required. Set FIGMA_TOKEN environment variable or pass it as parameter.');

// FIX
throw new Error('Figma token is required. Set FIGMA_ACCESS_TOKEN environment variable.');
```

---

### 7. `server.js:143` — `FORCE_COLOR: true` (boolean, not string)

**Problem:** Environment variable values must be strings. `FORCE_COLOR: true` is silently ignored; colour output is never enabled.

**File:** [tools/visual-tests/server.js](tools/visual-tests/server.js#L143)

```js
// WRONG
FORCE_COLOR: true,
// FIX
FORCE_COLOR: '1',
```

---

### 8. `library.html:39` — Implicit global `VIEWPORTS`

**Problem:** Assignment without a `let`/`const`/`var` declaration silently creates a global variable, which can cause unexpected cross-script pollution.

**File:** [tools/sidekick/library.html](tools/sidekick/library.html#L35)

```js
// BROKEN — VIEWPORTS becomes window.VIEWPORTS
(async () => {
  const CONFIGS = await import('/test-config/config.js');
  if(CONFIGS.VIEWPORTS) {
    VIEWPORTS = CONFIGS.VIEWPORTS; // no declaration
  } else {
    VIEWPORTS = [...]; // no declaration
  }
  library.config = { plugins: { blocks: { viewPorts: VIEWPORTS } } };
})();

// FIX — declare at top of IIFE
(async () => {
  const CONFIGS = await import('/test-config/config.js');
  let VIEWPORTS;
  if (CONFIGS.VIEWPORTS) {
    VIEWPORTS = CONFIGS.VIEWPORTS;
  } else {
    VIEWPORTS = [...];
  }
  library.config = { plugins: { blocks: { viewPorts: VIEWPORTS } } };
})();
```

---

### 9. `generate-visual-tests.js:116` — Dead `typeof` check in generated template

**Problem:** `VIEWPORTS.forEach` on lines 16–19 already converts all `width`/`height` values from strings to numbers, so the `typeof viewport.width === 'string'` guard in the generator template is always `false`. The string-branch code is never emitted.

**File:** [tools/visual-tests/generate-visual-tests.js](tools/visual-tests/generate-visual-tests.js#L116)

```js
// BEFORE (in the template literal, the string branch is dead)
width: ${typeof viewport.width === 'string' ? `'${viewport.width}'` : viewport.width}

// FIX — widths are always numbers at this point
width: ${viewport.width}
```

Applies to both `setViewportSize` call sites in the template (lines ~115 and ~147).

---

## Design / Architecture Issues

### 10. Dual `package.json` — conflicting Express versions

**Root** [package.json](package.json): `express: ^5.1.0`, `cors: ^2.8.5`, `node-fetch: ^2.7.0`  
**Inner** [tools/visual-tests/package.json](tools/visual-tests/package.json): `express: ^4.21.2`, `cors: ^2.8.5`

`server.js` resolves its own `node_modules` first, so it uses Express **4**. The root Express 5 and `cors` entries are unused. `node-fetch` is not imported anywhere.

**Fix:** Remove `cors`, `express`, and `node-fetch` from root `package.json` `dependencies`. The inner package is the source of truth for the server.

---

### 11. Root `package.json` — missing `"type": "module"`

All server-side scripts use ESM. This works today because Node.js resolves the nearest `package.json` up from each file, finding `tools/visual-tests/package.json` (which has `"type": "module"`). Adding `"type": "module"` to the root would make intent explicit.

**Caveat:** `.eslintrc.js` uses `module.exports` (CommonJS). If `"type": "module"` is added to root it must be renamed to `.eslintrc.cjs` first to avoid a Node.js parse error.

**Fix (sequence):**
1. Rename `.eslintrc.js` → `.eslintrc.cjs`
2. Add `"type": "module"` to root `package.json`

---

### 12. `start-visual-test-server.js` — Double `process.on('exit')` handler

**Problem:** `startVisualTestServer()` registers `process.on('exit', () => server.kill())` internally, then the outer scope also registers `process.on('exit', cleanup)` which calls `server.kill()` again. The server receives two kill signals on shutdown.

**File:** [tools/visual-tests/start-visual-test-server.js](tools/visual-tests/start-visual-test-server.js#L27)

**Fix:** Remove the inner `process.on('exit', ...)` registration inside `startVisualTestServer`. Keep only the outer `cleanup` handler.

---

### 13. `visual-overlay/index.js` — `console.log` hack to satisfy linter

**Problem:** Four methods (`getComponentStyles`, `getComponentName`, `getVariationIndex`, `getCurrentViewport`) include `console.log(this.isActive, 'isActive')` solely to suppress the `class-methods-use-this` ESLint rule, leaking debug output in the browser console.

**File:** [tools/visual-overlay/index.js](tools/visual-overlay/index.js)

**Fix:** Replace each `console.log` line with an ESLint disable comment on the method signature:

```js
// eslint-disable-next-line class-methods-use-this
getComponentStyles() {
  const componentContainer = document.querySelector(...);
  ...
}
```

---

### 14. Playwright config — Chromium only

**File:** [playwright.config.ts](playwright.config.ts)

Only `Desktop Chrome` is configured. Visual regressions specific to Safari or Firefox rendering won't be caught. Add `webkit` and `firefox` projects if cross-browser fidelity is required.

---

### 15. Snapshot platform sensitivity

**File:** [playwright.config.ts](playwright.config.ts#L20)

```ts
snapshotPathTemplate: '{testDir}/{testFileDir}/{testFileName}-snapshots/{arg}{ext}',
```

The OS platform name is removed from the snapshot path, but font rendering still differs between macOS (local) and Linux (CI). Tests can pass locally and fail in CI purely due to system font differences, with no code change involved.

**Options:**
- Pin a Docker image for local snapshot generation to match CI
- Use `--update-snapshots` on a Linux runner to regenerate baselines, then commit
- Add a note to the contributing docs so devs don't chase phantom failures

---

### 16. Missing `.env.example`

`figma-util.js` reads `FIGMA_ACCESS_TOKEN` via `dotenv`. There is no `.env.example` file and the README has no mention of required environment variables.

**Fix:** Create `.env.example` (see separate action item below).

---

### 17. Script naming — `test:visual:block` vs `test:visual:blocks`

**File:** [package.json](package.json#L17)

`test:visual:blocks` runs `playwright test blocks` (scoped to blocks dir).  
`test:visual:block` (singular) runs `playwright test` (all tests — broader, not narrower).

The singular form is counter-intuitively broader. The server uses `test:visual:block` and appends the path argument to filter per component, which does work — but the base script name implies the opposite of what it does.

**Fix:** Rename `test:visual:block` → `test:visual:block:run` or swap the logic so singular = one block, plural = all blocks. Document the distinction in README.

---

## Action Items Checklist

| # | File | Priority | Action |
|---|------|----------|--------|
| 1 | `tools/visual-tests/server.js` | 🔴 Critical | Replace `try/catch` around `app.listen()` with Promise-based `listenOnPort()` |
| 2 | `tools/visual-tests/server.js` | 🔴 Critical | Sanitize `component` with `/^[a-z0-9-]+$/` before `exec()` |
| 3 | `test-config/config.js` | 🔴 Critical | Change `viewport.name` → `viewport.label` in `viewportSizes` reduce |
| 4 | `tools/visual-overlay/index.js` | 🔴 Critical | Add missing `/` in `fallbackImagePath` |
| 5 | `tools/visual-tests/figma-util.js` | 🟡 Medium | Fix error message: `FIGMA_TOKEN` → `FIGMA_ACCESS_TOKEN` |
| 6 | `tools/visual-tests/server.js` | 🟡 Medium | Change `FORCE_COLOR: true` → `FORCE_COLOR: '1'` |
| 7 | `tools/sidekick/library.html` | 🟡 Medium | Declare `let VIEWPORTS` inside IIFE |
| 8 | `tools/visual-tests/generate-visual-tests.js` | 🟢 Low | Remove dead `typeof viewport.width === 'string'` checks in template |
| 9 | `package.json` | 🟡 Medium | Remove unused `cors`, `express`, `node-fetch` from root dependencies |
| 10 | `package.json` + `.eslintrc.js` | 🟢 Low | Rename `.eslintrc.js` → `.eslintrc.cjs`, add `"type": "module"` to root |
| 11 | `tools/visual-tests/start-visual-test-server.js` | 🟢 Low | Remove inner `process.on('exit', ...)` to prevent double kill |
| 12 | `tools/visual-overlay/index.js` | 🟢 Low | Replace `console.log` linter hacks with `// eslint-disable-next-line class-methods-use-this` |
| 13 | `playwright.config.ts` | 🟢 Low | Add Firefox/WebKit projects if cross-browser coverage is needed |
| 14 | Snapshot baseline | 🟢 Low | Regenerate snapshots on Linux to prevent CI vs local false failures |
| 15 | `.env.example` | 🟡 Medium | Create with `FIGMA_ACCESS_TOKEN=` entry |
| 16 | `README.md` | 🟡 Medium | Replace boilerplate content with actual project docs |
| 17 | `tools/sidekick/` (SharePoint) | 🟡 Medium | Document required SharePoint folder structure for `library.json` + templates |
| 18 | `package.json` scripts | 🟢 Low | Rename/clarify `test:visual:block` vs `test:visual:blocks` |
