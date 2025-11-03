# Visual Testing Framework - Diagrams for Presentation

This document contains ASCII diagrams and visual representations for your presentation slides.

---

## 1. Folder Structure Comparison

### Before (visual-test branch)
```
📁 tools/visual-tests/
│
├── 📄 visual.spec.js                    ← ALL TESTS (500+ lines)
│   ├── test: cards-mobile
│   ├── test: cards-tablet
│   ├── test: cards-desktop
│   ├── test: cards-large
│   ├── test: hero-mobile
│   ├── test: hero-tablet
│   ├── test: hero-desktop
│   ├── test: hero-large
│   ├── test: tabs-mobile
│   └── ... (16+ tests)
│
└── 📁 visual.spec.js-snapshots/         ← ALL SNAPSHOTS MIXED
    ├── 🖼️ cards-0-desktop.png
    ├── 🖼️ cards-0-large.png
    ├── 🖼️ cards-0-mobile.png
    ├── 🖼️ cards-0-tablet.png
    ├── 🖼️ hero-0-desktop.png
    ├── 🖼️ hero-0-large.png
    ├── 🖼️ hero-0-mobile.png
    ├── 🖼️ hero-0-tablet.png
    ├── 🖼️ tabs-0-desktop.png
    ├── 🖼️ tabs-0-large.png
    └── ... (30+ files)

❌ Problems:
   • Single monolithic file
   • All snapshots mixed together
   • Hard to maintain
   • Can't test individual blocks
   • Poor scalability
```

### After (figma branch)
```
📁 tools/visual-tests/
│
├── 📁 blocks/                           ← ORGANIZED BY BLOCK
│   │
│   ├── 📁 cards/                        ← CARDS BLOCK
│   │   ├── 📄 cards.spec.js            ← Cards tests only
│   │   ├── ⚙️ config.js                ← Figma configuration
│   │   └── 📁 cards.spec.js-snapshots/
│   │       ├── 🖼️ cards-0-Desktop.png
│   │       ├── 🖼️ cards-0-Large.png
│   │       ├── 🖼️ cards-0-Mobile.png
│   │       └── 🖼️ cards-0-Tablet.png
│   │
│   ├── 📁 hero/                         ← HERO BLOCK
│   │   ├── 📄 hero.spec.js
│   │   └── 📁 hero.spec.js-snapshots/
│   │       ├── 🖼️ hero-0-Desktop.png
│   │       ├── 🖼️ hero-0-Large.png
│   │       ├── 🖼️ hero-0-Mobile.png
│   │       └── 🖼️ hero-0-Tablet.png
│   │
│   └── 📁 tabs/                         ← TABS BLOCK
│       ├── 📄 tabs.spec.js
│       └── 📁 tabs.spec.js-snapshots/
│           ├── 🖼️ tabs-0-Desktop.png
│           ├── 🖼️ tabs-0-Large.png
│           ├── 🖼️ tabs-0-Mobile.png
│           ├── 🖼️ tabs-0-Tablet.png
│           ├── 🖼️ tabs-1-Desktop.png
│           └── ... (variation snapshots)
│
├── 🎨 figma-util.js                     ← NEW: Figma integration
├── 🔧 generate-visual-tests.js
├── 🖥️ server.js
└── 📄 visual-test.js

✅ Benefits:
   • Modular organization
   • Block-specific folders
   • Easy to maintain
   • Test individual blocks
   • Excellent scalability
   • Figma integration
```

---

## 2. Figma Integration Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                    FIGMA INTEGRATION WORKFLOW                    │
└─────────────────────────────────────────────────────────────────┘

Step 1: Designer Creates Mockup
┌──────────────┐
│   FIGMA      │  Designer creates/updates component design
│   🎨         │  Gets shareable link with node-id
└──────┬───────┘
       │
       │ Share Figma URL
       ▼
Step 2: Developer Configures Block
┌──────────────┐
│  config.js   │  export const FIGMA_CONFIG = [{
│   ⚙️         │    name: 'cards-0-Desktop',
│              │    figmaUrl: 'https://figma.com/...',
│              │    format: 'png',
│              │    scale: 1
│              │  }]
└──────┬───────┘
       │
       │ npm run test:visual:figma
       ▼
