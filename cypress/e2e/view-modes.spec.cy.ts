import {YasguiSteps} from '../steps/yasgui-steps';
import {YasqeSteps} from '../steps/yasqe-steps';
import {YasrSteps} from '../steps/yasr-steps';
import {ViewModePageSteps} from "../steps/view-mode-page-steps";
import {QueryStubs} from "../stubs/query-stubs";

describe('View modes', () => {
    beforeEach(() => {
        QueryStubs.stubDefaultQueryResponse();
    });

    it('Should render mode-yasgui by default', () => {
        ViewModePageSteps.visit();
        // YASQE should be visible
        YasqeSteps.getYasqe().should('be.visible');
        YasqeSteps.executeQuery();
        // YASR should be visible
        YasrSteps.getYasr().should('be.visible');
        // YASGUI tabs should be visible
        YasguiSteps.getTabs().should('have.length', 1);
    });

    it('Should render mode-yasqe', () => {
        ViewModePageSteps.visit();
        // When I switch to mode-yasqe
        ViewModePageSteps.switchToModeYasqe();
        // Then Only yasqe should be visible
        YasqeSteps.getYasqe().should('be.visible');
        YasguiSteps.getTabs().should('have.length', 1);
        YasqeSteps.executeQuery();
        // And yasr should be hidden
        YasrSteps.getYasr().should('not.be.visible');
    });

    it('Should render mode-yasr', () => {
        ViewModePageSteps.visit();
        // When I switch to mode-yasr
        ViewModePageSteps.switchToModeYasr();
        // Then Only yasqe should not be visible
        YasqeSteps.getYasqe().should('not.be.visible');
        // And the yasqe tabs should not be visible
        YasguiSteps.getTabs().should('not.be.visible');
        // And yasr should be visible
        YasrSteps.getYasr().should('be.visible');
    });

    it('Should change orientation to horizontal and vertical', () => {
        ViewModePageSteps.visit();
        // Orientation should be vertical by default
        YasguiSteps.getYasguiTag().should('have.class', 'orientation-vertical');
        // When The view mode is yasgui
        ViewModePageSteps.switchToModeYasgui();
        // And I switch orientation to horizontal
        ViewModePageSteps.switchToHorizontalOrientation();
        // Then I expect yasqe and yasr to be placed side by side
        YasguiSteps.getYasguiTag().should('have.class', 'orientation-horizontal');
        // When I switch to vertical orientation
        ViewModePageSteps.switchToVerticalOrientation();
        // Then I expect yasqe and yasr to be placed on top of each other
        YasguiSteps.getYasguiTag().should('have.class', 'orientation-vertical');
    });
})
