import InteractionRecorder from './Interaction-Recorder.js';

const sidekickRoot = window.parent?.document.querySelector('sidekick-library')?.shadowRoot;
const themeRoot = sidekickRoot?.querySelector('sp-theme');
const actionBar = themeRoot?.querySelector('plugin-renderer')?.shadowRoot.querySelector('sp-split-view sp-split-view .details-container .action-bar');
const detailsRoot = themeRoot?.querySelector('plugin-renderer')?.shadowRoot;

new InteractionRecorder({
  mountEl: actionBar,
  shadowRoot: detailsRoot,
});