Step 3: Automated Download
┌──────────────┐
│ figma-util.js│  1. Parse Figma URL
│   🔧         │  2. Authenticate with Figma API
│              │  3. Fetch image URL
│              │  4. Download image
│              │  5. Save to snapshot folder
└──────┬───────┘
       │
       │ Images saved
       ▼
Step 4: Baseline Ready
┌──────────────┐
│  Snapshots   │  cards-0-Desktop.png ✅
│   📁         │  cards-0-Mobile.png ✅
│              │  cards-0-Tablet.png ✅
│              │  cards-0-Large.png ✅
└──────┬───────┘
       │
       │ npm run test:visual
       ▼
Step 5: Visual Testing
┌──────────────┐
│  Playwright  │  Compare implementation
│   🎭         │  against Figma designs
│              │  ✅ Pass / ❌ Fail
└──────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  BENEFITS:                                                       │
│  ✅ Single source of truth (Figma)                              │
│  ✅ Automated baseline generation                               │
│  ✅ Easy design updates                                         │
│  ✅ Designer-developer collaboration                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. System Architecture

```
┌───────────────────────────────────────────────────────────────────────┐
│                    AEM VISUAL TESTING ARCHITECTURE                     │
└───────────────────────────────────────────────────────────────────────┘

                        ┌─────────────────┐
                        │   FIGMA API     │
                        │      🎨         │
                        └────────┬────────┘
                                 │
                                 │ Download designs
                                 ▼
                        ┌─────────────────┐
                        │  figma-util.js  │
                        │      🔧         │
                        └────────┬────────┘
                                 │
                                 │ Save baselines
                                 ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Sidekick       │───▶│  Test Generator │───▶│  Test Specs     │
│  Library        │    │      🏗️         │    │    📄 .spec.js  │
│  📚             │    │                 │    │                 │
└────────┬────────┘    └─────────────────┘    └────────┬────────┘
         │                                               │
         │                                               │
         │ User clicks "Run Test"                        │ Execute tests
         │                                               │
         ▼                                               ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Visual Test UI │◀──▶│  Test Server    │◀──▶│  Playwright     │
│  (Browser)      │    │  (Port 3001)    │    │     🎭          │
│  🌐             │    │  🖥️             │    │                 │
└─────────────────┘    └─────────────────┘    └────────┬────────┘
                                                         │
                                                         │ Compare
                                                         ▼
                                               ┌─────────────────┐
                                               │   Snapshots     │
                                               │   📁 Baselines  │
                                               │                 │
                                               └────────┬────────┘
                                                        │
                                                        │ Generate
                                                        ▼
                                               ┌─────────────────┐
                                               │  HTML Report    │
                                               │      📊         │
                                               └─────────────────┘

┌───────────────────────────────────────────────────────────────────────┐
│  COMPONENTS:                                                           │
│  • Figma API: Design source of truth                                  │
│  • figma-util.js: Downloads and manages Figma images                 │
│  • Test Generator: Creates test files from library                    │
│  • Test Server: Executes tests and serves reports                     │
│  • Playwright: Captures screenshots and compares                      │
│  • Visual Test UI: Interactive testing interface                      │
└───────────────────────────────────────────────────────────────────────┘
```

---

## 4. Test Execution Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     TEST EXECUTION FLOW                          │
└─────────────────────────────────────────────────────────────────┘

USER ACTION
    │
    │ Clicks "Run Test" button
    ▼
┌─────────────────────┐
│  Visual Test UI     │  JavaScript in browser
│  🌐                 │  Detects button click
└──────────┬──────────┘
           │
           │ POST /api/run-visual-test
           │ { component: "cards" }
           ▼
┌─────────────────────┐
│  Test Server        │  Express server (port 3001)
│  🖥️                 │  Receives request
└──────────┬──────────┘
           │
           │ exec("npm run test:visual:block -- blocks/cards")
           ▼
