/* eslint-disable no-restricted-syntax */
/* eslint-disable class-methods-use-this */
export default class InteractionRecorder {
  constructor({ mountEl, shadowRoot }) {
    this.mountEl = mountEl;
    this.shadowRoot = shadowRoot;
    this.recorderActive = false;
    this.codeLog = [];
    this.init();
    this.stepDelay = 500;
  }

  init() {
    this.renderButton();
    this.setupListeners();
  }

  renderButton() {
    const button = document.createElement('sp-button');
    button.classList.add('integration-button');
    button.textContent = 'Interaction Recorder';
    button.style.marginRight = '1rem';

    const attrs = {
      dir: 'ltr',
      size: 'm',
      treatment: 'fill',
      focusable: '',
      tabindex: '0',
      role: 'button',
      variant: 'accent',
    };
    Object.entries(attrs).forEach(([k, v]) => button.setAttribute(k, v));

    button.addEventListener('click', (e) => {
      e.stopImmediatePropagation();
      this.toggleRecorder();
    });

    this.button = button;
    this.mountEl.querySelector('.actions .integration-button')?.remove();
    this.mountEl.querySelector('.actions')?.prepend(button);
    console.log('Interaction Recorder button added to action bar');
  }

  toggleRecorder() {
    this.recorderActive = !this.recorderActive;
    this.button.textContent = this.recorderActive ? '🛑 Stop Recorder' : '🎥 Start Recorder';
    if (this.recorderActive) this.setupCodeBox();
  }

  setupCodeBox() {
    const bottom = this.shadowRoot.querySelector('.details');
    bottom.style.padding = '0';
    bottom.innerHTML = `
      <div class="heading-panel" style="display: flex;justify-content: space-between;align-items: center;background: #f2f2f2;padding: 6px 12px;border-radius: 5px;">
        <label><input type="checkbox" id="assertMode"> Assert Mode</label>
        <div>
          <sp-button id="downloadCode" size="s" treatment="outline">Download</sp-button>
          <sp-button id="clearCode" size="s" treatment="outline">Clear</sp-button>
          <sp-button id="copyCode" size="s" treatment="outline">Copy</sp-button>
          <sp-button id="playCode" size="s" treatment="outline">Play</sp-button>
        </div>
      </div>
      <div class="generated-code" style="display: block;"><pre style="min-height: 200px;padding: 6px 12px;background: #5a5a5a;margin: 0;color: #fff;line-height: 24px;word-wrap: break-word;white-space: break-spaces;"></pre></div>
      <div class="played-log"  style="display: none;"><pre style="min-height: 200px;padding: 6px 12px;background: #5a5a5a;margin: 0;color: #fff;line-height: 24px;word-wrap: break-word;white-space: break-spaces;"></pre></div>
    `;

    this.output = bottom.querySelector('pre');
    this.assertMode = bottom.querySelector('#assertMode');

    bottom.querySelector('#downloadCode').onclick = () => this.downloadCode();
    bottom.querySelector('#clearCode').onclick = () => {
      this.codeLog = [];
      this.output.textContent = '';
    };
    bottom.querySelector('#copyCode').onclick = () => {
      navigator.clipboard.writeText(this.codeLog.join('\n'));
      alert('Copied!');
    };
    bottom.querySelector('#playCode').onclick = () => {
      this.simulateSteps();
    };
  }

  setupListeners() {
    document.addEventListener('click', (e) => {
      if (!this.recorderActive || this.mountEl.contains(e.target)) return;
      const tag = e.target.tagName.toLowerCase();
      if (['input', 'textarea', 'select'].includes(tag)) return;
      const locator = this.getLocator(e.target);
      if (this.assertMode?.checked) {
        const txt = e.target.innerText?.trim();
        const promptVal = prompt('Expected text:', txt) || txt;
        this.log(`await expect(page.locator('${locator}')).toHaveText('${this.escape(promptVal)}');`);
      } else {
        this.log(`await page.click('${locator}');`);
      }
    }, true);

    document.addEventListener('input', (e) => {
      if (!this.recorderActive) return;
      const locator = this.getLocator(e.target);
      const val = e.target.value?.trim() || '';
      if (this.assertMode?.checked) {
        this.log(`await expect(page.locator('${locator}')).toHaveValue('${this.escape(val)}');`);
      } else {
        this.log(`await page.fill('${locator}', '${this.escape(val)}');`);
      }
    });
  }

