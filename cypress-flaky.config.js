const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3333/',
    specPattern: 'cypress/e2e-flaky/**/*.spec.cy.ts',
    videoUploadOnPasses: false,
    video: false,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
