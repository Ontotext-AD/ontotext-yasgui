const { defineConfig } = require("cypress");
const { readAllManifestTests } = require("./cypress/support/conformance-test-utils");
const setupPlugins = require('./cypress/plugins/index.js');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3333/',
    specPattern: ['cypress/e2e-conformance/**/*.spec.cy.ts'],
    screenshotsFolder: 'cypress/report/screenshots',
    screenshotOnRunFailure: true,
    videosFolder: 'cypress/report/videos',
    video: true,
    videoUploadOnPasses: false,
    // The conformance specs declare one test per W3C test file, so a page reload before each
    // of them would dominate the run time. Instead the editor is visited once per spec, in a
    // `before()` hook, and all tests of that spec share the page.
    testIsolation: false,
    setupNodeEvents(on, config) {
      const resolvedConfig = setupPlugins(on, config) || config;
      // The manifests have to be available while the spec files are being *defined*, because
      // that is when the `it()` per W3C test file gets created. `cy.task()` resolves too late
      // for that, so the data is handed over through `env` instead.
      resolvedConfig.env = {...resolvedConfig.env, conformanceManifests: readAllManifestTests()};
      return resolvedConfig;
    },
  },
});