  log(line) {
    this.codeLog.push(line);
    if (this.output) this.output.textContent = this.codeLog.join('\n');
  }

  escape(value) {
    return value.replace(/'/g, "\\'");
  }

  getLocator(el) {
    const tag = el.tagName.toLowerCase();
    const role = el.getAttribute('role');
    let baseSelector = tag;

    if (role) baseSelector += `[role="${role}"]`;

    const allMatching = Array.from(document.querySelectorAll(baseSelector));

    const index = allMatching.indexOf(el);

    if (index === -1) {
      console.warn('Element not found in list of similar elements:', el);
      return tag;
    }

    // Playwright syntax: locator('tag').nth(index)
    return `${baseSelector} >> nth=${index}`;
  }

  getImplicitRole(el) {
    const tag = el.tagName.toLowerCase();
    if (tag === 'button') return 'button';
    if (tag === 'a' && el.href) return 'link';
    if (tag === 'input') {
      const type = el.getAttribute('type');
      return ['button', 'submit', 'reset'].includes(type) ? 'button' : 'textbox';
    }
    if (tag === 'textarea') return 'textbox';
    return null;
  }

  downloadCode() {
    const blob = new Blob([
      'import { test, expect } from \'@playwright/test\';\n\ntest(\'recorded test\', async ({ page }) => {\n'
      + `  await page.goto('http://localhost:3000');\n${
        this.codeLog.map((l) => `  ${l}`).join('\n')
      }\n});`,
    ], { type: 'text/plain' });

    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'recorded-playwright-test.spec.ts';
    a.click();
  }

  resolveLocator(selector) {
    const [base, nthPart] = selector.split('>>').map((s) => s.trim());
    const nthMatch = nthPart?.match(/nth=(\d+)/);
    const nth = nthMatch ? parseInt(nthMatch[1], 10) : 0;

    const elements = document.querySelectorAll(base);
    return elements[nth] || null;
  }

  async simulateSteps(steps = this.codeLog, delay = 500) {
    for (const step of steps) {
      console.log('▶ Running:', step);

      if (step.startsWith('await page.click')) {
        const selector = step.match(/'([^']+)'/)[1];
        const el = this.resolveLocator(selector);
        if (el) el.click();
      } else if (step.startsWith('await page.fill')) {
        const [, selector, value] = step.match(/'([^']+)'\s*,\s*'([^']+)'/);
        const el = this.resolveLocator(selector);
        if (el) el.value = value;
      } else if (step.startsWith('await expect')) {
        const [, selector, method, expectedValue] = step.match(/'([^']+)'\)\)\.(toHave\w+)\('([^']+)'\)/);
        const el = this.resolveLocator(selector);
        if (!el) {
          console.warn('❌ Element not found:', selector);
          continue;
        }

        const actual = method === 'toHaveText' ? el.innerText.trim() : el.value;
        const pass = actual === expectedValue;
        console.log(`🔍 ASSERT ${method}:`, pass ? '✅ PASS' : `❌ FAIL — Expected: "${expectedValue}", Got: "${actual}"`);
      }

      // ⏳ Delay before next step
      await new Promise((r) => setTimeout(r, delay));
    }

    console.log('✅ All steps completed.');
  }

  delay(ms) {
    return new Promise((res) => { setTimeout(res, ms); });
  }

  async highlightElement(el) {
    if (!el) {
      console.warn('Element not found for highlighting:', el);
      return;
    }
    const originalTransition = el?.style?.transition;
    el.style.transition = 'outline 0.3s ease-in-out';
    el.style.outline = '3px solid #ff9800';
    await this.delay(500);
    el.style.outline = '';
    el.style.transition = originalTransition;
  }

  querySelectorSafe(selector) {
    try {
      if (selector.startsWith('getByRole')) return null; // skip unsupported in DOM
      return document.querySelector(`main.sidekick-library ${selector}`);
    } catch {
      return null;
    }
  }
}
