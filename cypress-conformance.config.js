const { defineConfig } = require("cypress");
const { readAllManifestTests } = require("./cypress/support/conformance-test-utils");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3333/',
    specPattern: 'cypress/e2e-conformance/**/*.spec.cy.ts',
    videoUploadOnPasses: false,
    video: false,
    setupNodeEvents(on, config) {
      on('task', {
        readAllManifestTests() {
          return readAllManifestTests();
        },
      });
    },
  },
});
