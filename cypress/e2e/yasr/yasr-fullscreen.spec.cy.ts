import {YasrSteps} from '../../steps/yasr-steps';
import {YasguiSteps} from '../../steps/yasgui-steps';
import ViewConfigurationsPageSteps from '../../steps/view-configurations-page-steps';
import {YasqeSteps} from '../../steps/yasqe-steps';

describe('YASR fullscreen', () => {

  it('should open YASR in non-fullscreen mode with escape enabled by default', () => {
    // WHEN: I open a page that contains "ontotext-yasgui-web-component" without a yasrFullscreen configuration.
    ViewConfigurationsPageSteps.visit();
    YasqeSteps.executeQuery();
    // THEN: I should see YASR results in non-fullscreen mode, because the default behavior is not to open YASR in fullscreen.
    verifyYasrNonFullscreen();

    // WHEN: I toggle to fullscreen mode.
    YasrSteps.toggleFullscreen();
    // THEN: I should see YASR results in fullscreen mode.
    verifyYasrFullscreen();
    // AND: I should see the notification that describes how to exit fullscreen mode.
    ViewConfigurationsPageSteps.getOutputMessage().should('contain.text', '{"TYPE":"notificationMessage","payload":{"code":"yasr_exit_fullscreen","messageType":"info","message":"Press Esc to exit full screen"}}');

    // WHEN: I press the ESC key.
    YasguiSteps.pressEscape();
    // THEN: I should see YASR results in non-fullscreen mode, because escape is enabled by default.
    verifyYasrNonFullscreen();
  });

  it('should open YASR in fullscreen mode with escape enabled via configuration', () => {
    // WHEN: I open a page that contains "ontotext-yasgui-web-component" with YASR in fullscreen and escape allowed.
    ViewConfigurationsPageSteps.visit();
    YasqeSteps.executeQuery();
    ViewConfigurationsPageSteps.configureYasrFullscreenOnAllowEscapeOn();
    // THEN: I should see YASR results in fullscreen mode, because it is configured to start in fullscreen.
    verifyYasrFullscreen();
    // AND: I should see the notification that describes how to exit fullscreen mode.
    ViewConfigurationsPageSteps.getOutputMessage().should('contain.text', '{"TYPE":"notificationMessage","payload":{"code":"yasr_exit_fullscreen","messageType":"info","message":"Press Esc to exit full screen"}}');


    // WHEN: I press the ESC key.
    YasguiSteps.pressEscape();
    // THEN: I should see YASR results in non-fullscreen mode, because escape is enabled.
    verifyYasrNonFullscreen();
  });

  it('should open YASR in non-fullscreen mode with escape enabled via configuration', () => {
    // WHEN: I open a page that contains "ontotext-yasgui-web-component" with YASR in non-fullscreen and escape allowed.
    ViewConfigurationsPageSteps.visit();
    YasqeSteps.executeQuery();
    ViewConfigurationsPageSteps.configureYasrFullscreenOffAllowEscapeOn();
    // THEN: I should see YASR results in non-fullscreen mode, because it is configured not to start in fullscreen.
    verifyYasrNonFullscreen();
    YasrSteps.getResultHeader().should('be.visible');

    // WHEN: I toggle fullscreen mode.
    YasrSteps.toggleFullscreen();
    // THEN: I should see YASR results in fullscreen mode.
    verifyYasrFullscreen();
    // AND: I should see the notification that describes how to exit fullscreen mode.
    ViewConfigurationsPageSteps.getOutputMessage().should('contain.text', '{"TYPE":"notificationMessage","payload":{"code":"yasr_exit_fullscreen","messageType":"info","message":"Press Esc to exit full screen"}}');

    // WHEN: I press the ESC key.
    YasguiSteps.pressEscape();
    // THEN: I should see YASR results in non-fullscreen mode, because escape is enabled.
    verifyYasrNonFullscreen();
  });

  it('should open YASR in fullscreen mode with escape disabled via configuration', () => {
    // WHEN: I open a page that contains "ontotext-yasgui-web-component" with YASR in fullscreen and escape disabled.
    ViewConfigurationsPageSteps.visit();
    YasqeSteps.executeQuery();
    ViewConfigurationsPageSteps.configureYasrFullscreenOnAllowEscapeOff();
    // THEN: I should see YASR results in fullscreen mode, because it is configured to start in fullscreen.
    verifyYasrFullscreen();
    // AND: I should not see the notification that describes how to exit fullscreen mode, because escape is disabled.
    ViewConfigurationsPageSteps.getOutputMessage().should('not.exist');

    // WHEN: I press the ESC key.
    YasguiSteps.pressEscape();
    // THEN: I should still see YASR in fullscreen mode, because escape is disabled.
    YasrSteps.getYasr().should('have.class', 'yasr-fullscreen');
  });
});

const verifyYasrFullscreen = () => {
  // Check the result table is rendered to be sure that the YASR is fully rendered.
  YasrSteps.getResultsTable().should('exist');
  // I should see YASR results in fullscreen.
  YasrSteps.getYasr().should('have.class', 'yasr-fullscreen');
  // I should see the result header.
  YasrSteps.getResultHeader().should('be.visible');
  YasrSteps.getFullscreenButton().should('attr', 'aria-label', 'Exit full screen');
}

const verifyYasrNonFullscreen = () => {
  YasrSteps.getYasr().should('not.have.class', 'yasr-fullscreen');
  YasrSteps.getFullscreenButton().should('attr', 'aria-label', 'Enter full screen');
}