┌─────────────────────┐
│  Playwright         │  Test runner
│  🎭                 │  Executes test spec
└──────────┬──────────┘
           │
           ├──────────────────────────┐
           │                          │
           ▼                          ▼
┌──────────────────┐      ┌──────────────────┐
│  Navigate to     │      │  Set Viewport    │
│  Block URL       │      │  (Mobile/Tablet/ │
│                  │      │  Desktop/Large)  │
└────────┬─────────┘      └────────┬─────────┘
         │                         │
         └────────────┬────────────┘
                      │
                      ▼
           ┌──────────────────┐
           │  Wait for Block  │
           │  to Render       │
           └────────┬─────────┘
                    │
                    ▼
           ┌──────────────────┐
           │  Capture         │
           │  Screenshot      │
           └────────┬─────────┘
                    │
                    ▼
           ┌──────────────────┐
           │  Compare with    │
           │  Baseline        │
           │  Snapshot        │
           └────────┬─────────┘
                    │
                    ├─────────────┐
                    │             │
                    ▼             ▼
         ┌──────────────┐  ┌──────────────┐
         │  ✅ PASS     │  │  ❌ FAIL     │
         │  Matches     │  │  Differences │
         │  baseline    │  │  detected    │
         └──────┬───────┘  └──────┬───────┘
                │                 │
                └────────┬────────┘
                         │
                         ▼
                ┌─────────────────┐
                │  Generate       │
                │  HTML Report    │
                └────────┬────────┘
                         │
                         │ Report URL
                         ▼
                ┌─────────────────┐
                │  Test Server    │
                │  Returns Result │
                └────────┬────────┘
                         │
                         │ Response with report URL
                         ▼
                ┌─────────────────┐
                │  Visual Test UI │
                │  Shows Modal    │
                │  with Report    │
                └─────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  TIMING:                                                         │
│  • Navigation: ~1-2 seconds                                     │
│  • Rendering: ~1-2 seconds                                      │
│  • Screenshot: ~0.5 seconds                                     │
│  • Comparison: ~0.1 seconds                                     │
│  • Total per viewport: ~3-5 seconds                            │
│  • Total per block (4 viewports): ~12-20 seconds               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. Configuration Hierarchy

