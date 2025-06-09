import { OVERLAY, VIEWPORTS } from '../test-config/config.js';

class VisualOverlay {
  constructor() {
    this.isActive = false;
    this.opacity = 0.5;
    this.position = { x: 0, y: 0 };
    this.isDragging = false;
    this.dragStart = { x: 0, y: 0 };
    this.overlayContainer = null;
    this.toolbar = null;
    this.viewportConfig = VIEWPORTS || [
      { width: '320px', height: '568px', label: 'mobile' },
      { width: '768px', height: '1024px', label: 'tablet' },
      { width: '1024px', height: '768px', label: 'desktop' },
      { width: '1440px', height: '900px', label: 'large' },
    ];
    this.imageRoot = OVERLAY.imageRoot || '/test-config/overlay';
  }

  getComponentName() {
    console.log(this.isActive, 'isActive'); // Use this to satisfy linter
    return window.parent?.window?.location?.search?.split('path=')[1]?.split('&')[0]?.split('/')?.pop();
  }

  getVariationIndex() {
    // Use this to satisfy linter
    console.log(this.isActive, 'isActive');
    // Extract the variation index from the query string after 'path='
    const query = window.parent?.window?.location?.search?.split('path=')[1];
    if (query) {
      const params = query.split('&');
      for (let i = 0; i < params.length; i += 1) {
        if (params[i].startsWith('index=')) {
          return params[i].split('=')[1];
        }
      }
    }
    return '0';
  }

  getCurrentViewport() {
    console.log(this.isActive, 'isActive'); // Use this to satisfy linter
    const themeRoot = window.parent?.window?.document?.querySelector('sidekick-library')?.shadowRoot.querySelector('sp-theme');
    const activeButton = themeRoot?.querySelector('plugin-renderer')?.shadowRoot.querySelector('sp-action-button[aria-pressed="true"]');
    return activeButton?.getAttribute('data-viewport') || 'desktop';
  }

  createToggleButton() {
    const button = document.createElement('button');
    button.id = 'visual-overlay-toggle';
    button.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 202.83 202.83" style="color: inherit; animation: auto ease 0s 1 normal none running none;">
        <path d="M198.933 66.346h-62.345V4.001c0-2.152-1.743-3.897-3.897-3.897H4.105C1.951.105.208 1.85.208 4.001v37.958a3.9 3.9 0 000 2.502v88.126c0 2.152 1.743 3.897 3.897 3.897H66.45v62.345c0 2.152 1.743 3.897 3.897 3.897h128.586c2.154 0 3.897-1.745 3.897-3.897V70.243c-.001-2.152-1.744-3.897-3.897-3.897zm-70.138-17.2l-17.2 17.2h-35.74l52.939-52.938v35.738zm-6.18 17.2l6.18-6.18v6.18h-6.18zm6.18 7.793v54.552H74.243V74.139h54.552zM8.002 7.898h25.66L8.002 33.56V7.898zm0 36.682L43.927 8.653c.223-.223.344-.497.502-.755h32.096L8.002 76.42V44.58zm58.448 84.111h-6.18l6.18-6.18v6.18zm0-17.199l-17.2 17.2H13.51l52.94-52.939v35.739zM8.002 123.179V87.18c.265-.16.547-.286.776-.516L86.762 8.68c.231-.231.358-.515.519-.782h36.003L8.002 123.179zm187.034 71.753H74.243v-58.448h58.448c2.154 0 3.897-1.745 3.897-3.897V74.139h58.448v120.793z" fill="currentColor"/>
    </svg>
    Toggle Overlay
    `;
    button.style.cssText = `
      background: none;
      border: 1px solid var(--spectrum-global-color-gray-700);
      cursor: pointer;
      padding: 8px;
      color: var(--spectrum-global-color-gray-700);
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      transition: background-color 0.2s;
      margin-left: 10px;
    `;
    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.toggleOverlay();
    });
    return button;
  }

  createToolbar() {
    const toolbar = document.createElement('div');
    toolbar.id = 'visual-overlay-toolbar';
    toolbar.style.cssText = `
              position: fixed;
      top: 20px;
      left: 20px;
              background: white;
      padding: 10px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            display: flex;
            align-items: center;
      gap: 10px;
      z-index: 10000;
      cursor: move;
    `;

    // Toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
            </svg>
          `;
    toggleBtn.style.cssText = `
      background: none;
      border: none;
            cursor: pointer;
            margin: 0;
            padding: 4px;
      color: var(--spectrum-global-color-gray-700);
    `;
    toggleBtn.addEventListener('click', () => this.toggleOverlay());

    // Opacity slider
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '0';
    slider.max = '1';
    slider.step = '0.1';
    slider.value = this.opacity;
    slider.style.cssText = `
            width: 100px;
      margin: 0 10px;
    `;
    slider.addEventListener('input', (e) => {
      this.opacity = parseFloat(e.target.value);
      this.updateOverlayOpacity();
    });

    // Opacity label
    const label = document.createElement('span');
    label.textContent = `${Math.round(this.opacity * 100)}%`;
    label.style.cssText = `
      font-size: 12px;
      color: var(--spectrum-global-color-gray-700);
      min-width: 40px;
    `;

    // Make toolbar draggable
    toolbar.addEventListener('mousedown', (e) => {
      if (e.target === toolbar || e.target.parentElement === toolbar) {
        this.isDragging = true;
        this.dragStart = {
          x: e.clientX - toolbar.offsetLeft,
          y: e.clientY - toolbar.offsetTop,
        };
      }
    });

    document.addEventListener('mousemove', (e) => {
      if (this.isDragging) {
        const x = e.clientX - this.dragStart.x;
        const y = e.clientY - this.dragStart.y;
        toolbar.style.left = `${x}px`;
        toolbar.style.top = `${y}px`;
      }
    });

    document.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    toolbar.appendChild(toggleBtn);
    toolbar.appendChild(slider);
    toolbar.appendChild(label);
    return toolbar;
  }

