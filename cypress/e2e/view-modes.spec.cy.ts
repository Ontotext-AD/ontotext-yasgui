import PageSteps from '../steps/page-steps';
import {YasguiSteps} from '../steps/yasgui-steps';
import {YasqeSteps} from '../steps/yasqe-steps';
import {YasrSteps} from '../steps/yasr-steps';

describe('View modes', () => {

    beforeEach(() => {
        cy.intercept('/repositories/test-repo', {fixture: '/queries/default-query-response.json'}).as('getGuides');
    });

    it('Should render mode-yasgui by default', () => {
        PageSteps.visitViewModesPage();
        // YASQE should be visible
        YasqeSteps.getYasqe().should('be.visible');
        YasqeSteps.executeQuery();
        // YASR should be visible
        YasrSteps.getYasr().should('be.visible');
        // YASGUI tabs should be visible
        YasguiSteps.getTabs().should('have.length', 1);
    });

    it('Should render mode-yasqe', () => {
        PageSteps.visitViewModesPage();
        // When I switch to mode-yasqe
        PageSteps.switchToModeYasqe();
        // Then Only yasqe should be visible
        YasqeSteps.getYasqe().should('be.visible');
        YasguiSteps.getTabs().should('have.length', 1);
        YasqeSteps.executeQuery();
        // And yasr should be hidden
        YasrSteps.getYasr().should('not.be.visible');
    });

    it('Should render mode-yasr', () => {
        PageSteps.visitViewModesPage();
        // When I switch to mode-yasr
        PageSteps.switchToModeYasr();
        // Then Only yasqe should not be visible
        YasqeSteps.getYasqe().should('not.be.visible');
        // And the yasqe tabs should not be visible
        YasguiSteps.getTabs().should('not.be.visible');
        // And yasr should be visible
        YasrSteps.getYasr().should('be.visible');
    });

    it('Should change orientation to horizontal and vertical', () => {
        PageSteps.visitViewModesPage();
        // Orientation should be vertical by default
        YasguiSteps.getYasguiTag().should('have.class', 'orientation-vertical');
        // When The view mode is yasgui
        PageSteps.switchToModeYasgui();
        // And I switch orientation to horizontal
        PageSteps.switchToHorizontalOrientation();
        // Then I expect yasqe and yasr to be placed side by side
        YasguiSteps.getYasguiTag().should('have.class', 'orientation-horizontal');
        // When I switch to vertical orientation
        PageSteps.switchToVerticalOrientation();
        // Then I expect yasqe and yasr to be placed on top of each other
        YasguiSteps.getYasguiTag().should('have.class', 'orientation-vertical');
    });
})
