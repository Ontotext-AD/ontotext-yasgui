import {AbortQueryPageSteps} from '../../steps/pages/abort-query-page-steps';
import {YasqeSteps} from '../../steps/yasqe-steps';

describe('YASQE fullscreen', () => {

  beforeEach(() => {
    AbortQueryPageSteps.visit();
  });

  it('should toggle the SPARQL editor fullscreen mode.', () => {
    // WHEN: I open a page with YASQE
    // THEN: I should see the fullscreen button in the editor
    YasqeSteps.getFullscreenButton().should('have.class', 'ri-fullscreen-line');
    // AND: YASQE should not be in fullscreen mode
    YasqeSteps.getYasqe().should('not.have.class', 'yasqe-fullscreen');

    // WHEN: I click the fullscreen button
    YasqeSteps.toggleFullscreen();
    // THEN: I should see the exit fullscreen button in the editor
    YasqeSteps.getFullscreenButton().should('have.class', 'ri-fullscreen-exit-line');
    // AND: YASQE should be in fullscreen mode
    YasqeSteps.getYasqe().should('have.class', 'yasqe-fullscreen');

    // WHEN: I click the exit fullscreen button
    YasqeSteps.toggleFullscreen();
    // THEN: I should see the fullscreen button in the editor
    YasqeSteps.getFullscreenButton().should('have.class', 'ri-fullscreen-line');
    // AND: YASQE should not be in fullscreen mode
    YasqeSteps.getYasqe().should('not.have.class', 'yasqe-fullscreen');
  });

  it('should display the correct fullscreen button when YASQE fullscreen mode is toggled using keyboard shortcuts', () => {
    // WHEN: I open a page with YASQE
    // AND: I press the fullscreen keyboard shortcut
    YasqeSteps.getYasqe().type('{ctrl}{alt}f');
    // THEN: I should see the exit fullscreen button in the editor
    YasqeSteps.getFullscreenButton().should('have.class', 'ri-fullscreen-exit-line');
    // AND: YASQE should be in fullscreen mode
    YasqeSteps.getYasqe().should('have.class', 'yasqe-fullscreen');

    // WHEN: I press the Escape key
    YasqeSteps.getYasqe().type('{esc}');
    // THEN: I should see the fullscreen button in the editor
    YasqeSteps.getFullscreenButton().should('have.class', 'ri-fullscreen-line');
    // AND: YASQE should not be in fullscreen mode
    YasqeSteps.getYasqe().should('not.have.class', 'yasqe-fullscreen');
  });
});