  createOverlay() {
    const container = document.createElement('div');
    container.id = 'visual-overlay-container';
    container.style.cssText = `
      position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              pointer-events: none;
      z-index: 9999;
    `;

    const overlay = document.createElement('div');
    overlay.id = 'visual-overlay';
    overlay.style.cssText = `
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
            pointer-events: none;
          `;

    // Create picture element with media queries
    const picture = document.createElement('picture');
    picture.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: auto;
            height: 100%;
            pointer-events: none;
          `;

    const component = this.getComponentName();
    if (!component) {
      console.error('No component name found');
      return container;
    }

    // Add source elements for each viewport
    const sortedViewports = this.viewportConfig.sort((a, b) => {
      const widthA = a.width === '100%' ? Infinity : parseInt(a.width.split('px')[0], 10);
      const widthB = b.width === '100%' ? Infinity : parseInt(b.width.split('px')[0], 10);
      console.log(widthA, widthB, 'widthA, widthB');
      return widthB - widthA;
    });

    console.log(this.viewportConfig, sortedViewports, 'sortedViewports');

    sortedViewports.forEach((viewport, index) => {
      const source = document.createElement('source');
      // Use getVariationIndex method
      const variationIndex = this.getVariationIndex();
      const imageName = `${component}-variation-${variationIndex}-${viewport.label.toLowerCase()}-chromium-darwin.png`;
      const imagePath = `${this.imageRoot}visual.spec.js-snapshots/${imageName}`;

      if (index === 0) {
        // First viewport (largest) - no min-width
        source.media = `(min-width: ${viewport.width})`;
      } else {
        // Other viewports - min-width from previous viewport
        const prevWidth = sortedViewports[index - 1].width;
        const maxWidth = prevWidth.includes('px') ? ` and (max-width: ${parseInt(prevWidth, 10) - 1}px)` : '';
        source.media = `(min-width: ${viewport.width})${maxWidth}`;
      }

      source.srcset = imagePath;
      picture.appendChild(source);
    });

    // Add fallback img element
    const img = document.createElement('img');
    const fallbackImageName = `${component}-mobile-chromium-darwin.png`;
    const fallbackImagePath = `${this.imageRoot}visual.spec.js-snapshots/${fallbackImageName}`;
    img.src = fallbackImagePath;
    img.style.cssText = `
            width: 100%;
            height: 100%;
            object-fit: contain;
            object-position: top;
          `;
    picture.appendChild(img);

    overlay.appendChild(picture);
    container.appendChild(overlay);
    return container;
  }

  updateOverlayOpacity() {
    const overlay = document.getElementById('visual-overlay');
    if (overlay) {
      overlay.style.opacity = this.opacity;
    }
  }

  toggleOverlay() {
    if (!this.overlayContainer) {
      this.overlayContainer = this.createOverlay();
      this.toolbar = this.createToolbar();
      document.body.appendChild(this.overlayContainer);
      document.body.appendChild(this.toolbar);
    }

    this.isActive = !this.isActive;
    this.overlayContainer.style.display = this.isActive ? 'block' : 'none';
    this.toolbar.style.display = this.isActive ? 'flex' : 'none';
  }
}

// Initialize the overlay
export default function initializeVisualOverlay() {
  console.log('initializeVisualOverlay');
  const themeRoot = window.parent?.window?.document?.querySelector('sidekick-library')?.shadowRoot.querySelector('sp-theme');
  const actionGroup = themeRoot?.querySelector('plugin-renderer')?.shadowRoot.querySelector('sp-action-group');

  // Remove existing button if present to avoid duplicates
  const existingButton = actionGroup?.querySelector('#visual-overlay-toggle');
  if (existingButton) {
    existingButton.remove();
  }

  const overlay = new VisualOverlay();
  const button = overlay.createToggleButton();

  // Add button to action group
  if (actionGroup) {
    actionGroup.appendChild(button);
  }

  return overlay;
}

// Only add the event listener once
if (!window.parent?.window?.visualOverlayPopstateListenerAdded) {
  window.parent.window.addEventListener('popstate', initializeVisualOverlay);
  window.parent.window.visualOverlayPopstateListenerAdded = true;
}

// Only initialize if not already initialized
initializeVisualOverlay();