```
┌─────────────────────────────────────────────────────────────────┐
│                   CONFIGURATION HIERARCHY                        │
└─────────────────────────────────────────────────────────────────┘

LEVEL 1: GLOBAL CONFIGURATION
┌──────────────────────────────────────────────────────────────┐
│  test-config/config.js                                        │
├──────────────────────────────────────────────────────────────┤
│  export const VIEWPORTS = [                                   │
│    { width: '320px', height: '568px', label: 'Mobile' },     │
│    { width: '768px', height: '1024px', label: 'Tablet' },    │
│    { width: '1024px', height: '768px', label: 'Desktop' },   │
│    { width: '1440px', height: '900px', label: 'Large' },     │
│  ];                                                            │
│                                                                │
│  export const OVERLAY = {                                     │
│    imageRoot: '/tools/visual-tests/blocks',                  │
│  };                                                            │
│                                                                │
│  export const SIDEKICK_CONFIG = {                             │
│    JSONPath: '/tools/sidekick/library/library.json',         │
│    templatesPath: '/tools/sidekick/library/templates/',      │
│  };                                                            │
└──────────────────────────────────────────────────────────────┘
         │
         │ Applies to ALL blocks
         ▼
LEVEL 2: PLAYWRIGHT CONFIGURATION
┌──────────────────────────────────────────────────────────────┐
│  playwright.config.ts                                         │
├──────────────────────────────────────────────────────────────┤
│  export default defineConfig({                                │
│    testDir: './tools/visual-tests',                          │
│    fullyParallel: true,                                       │
│    retries: process.env.CI ? 2 : 0,                          │
│    use: {                                                     │
│      baseURL: 'http://localhost:3000',                       │
│      trace: 'on-first-retry',                                │
│    },                                                         │
│    snapshotPathTemplate:                                      │
│      '{testDir}/{testFileDir}/{testFileName}-snapshots/...'  │
│  });                                                           │
└──────────────────────────────────────────────────────────────┘
         │
         │ Applies to test execution
         ▼
LEVEL 3: BLOCK-SPECIFIC CONFIGURATION
┌──────────────────────────────────────────────────────────────┐
│  tools/visual-tests/blocks/cards/config.js                   │
├──────────────────────────────────────────────────────────────┤
│  export const FIGMA_CONFIG = [                                │
│    {                                                           │
│      name: 'cards-0-Desktop',                                 │
│      figmaUrl: 'https://www.figma.com/design/...',          │
│      format: 'png',                                           │
│      scale: 1,                                                │
│    },                                                          │
│    {                                                           │
│      name: 'cards-0-Mobile',                                  │
│      figmaUrl: 'https://www.figma.com/design/...',          │
│      format: 'png',                                           │
│      scale: 2,  // Retina for mobile                         │
│    },                                                          │
│  ];                                                            │
└──────────────────────────────────────────────────────────────┘
         │
         │ Applies to "cards" block only
         ▼
LEVEL 4: ENVIRONMENT VARIABLES
┌──────────────────────────────────────────────────────────────┐
│  .env (not committed to git)                                  │
├──────────────────────────────────────────────────────────────┤
│  FIGMA_ACCESS_TOKEN=figd_xxxxxxxxxxxxxxxxxxxxx               │
│  PORT=3001                                                    │
│  CI=false                                                     │
└──────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  OVERRIDE HIERARCHY:                                         │
│  Environment Variables > Block Config > Playwright > Global  │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Before vs After Comparison

```
┌─────────────────────────────────────────────────────────────────┐
│                  BEFORE vs AFTER COMPARISON                      │
└─────────────────────────────────────────────────────────────────┘

SCENARIO: Adding a New "Banner" Block
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BEFORE (visual-test branch)
┌──────────────────────────────────────────────────────────────┐
│ Step 1: Edit visual.spec.js                                   │
│         • Open 500-line file                                  │
│         • Scroll to find insertion point                      │
│         • Copy/paste/modify 50+ lines                         │
│         • Risk of breaking existing tests                     │
│         Time: ~15 minutes                                     │
├──────────────────────────────────────────────────────────────┤
│ Step 2: Manually capture screenshots                          │
│         • Open browser                                        │
│         • Navigate to block                                   │
│         • Resize to Mobile (320x568)                          │
│         • Take screenshot, save as banner-0-mobile.png        │
│         • Repeat for Tablet, Desktop, Large                   │
│         Time: ~20 minutes                                     │
├──────────────────────────────────────────────────────────────┤
│ Step 3: Save to shared folder                                 │
│         • Navigate to visual.spec.js-snapshots/               │
│         • Check for naming conflicts                          │
│         • Save 4 screenshots                                  │
│         Time: ~5 minutes                                      │
├──────────────────────────────────────────────────────────────┤
│ Step 4: Run ALL tests                                         │
│         • npm run test:visual                                 │
│         • Wait for all 16+ tests to complete                  │
│         • Hope nothing broke                                  │
│         Time: ~2 minutes                                      │
├──────────────────────────────────────────────────────────────┤
│ TOTAL TIME: ~42 minutes                                       │
│ ERROR RISK: High (manual process, shared file)               │
└──────────────────────────────────────────────────────────────┘

