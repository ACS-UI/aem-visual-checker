export const OVERLAY = {
  imageRoot: '/tools/visual-tests/blocks',
};

export const VIEWPORTS = [
  {
    width: '320px', height: '568px', label: 'Mobile', icon: 'device-phone',
  },
  {
    width: '768px', height: '1024px', label: 'Tablet', icon: 'device-tablet',
  },
  {
    width: '1024px', height: '768px', label: 'Desktop', icon: 'device-desktop',
  },
  {
    width: '1440px', height: '900px', label: 'Large', icon: 'device-desktop', default: true,
  },
];

export const viewportSizes = VIEWPORTS.reduce((acc, viewport) => {
  acc[viewport.name] = { width: viewport.width, height: viewport.height };
  return acc;
}, {});

// Sidekick Library configuration
export const SIDEKICK_CONFIG = {
  JSONPath: '/tools/sidekick/library/library.json',
  templatesPath: '/tools/sidekick/library/templates/',
};

// add your token here
export const FIGMA_ACCESS_TOKEN = 'figd_m0UD_kKKOvgfA6XCfMgYpm-ggtdGQ7VeMR-jyUMr';
