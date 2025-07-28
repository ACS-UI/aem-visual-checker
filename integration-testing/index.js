export default function integerationTesting() {
  const themeRoot = window.parent?.window?.document?.querySelector('sidekick-library')?.shadowRoot.querySelector('sp-theme');
  const actionBar = themeRoot?.querySelector('plugin-renderer')?.shadowRoot.querySelector('sp-split-view sp-split-view .details-container .action-bar');

  if (actionBar?.querySelectorAll('.integration-button')?.length) return;
  const button = document.createElement('sp-button');
  button.classList.add('integration-button');
  const attrs = {
    dir: 'ltr',
    size: 'm',
    treatment: 'fill',
    focusable: '',
    tabindex: '0',
    role: 'button',
    variant: 'accent',
  };

  button.style.marginRight = '1rem';

  Object.keys(attrs).forEach((key) => {
    button.setAttribute(key, attrs[key]);
  });
  actionBar?.querySelector('.actions')?.prepend(button);
  button.innerHTML = 'Interaction Recorder';
  button.addEventListener('click', async (event) => {
    if (event.target.classList.contains('integration-button')) {
      const url = window.parent.location.origin;
      const urlParams = new URLSearchParams(window.parent.location.search);
      const component = urlParams.get('path'); // e.g., 'value' from ?key=value
      fetch('http://localhost:3001/start-codegen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url + component,
          testName: 'Integration Test',
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Integration test started:', data);
          alert('Integration test started. Check the console for details.');
        })
        .catch((error) => {
          console.error('Error starting integration test:', error);
          alert('Failed to start integration test. Check the console for details.');
        });
    }
  });
}

integerationTesting();