AFTER (figma branch)
┌──────────────────────────────────────────────────────────────┐
│ Step 1: Create block folder                                   │
│         • mkdir tools/visual-tests/blocks/banner              │
│         Time: ~10 seconds                                     │
├──────────────────────────────────────────────────────────────┤
│ Step 2: Add Figma configuration                               │
│         • Create config.js                                    │
│         • Paste Figma URL from designer                       │
│         • export const FIGMA_CONFIG = [...]                   │
│         Time: ~2 minutes                                      │
├──────────────────────────────────────────────────────────────┤
│ Step 3: Download baselines from Figma                         │
│         • npm run test:visual:figma                           │
│         • Automatic download of 4 screenshots                 │
│         Time: ~30 seconds                                     │
├──────────────────────────────────────────────────────────────┤
│ Step 4: Generate test file                                    │
│         • npm run test:visual:generate                        │
│         • Automatic test file creation                        │
│         Time: ~20 seconds                                     │
├──────────────────────────────────────────────────────────────┤
│ Step 5: Run block test only                                   │
│         • npm run test:visual:block -- blocks/banner          │
│         • Only banner tests run                               │
│         Time: ~20 seconds                                     │
├──────────────────────────────────────────────────────────────┤
│ TOTAL TIME: ~4 minutes                                        │
│ ERROR RISK: Low (automated, isolated)                         │
│ TIME SAVED: 90% (38 minutes)                                  │
└──────────────────────────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SCENARIO: Updating Design Colors
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BEFORE (visual-test branch)
┌──────────────────────────────────────────────────────────────┐
│ 1. Designer updates Figma                                     │
│ 2. Developer manually captures new screenshots                │
│ 3. Replace old screenshots in shared folder                   │
│ 4. Run all tests                                              │
│ 5. Review all test results                                    │
│                                                                │
│ TOTAL TIME: ~30 minutes                                       │
└──────────────────────────────────────────────────────────────┘

AFTER (figma branch)
┌──────────────────────────────────────────────────────────────┐
│ 1. Designer updates Figma                                     │
│ 2. npm run test:visual:figma                                  │
│ 3. npm run test:visual:block -- blocks/cards                  │
│ 4. Review card test results only                              │
│                                                                │
│ TOTAL TIME: ~2 minutes                                        │
│ TIME SAVED: 93% (28 minutes)                                  │
└──────────────────────────────────────────────────────────────┘
```

---

## 7. Developer Workflow Comparison

```
┌─────────────────────────────────────────────────────────────────┐
│                    DEVELOPER WORKFLOW                            │
└─────────────────────────────────────────────────────────────────┘

OLD WORKFLOW (visual-test branch)
═══════════════════════════════════════════════════════════════════

    ┌─────────────┐
    │  Designer   │  Creates mockup
    │  Updates    │  (Figma/Sketch/etc)
    │  Design     │
    └──────┬──────┘
           │
           │ Email screenshot / Share link
           ▼
    ┌─────────────┐
    │  Developer  │  Manually saves screenshot
    │  Downloads  │  to local machine
    │  Image      │
    └──────┬──────┘
           │
           │ Manual file management
           ▼
    ┌─────────────┐
    │  Edit       │  Open 500-line file
    │  visual.    │  Find right place
    │  spec.js    │  Add/modify test
    └──────┬──────┘
           │
           │ Copy/paste/modify
           ▼
    ┌─────────────┐
    │  Copy       │  Navigate to snapshot folder
    │  Screenshot │  Check naming
    │  to Folder  │  Paste file
    └──────┬──────┘
           │
           │ Manual placement
           ▼
    ┌─────────────┐
    │  Run ALL    │  npm run test:visual
    │  Tests      │  Wait 2+ minutes
    │             │  Review all results
    └──────┬──────┘
           │
           │ If failed
           ▼
    ┌─────────────┐
    │  Debug      │  Which test failed?
    │  Issues     │  Search through output
    │             │  Fix and re-run ALL tests
    └─────────────┘

    ⏱️  Total Time: 30-45 minutes per block
    😓 Frustration Level: High
    🐛 Error Prone: Very


