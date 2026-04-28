import {YasrSteps} from '../../steps/yasr-steps';
import {YasguiSteps} from '../../steps/yasgui-steps';
import ViewConfigurationsPageSteps from '../../steps/view-configurations-page-steps';
import {YasqeSteps} from '../../steps/yasqe-steps';
import {ToolbarPageSteps} from '../../steps/toolbar-page-steps';

describe('YASR fullscreen', () => {

  it('should open YASR in non-fullscreen mode by default with escape enabled', () => {
    // WHEN: I open a page that contains "ontotext-yasgui-web-component" without a yasrFullscreen configuration.
    ViewConfigurationsPageSteps.visit();
    YasqeSteps.executeQuery();
    // THEN: I should see YASR results in non-fullscreen mode, because the default behavior is not to open YASR in fullscreen.
    verifyYasrNonFullscreen();

    // WHEN: I toggle to fullscreen mode.
    YasrSteps.toggleFullscreen();
    // THEN: I should see YASR results in fullscreen mode.
    verifyYasrExpandFullscreen();
    // AND: I should see the notification that describes how to exit fullscreen mode.
    ViewConfigurationsPageSteps.getOutputMessage().should('contain.text', '{"TYPE":"notificationMessage","payload":{"code":"yasr_exit_fullscreen","messageType":"info","message":"Press Esc to exit full screen"}}');

    // WHEN: I press the ESC key.
    YasguiSteps.pressEscape();
    // THEN: I should see YASR results in non-fullscreen mode, because escape is enabled by default.
    verifyYasrNonFullscreen();
  });

  it('should open YASR in fullscreen via configuration with escape disabled', () => {
    // WHEN: I open a page that contains "ontotext-yasgui-web-component" with YASR in fullscreen set via configuration.
    ViewConfigurationsPageSteps.visit();
    YasqeSteps.executeQuery();
    verifyYasrNonFullscreen();
    ViewConfigurationsPageSteps.configureYasrFullscreenOn();
    // THEN: I should see YASR results in fullscreen mode, because it is configured to start in fullscreen.
    verifyYasrFullscreen();
    // AND: I should not see the notification that describes how to exit fullscreen mode.
    ViewConfigurationsPageSteps.getOutputMessage().should('not.exist');
    // WHEN: I press the ESC key.
    YasguiSteps.pressEscape();
    // THEN: I should see YASR remains in fullscreen.
    verifyYasrFullscreen();
    // AND: I should not see the notification that describes how to exit fullscreen mode.
    ViewConfigurationsPageSteps.getOutputMessage().should('not.exist');
  });

  it('should open YASR in non-fullscreen mode via configuration and escape enabled', () => {
    // WHEN: I open a page that contains "ontotext-yasgui-web-component" with YASR in non-fullscreen and escape allowed.
    ViewConfigurationsPageSteps.visit();
    YasqeSteps.executeQuery();
    verifyYasrNonFullscreen();
    ViewConfigurationsPageSteps.configureYasrFullscreenOff();
    // THEN: I should see YASR results in non-fullscreen mode, because it is configured not to start in fullscreen.
    verifyYasrNonFullscreen();
    // WHEN: I toggle to fullscreen mode.
    YasrSteps.toggleFullscreen();
    // THEN: I should see YASR results in fullscreen mode.
    verifyYasrExpandFullscreen();
    // AND: I should see the notification that describes how to exit fullscreen mode.
    ViewConfigurationsPageSteps.getOutputMessage().should('contain.text', '{"TYPE":"notificationMessage","payload":{"code":"yasr_exit_fullscreen","messageType":"info","message":"Press Esc to exit full screen"}}');

    // WHEN: I press the ESC key.
    YasguiSteps.pressEscape();
    // THEN: I should see YASR results in non-fullscreen mode, because escape is enabled by default.
    verifyYasrNonFullscreen();
  });
});

const verifyYasrFullscreen = () => {
  // Check the result table is rendered to be sure that the YASR is fully rendered.
  YasrSteps.getResultsTable().should('exist');
  // I should see YASR results in fullscreen.
  YasrSteps.getYasr().should('have.class', 'yasr-fullscreen');
  // I should not see the plugins header
  YasrSteps.getResultHeader().should('be.visible');
  YasrSteps.getPluginSelectors().should('not.exist');
  YasrSteps.getFullscreenButton().should('not.exist')
  // I should not see YASQE
  YasqeSteps.getYasqe().should('not.exist');
  // I should not see control bar
  YasguiSteps.getControlBar().should('not.exist');
  // I should not see tabs
  YasqeSteps.getQueryTabs().should('not.exist');
  YasrSteps.getPagination().should('be.visible');
  // I should not see yasgui-toolbar because it has class hidden
  ToolbarPageSteps.getToolbar().should('have.class', 'hidden').and('not.be.visible');
}

const verifyYasrNonFullscreen = () => {
  YasrSteps.getYasr().should('not.have.class', 'yasr-fullscreen');
  YasrSteps.getResultHeader().should('be.visible');
  YasrSteps.getPluginSelectors().should('be.visible');
  YasrSteps.getFullscreenButton().should('be.visible')
  YasqeSteps.getYasqe().should('be.visible');
  YasguiSteps.getControlBar().should('exist');
  YasqeSteps.getQueryTabs().should('be.visible');
  YasrSteps.getPagination().should('be.visible');
  ToolbarPageSteps.getToolbar().should('not.have.class', 'hidden').and('be.visible');

  YasrSteps.getFullscreenButton().should('attr', 'aria-label', 'Enter full screen');
}

const verifyYasrExpandFullscreen = () => {
  YasrSteps.getYasr().should('have.class', 'yasr-fullscreen');
  YasrSteps.getResultHeader().should('be.visible');
  YasrSteps.getPluginSelectors().should('be.visible');
  YasrSteps.getFullscreenButton().should('be.visible')
  YasqeSteps.getYasqe().should('be.visible');
  YasguiSteps.getControlBar().should('exist');
  YasqeSteps.getQueryTabs().should('be.visible');
  YasrSteps.getPagination().should('be.visible');
  ToolbarPageSteps.getToolbar().should('not.have.class', 'hidden').and('be.visible');

  YasrSteps.getFullscreenButton().should('attr', 'aria-label', 'Exit full screen');
}
