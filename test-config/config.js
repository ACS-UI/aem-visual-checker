export const OVERLAY = {
  imageRoot: '/tools/visual-tests/',
};

export const VIEWPORTS = [
  {
    width: 320, height: 568, label: 'Mobile', icon: 'device-phone',
  },
  {
    width: 768, height: 1024, label: 'Tablet', icon: 'device-tablet',
  },
  {
    width: 1024, height: 768, label: 'Desktop', icon: 'device-desktop',
  },
  {
    width: 1440, height: 900, label: 'Large', icon: 'device-desktop', default: true,
  },
];

export const viewportSizes = VIEWPORTS.reduce((acc, viewport) => {
  acc[viewport.name] = { width: viewport.width, height: viewport.height };
  return acc;
}, {});

// Sidekick Library configuration
export const SIDEKICK_CONFIG = {
  templatesPath: '/tools/sidekick/library/templates/',
};