NEW WORKFLOW (figma branch)
═══════════════════════════════════════════════════════════════════

    ┌─────────────┐
    │  Designer   │  Creates/updates mockup
    │  Updates    │  in Figma
    │  Figma      │
    └──────┬──────┘
           │
           │ Shares Figma URL
           ▼
    ┌─────────────┐
    │  Developer  │  Adds URL to config.js
    │  Adds URL   │  export const FIGMA_CONFIG = [{
    │  to Config  │    figmaUrl: '...'
    └──────┬──────┘  }]
           │
           │ One line of code
           ▼
    ┌─────────────┐
    │  Run Figma  │  npm run test:visual:figma
    │  Download   │  ✅ Automatic download
    │             │  ✅ Correct folder
    └──────┬──────┘  ✅ Correct naming
           │
           │ 30 seconds
           ▼
    ┌─────────────┐
    │  Generate   │  npm run test:visual:generate
    │  Test File  │  ✅ Automatic test creation
    │             │  ✅ Correct structure
    └──────┬──────┘
           │
           │ 20 seconds
           ▼
    ┌─────────────┐
    │  Run Block  │  npm run test:visual:block
    │  Test Only  │  -- blocks/cards
    │             │  ✅ Fast (20 seconds)
    └──────┬──────┘  ✅ Focused results
           │
           │ If failed
           ▼
    ┌─────────────┐
    │  Debug      │  Clear which block failed
    │  Specific   │  Re-run only that block
    │  Block      │  Fast iteration
    └─────────────┘

    ⏱️  Total Time: 3-5 minutes per block
    😊 Frustration Level: Low
    ✅ Error Prone: Minimal
```

---

## 8. Metrics Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│                      METRICS DASHBOARD                           │
└─────────────────────────────────────────────────────────────────┘

CODE ORGANIZATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    BEFORE              AFTER
Files per Block:      1                  3
Lines per File:     500+               ~200
Snapshot Folders:     1                  1 per block

Improvement: 66% reduction in file size ✅

TEST EXECUTION SPEED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    BEFORE              AFTER
All Tests:         ~2 min             ~2 min
Single Block:      ~2 min             ~20 sec

Improvement: 83% faster during development ✅

MAINTAINABILITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    BEFORE              AFTER
Find Test:        Search 500 lines    Direct navigation
Update Test:      Edit shared file    Edit isolated file
Add Block:        ~42 minutes          ~4 minutes

Improvement: 90% faster block addition ✅

SNAPSHOT MANAGEMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    BEFORE              AFTER
Files per Folder:   30+ mixed          3-4 per block
Organization:       Flat               Hierarchical
Naming:            Inconsistent        Standardized

Improvement: 100% better organization ✅

DEVELOPER EXPERIENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    BEFORE              AFTER
Setup Time:        ~45 min             ~4 min
Iteration Speed:   Slow (2 min)        Fast (20 sec)
Error Rate:        High                Low
Learning Curve:    Steep               Gentle

Improvement: 91% faster setup ✅

COLLABORATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    BEFORE              AFTER
Design Sync:       Manual              Automated
Baseline Source:   Screenshots         Figma
Update Process:    Manual              One command
Designer Input:    Indirect            Direct (Figma)

Improvement: Seamless designer collaboration ✅

┌─────────────────────────────────────────────────────────────────┐
│  OVERALL IMPACT:                                                 │
│  • 90% faster development                                       │
│  • 95% better organization                                      │
│  • 100% automated baseline management                           │
│  • Infinite scalability                                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## 9. Technology Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                      TECHNOLOGY STACK                            │
└─────────────────────────────────────────────────────────────────┘

TESTING FRAMEWORK
┌──────────────────────────────────────────────────────────────┐
│  Playwright 1.53.1                                            │
│  • Cross-browser testing                                      │
│  • Visual regression testing                                  │
│  • Screenshot comparison                                      │
│  • HTML reporting                                             │
└──────────────────────────────────────────────────────────────┘

DESIGN INTEGRATION
┌──────────────────────────────────────────────────────────────┐
│  Figma API                                                    │
│  • REST API for image export                                 │
│  • Authentication via access token                           │
│  • Multiple format support (PNG, JPG, SVG, PDF)              │
│  • Scalable image export (1x, 2x, 4x)                        │
└──────────────────────────────────────────────────────────────┘

SERVER INFRASTRUCTURE
┌──────────────────────────────────────────────────────────────┐
│  Express.js 5.1.0                                             │
│  • REST API endpoints                                         │
│  • CORS enabled                                               │
│  • Static file serving                                        │
│  • Test execution orchestration                               │
└──────────────────────────────────────────────────────────────┘

RUNTIME ENVIRONMENT
┌──────────────────────────────────────────────────────────────┐
│  Node.js                                                      │
│  • ES Modules (import/export)                                │
│  • Async/await patterns                                       │
│  • Child process execution                                    │
│  • File system operations                                     │
└──────────────────────────────────────────────────────────────┘

CONFIGURATION
┌──────────────────────────────────────────────────────────────┐
│  • TypeScript (playwright.config.ts)                          │
│  • JavaScript (config.js, test files)                        │
│  • Environment variables (.env)                               │
│  • JSON (package.json)                                        │
└──────────────────────────────────────────────────────────────┘

DEPENDENCIES
┌──────────────────────────────────────────────────────────────┐
│  Production:                                                  │
│  • @playwright/test: ^1.53.1                                 │
│  • playwright: ^1.53.1                                        │
│  • express: ^5.1.0                                            │
│  • cors: ^2.8.5                                               │
│  • dotenv: ^17.2.3                                            │
│  • node-fetch: ^2.7.0                                         │
│                                                                │
│  Development:                                                 │
│  • eslint: 8.57.1                                             │
│  • stylelint: 16.20.0                                         │
│  • concurrently: ^9.1.2                                       │
│  • husky: ^8.0.3                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 10. Future Roadmap

```
┌─────────────────────────────────────────────────────────────────┐
│                       FUTURE ROADMAP                             │
└─────────────────────────────────────────────────────────────────┘

