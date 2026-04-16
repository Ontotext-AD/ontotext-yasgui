const { defineConfig } = require("cypress");
const setupPlugins = require('./cypress/plugins/index.js');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3333/',
    screenshotsFolder: 'cypress/report/screenshots',
    screenshotOnRunFailure: true,
    videosFolder: 'cypress/report/videos',
    video: true,
    videoUploadOnPasses: false,
    retries: {
      runMode: 1,
      openMode: 0
    },
    setupNodeEvents(on, config) {
      setupPlugins(on, config);
    },
  },
});
