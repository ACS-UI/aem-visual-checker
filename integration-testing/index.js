export default function integrationTesting() {
  const themeRoot = window.parent?.document
    ?.querySelector('sidekick-library')
    ?.shadowRoot.querySelector('sp-theme');

  const actionBar = themeRoot
    ?.querySelector('plugin-renderer')
    ?.shadowRoot.querySelector('sp-split-view .details-container .action-bar');

  if (!actionBar) return;

  // -------------------------
  // Helpers
  // -------------------------
  function ensureButton(selector, label, attrs) {
    let btn = actionBar.querySelector(selector);
    if (!btn) {
      btn = document.createElement('sp-button');
      btn.classList.add(selector.replace('.', ''));
      Object.entries(attrs).forEach(([k, v]) => btn.setAttribute(k, v));
      btn.style.marginRight = '1rem';
      btn.textContent = label;
      actionBar?.querySelector('.actions')?.prepend(btn);
    } else {
      // Remove old listeners by cloning
      btn.replaceWith(btn.cloneNode(true));
      btn = actionBar.querySelector(selector);
    }
    return btn;
  }

  function getModal() {
    let modal = document.querySelector('#integrationModal');
    if (!modal) {
      modal = document.createElement('dialog');
      modal.id = 'integrationModal';
      modal.style.cssText = 'padding:20px; border-radius:8px; width:70vw; height:70vh;';
      document.body.appendChild(modal);
    }
    return modal;
  }

  function showReportModal(reportUrl) {
    const modal = getModal();
    const reportTimestamp = new Date().getTime();
    modal.innerHTML = `
        <style>
            dialog::backdrop {
                background-color: rgb(0, 0, 0, 70%);
            }
        </style>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
        <h2 style="margin:0; color:#d32f2f;">Test Results</h2>
        <button id="closeModal" style="
          padding:8px 16px;
          background:#0265dc;
          color:white;
          border:none;
          border-radius:4px;
          cursor:pointer;
        ">Close</button>
      </div>
      <div style="height: 100%; overflow:hidden;">
        <iframe
          src="${reportUrl}?t=${reportTimestamp}"
          style="width:100%; height:100%; border:1px solid #ccc; border-radius:4px; background:white;"
          title="Playwright Report"
        ></iframe>
      </div>
    `;
    modal.showModal();
    modal.querySelector('#closeModal').addEventListener('click', () => {
      modal.close();
    });
  }

  function getUrlComponent() {
    const url = window.parent.location.origin;
    const urlParams = new URLSearchParams(window.parent.location.search);
    const component = urlParams.get('path') || '';
    return url + component;
  }

  async function runFetch(endpoint, body, button, runningLabel, defaultLabel, showModal = false) {
    button.setAttribute('disabled', 'true');
    button.textContent = runningLabel;
    try {
      const res = await fetch(`http://localhost:3001/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) console.log('Successfully retrieved response');
    } catch (err) {
      console.error(`Error calling ${endpoint}:`, err);
    } finally {
      button.removeAttribute('disabled');
      button.textContent = defaultLabel;
      if (showModal) showReportModal('http://localhost:3001/playwright-report/index.html');
    }
  }

  // -------------------------
  // Buttons
  // -------------------------
  const createBtn = ensureButton('.integration-button', 'Create', {
    dir: 'ltr',
    size: 'm',
    treatment: 'outline',
    tabindex: '0',
    role: 'button',
    variant: 'accent',
  });

  const playBtn = ensureButton('.play-integration', 'Play', {
    dir: 'ltr',
    size: 'm',
    treatment: 'outline',
    tabindex: '0',
    role: 'button',
    variant: 'success',
  });

  const playAllBtn = ensureButton('.play-all', 'Play All', {
    dir: 'ltr',
    size: 'm',
    treatment: 'outline',
    tabindex: '0',
    role: 'button',
    variant: 'accent',
  });

  // -------------------------
  // Event Handlers
  // -------------------------
  createBtn.addEventListener('click', () => {
    runFetch(
      'start-codegen',
      { url: getUrlComponent(), testName: 'Integration Test' },
      createBtn,
      'Started...',
      'Create',
    );
  });

  playBtn.addEventListener('click', () => {
    runFetch(
      'play-codegen',
      { url: getUrlComponent(), testName: 'Integration Test' },
      playBtn,
      'Running...',
      'Play',
      true,
    );
  });

  playAllBtn.addEventListener('click', () => {
    runFetch(
      'play-all-codegen',
      { url: getUrlComponent(), testName: 'Integration Test' },
      playAllBtn,
      'Running All...',
      'Play All',
      true,
    );
  });
}

// Re-run on URL change
window.parent?.addEventListener('popstate', integrationTesting);

// Initial run
integrationTesting();
