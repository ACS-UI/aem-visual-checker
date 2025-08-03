// Visual test configuration
export const config = {
  // URL patterns for different environments
  urlPatterns: {
    // Local development
    local: {
      baseUrl: 'http://localhost:3000',
      serverUrl: 'http://localhost:3001',
    },
    // CI/CD environment
    ci: {
      baseUrl: process.env.BASE_URL || 'https://main--aem-visual-cheker--acs-ui.aem.page',
      serverUrl: 'http://0.0.0.0:3001',
      // Pattern for generating branch-specific URLs
      branchUrlPattern: 'https://{branch-name}--aem-visual-cheker--acs-ui.aem.page',
    },
  },
  
  // Test configuration
  test: {
    selectorTimeout: 30000,
    renderTimeout: 2000,
    maxDiffPixels: 500,
    threshold: 0.1,
  },
  
  // Viewport configurations for responsive testing
  viewports: [
    { label: 'mobile', width: 320, height: 568 },
    { label: 'tablet', width: 768, height: 1024 },
    { label: 'desktop', width: 1280, height: 720 },
  ],
  
  // Get the appropriate configuration based on environment
  getConfig() {
    return process.env.CI ? this.urlPatterns.ci : this.urlPatterns.local;
  },
  
  // Generate branch URL for CI environment
  getBranchUrl(branchName) {
    if (!process.env.CI) {
      return this.urlPatterns.local.baseUrl;
    }
    
    const cleanBranchName = branchName
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    return this.urlPatterns.ci.branchUrlPattern.replace('{branch-name}', cleanBranchName);
  },
};

export default config; 