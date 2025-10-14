export default function integrationTesting() {
  const themeRoot = window.parent?.document
    ?.querySelector('sidekick-library')
    ?.shadowRoot.querySelector('sp-theme');
  const actionBar = themeRoot
    ?.querySelector('plugin-renderer')
    ?.shadowRoot.querySelector('sp-split-view .view .action-bar sp-action-group');
  const interactionCon = actionBar.querySelector('.interaction-container');
  if (interactionCon) interactionCon.remove();

  const interactionContainer = document.createElement('div');
  interactionContainer.classList.add('interaction-container');
  const interactionButton = document.createElement('sp-button');
  const attr = {
    dir: 'ltr',
    size: 'm',
    treatment: 'outline',
    tabindex: '0',
    role: 'button',
    variant: 'secondary',
  };
  interactionButton.innerHTML = `<span>Interaction Testing</span> <span style="    position: absolute;
    right: 8px;
    top: 7px;"><svg xmlns="http://www.w3.org/2000/svg" width="20px" height="14px" viewBox="0 -19.04 75.804 75.804">
  <g id="Group_67" data-name="Group 67" transform="translate(-798.203 -587.815)">
    <path id="Path_59" data-name="Path 59" d="M798.2,589.314a1.5,1.5,0,0,1,2.561-1.06l33.56,33.556a2.528,2.528,0,0,0,3.564,0l33.558-33.556a1.5,1.5,0,1,1,2.121,2.121l-33.558,33.557a5.53,5.53,0,0,1-7.807,0l-33.56-33.557A1.5,1.5,0,0,1,798.2,589.314Z" fill="#0c2c67"/>
  </g>
</svg></span>`;
  Object.assign(attr, interactionButton);
  Object.keys(attr).forEach((att) => interactionButton.setAttribute(att, attr?.[att]));
  interactionButton.style.cssText = 'border-radius: 15px; margin-inline: 6px; position:relative;padding-right: 40px';
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
  document.addEventListener('click', () => {
    interactionContainer.classList.remove('active');
  });
  interactionContainer.appendChild(interactionContainerStyles);
  interactionButton.addEventListener('click', (e) => {
    e.stopPropagation();
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
    themeRoot?.querySelector('plugin-renderer')?.shadowRoot.querySelector(`sp-action-button[value="${viewport}"]`)?.setAttribute('aria-checked', true);
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
      if (showModal) showReportModal('http://localhost:3001/playwright-report/index.html');
    }
  }
  const menuBar = document.createElement('sp-menu');
  menuBar.setAttribute('label', 'Selection type');
  menuBar.style.cssText = 'position:absolute; top:10px; right:10px;background: #fff;width: 100%; top: 100%; left: 0;';
  const items = ['Test', 'Test All Blocks', 'Create'];
  items.forEach((item) => {
    const menuItems = document.createElement('sp-menu-item');
    menuItems.textContent = item;
    menuBar.appendChild(menuItems);
    menuItems.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      let url = '';
      let runningLabel = '';
      let defaultLabel = '';
      let showModal = false;
      if (item === 'Test All Blocks') {
        url = 'play-all-codegen';
        runningLabel = 'Running All...';
        defaultLabel = 'Test All Blocks';
        showModal = true;
      } else if (item === 'Create') {
        url = 'start-codegen';
        runningLabel = 'Started...';
        defaultLabel = 'Create';
        showModal = false;
      } else {
        url = 'play-codegen';
        runningLabel = 'Running...';
        defaultLabel = 'Test';
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