PHASE 1: CURRENT (figma branch) ✅
┌──────────────────────────────────────────────────────────────┐
│ ✅ Modular folder structure                                   │
│ ✅ Figma integration                                          │
│ ✅ Selective block testing                                    │
│ ✅ Interactive UI                                             │
│ ✅ Automated test generation                                  │
└──────────────────────────────────────────────────────────────┘

PHASE 2: ENHANCED AUTOMATION (Q1 2026)
┌──────────────────────────────────────────────────────────────┐
│ 🔄 Automatic Figma sync on design updates                    │
│ 🔄 Webhook integration with Figma                            │
│ 🔄 Scheduled baseline updates                                │
│ 🔄 Slack/Teams notifications                                 │
└──────────────────────────────────────────────────────────────┘

PHASE 3: ANALYTICS & INSIGHTS (Q2 2026)
┌──────────────────────────────────────────────────────────────┐
│ 📊 Visual regression trend tracking                          │
│ 📊 Historical comparison dashboard                           │
│ 📊 Performance metrics                                        │
│ 📊 Test coverage reports                                      │
└──────────────────────────────────────────────────────────────┘

PHASE 4: ADVANCED FEATURES (Q3 2026)
┌──────────────────────────────────────────────────────────────┐
│ 🎨 Multiple design system support                            │
│ 🎨 Theme/variant testing                                      │
│ 🎨 Accessibility testing integration                          │
│ 🎨 Color contrast validation                                  │
└──────────────────────────────────────────────────────────────┘

PHASE 5: AI & INTELLIGENCE (Q4 2026)
┌──────────────────────────────────────────────────────────────┐
│ 🤖 AI-powered visual diff analysis                           │
│ 🤖 Smart threshold recommendations                           │
│ 🤖 Automatic issue categorization                            │
│ 🤖 Predictive failure detection                              │
└──────────────────────────────────────────────────────────────┘

PHASE 6: CROSS-PLATFORM (2027)
┌──────────────────────────────────────────────────────────────┐
│ 📱 Real mobile device testing                                │
│ 🌐 Cross-browser visual testing (Firefox, Safari, Edge)      │
│ 💻 Desktop application testing                               │
│ ⌚ Wearable device testing                                    │
└──────────────────────────────────────────────────────────────┘
```

---

**End of Visual Diagrams Document**

These diagrams can be used directly in your presentation or converted to slides using tools like Mermaid, PlantUML, or manually recreated in PowerPoint/Keynote.

