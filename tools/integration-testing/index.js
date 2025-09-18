export default function integrationTesting() {
  const themeRoot = window.parent?.document
    ?.querySelector('sidekick-library')
    ?.shadowRoot.querySelector('sp-theme');
  const actionBar = themeRoot
    ?.querySelector('plugin-renderer')
    ?.shadowRoot.querySelector('sp-split-view .view .action-bar sp-action-group');
  const interactionCon = actionBar.querySelector('.interaction-container');
  if (interactionCon) return;

  const interactionContainer = document.createElement('div');
  interactionContainer.classList.add('interaction-container');
  const interactionButton = document.createElement('sp-button');
  const attr = {
    dir: 'ltr',
    size: 'm',
    treatment: 'outline',
    tabindex: '0',
    role: 'button',
    variant: 'accent',
  };
  interactionButton.textContent = 'Interaction Testing';
  Object.assign(attr, interactionButton);
  interactionButton.style.cssText = 'border-radius: 15px; margin-inline: 6px; position:relative;';
  interactionButton.classList.add('active');
  interactionContainer.appendChild(interactionButton);
  const interactionContainerStyles = document.createElement('style');
  interactionContainerStyles.innerHTML = `
    .interaction-container sp-menu {
      display: none;
    }
    .interaction-container.active sp-menu {
      display: block;
    }
  `;

  interactionContainer.appendChild(interactionContainerStyles);
  interactionButton.addEventListener('click', () => {
    interactionContainer.classList.toggle('active');
  });
  actionBar.appendChild(interactionContainer);
  function getCurrentViewport() {
    const activeButton = themeRoot?.querySelector('plugin-renderer')?.shadowRoot.querySelector('sp-action-button[aria-checked="true"]');
    const value = activeButton?.getAttribute('value');
    let viewport = 'mobile';
    if (value === 'viewPort1') {
      viewport = 'tablet';
    } else if (value === 'viewPort2' || value === 'viewPort3') {
      viewport = 'desktop';
    }
    return viewport;
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
      // eslint-disable-next-line no-console
      if (res.ok) console.log('Successfully retrieved response');
    } catch (err) {
      console.error(`Error calling ${endpoint}:`, err);
    } finally {
      button.removeAttribute('disabled');
      button.textContent = defaultLabel;
      console.log(showModal);
      if (showModal) showReportModal('http://localhost:3001/playwright-report/index.html');
    }
  }
  const menuBar = document.createElement('sp-menu');
  menuBar.setAttribute('label', 'Selection type');
  menuBar.style.cssText = 'position:absolute; top:10px; right:10px;background: #fff;width: 100%; top: 100%; left: 0;';
  const items = ['Play', 'Play All', 'Create'];
  items.forEach((item) => {
    const menuItems = document.createElement('sp-menu-item');
    menuItems.textContent = item;
    menuBar.appendChild(menuItems);
    menuItems.addEventListener('click', () => {
      let url = '';
      let runningLabel = '';
      let defaultLabel = '';
      let showModal = false;
      if (item === 'Play All') {
        url = 'play-all-codegen';
        runningLabel = 'Running All...';
        defaultLabel = 'Play All';
        showModal = true;
      } else if (item === 'Create') {
        url = 'start-codegen';
        runningLabel = 'Started...';
        defaultLabel = 'Create';
        showModal = false;
      } else {
        url = 'play-codegen';
        runningLabel = 'Running...';
        defaultLabel = 'Play';
        showModal = true;
      }
      runFetch(
        url,
        { url: getUrlComponent(), testName: 'Integration Test', device: getCurrentViewport() },
        menuItems,
        runningLabel,
        defaultLabel,
        showModal,
      );
    });
  });
  actionBar.querySelector('.interaction-container').append(menuBar);
}

// Re-run on URL change
window.parent?.addEventListener('popstate', integrationTesting);

// Initial run
integrationTesting();
