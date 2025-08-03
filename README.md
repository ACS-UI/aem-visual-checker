# Your Project's Title...
Your project's description...

## Environments
- Preview: https://main--{repo}--{owner}.aem.page/
- Live: https://main--{repo}--{owner}.aem.live/

## Documentation

Before using the aem-boilerplate, we recommand you to go through the documentation on https://www.aem.live/docs/ and more specifically:
1. [Developer Tutorial](https://www.aem.live/developer/tutorial)
2. [The Anatomy of a Project](https://www.aem.live/developer/anatomy-of-a-project)
3. [Web Performance](https://www.aem.live/developer/keeping-it-100)
4. [Markup, Sections, Blocks, and Auto Blocking](https://www.aem.live/developer/markup-sections-blocks)

## Installation

```sh
npm i
```

## Linting

```sh
npm run lint
```

## Local development

1. Create a new repository based on the `aem-boilerplate` template and add a mountpoint in the `fstab.yaml`
1. Add the [AEM Code Sync GitHub App](https://github.com/apps/aem-code-sync) to the repository
1. Install the [AEM CLI](https://github.com/adobe/helix-cli): `npm install -g @adobe/aem-cli`
1. Start AEM Proxy: `aem up` (opens your browser at `http://localhost:3000`)
1. Open the `{repo}` directory in your favorite IDE and start coding :)

## Visual Testing

This project includes automated visual regression testing using Playwright. Visual tests are automatically triggered when pull requests are created or updated.

### How it works

1. **PR Creation**: When a developer creates a PR with new component code and baseline images, the GitHub workflow automatically triggers
2. **Deployment**: The workflow waits for the sidekick to be deployed at the branch-specific URL
3. **Testing**: Visual tests run against the deployed sidekick URL in the format: `https://branch-name--aem-visual-cheker--acs-ui.aem.page/`
4. **Results**: Test results are uploaded as artifacts and a comment is posted to the PR

### Running visual tests locally

```sh
# Run all visual tests
npm run test:visual

# Run visual tests with UI
npm run test:visual:ui

# Update baseline images
npm run test:visual:update

# Generate new visual tests
npm run test:visual:generate

# Run tests for a specific component
npm run test:visual:component

# Start the visual test server
npm run test:visual:server
```

### Configuration

The visual tests are configured to work with both local development and CI environments:

- **Local**: Uses `http://localhost:3000` as the base URL (requires `aem up`)
- **CI**: Uses the deployed sidekick URL from the branch name

The base URL can be configured using the `BASE_URL` environment variable.