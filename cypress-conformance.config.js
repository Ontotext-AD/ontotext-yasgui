const { defineConfig } = require("cypress");
const { readAllManifestTests } = require("./cypress/support/conformance-test-utils");
const setupPlugins = require('./cypress/plugins/index.js');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3333/',
    specPattern: 'cypress/e2e-conformance/**/*.spec.cy.ts',
    screenshotsFolder: 'cypress/report/screenshots',
    screenshotOnRunFailure: true,
    videosFolder: 'cypress/report/videos',
    video: true,
    videoUploadOnPasses: false,
    setupNodeEvents(on, config) {
      setupPlugins(on, config);
      on('task', {
        readAllManifestTests() {
          return readAllManifestTests();
        },
      });
    },
  },
});
