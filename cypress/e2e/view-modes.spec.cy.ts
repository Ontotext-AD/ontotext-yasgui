import {YasguiSteps} from '../steps/yasgui-steps';
import {YasqeSteps} from '../steps/yasqe-steps';
import {YasrSteps} from '../steps/yasr-steps';
import {ViewModePageSteps} from "../steps/view-mode-page-steps";
import {QueryStubs} from "../stubs/query-stubs";
import {ToolbarPageSteps} from "../steps/toolbar-page-steps";

describe('View modes', () => {
    beforeEach(() => {
        QueryStubs.stubDefaultQueryResponse();
        // Given I have opened the page
        ViewModePageSteps.visit();
    });

    it('Should render mode-yasgui by default', () => {
        // When I have no external config
        // Then I expect yasqe to be visible
        YasqeSteps.getYasqe().should('be.visible');
        YasqeSteps.executeQuery();
        // And I expect yasr to be visible
        YasrSteps.getYasr().should('be.visible');
        // And I expect yasgui tabs to be visible
        YasguiSteps.getTabs().should('have.length', 1);
        // And I expect that render yasgui in the toolbar to be selected
        ToolbarPageSteps.showToolbar();
        ToolbarPageSteps.isYasguiModeSelected();
    });

    it('Should render mode-yasqe', () => {
        // When I configure mode-yasqe
        ViewModePageSteps.switchToModeYasqe();
        // Then Only yasqe should be visible
        YasqeSteps.getYasqe().should('be.visible');
        YasguiSteps.getTabs().should('have.length', 1);
        YasqeSteps.executeQuery();
        // And yasr should be hidden
        YasrSteps.getYasr().should('not.be.visible');
        // And I expect that render yasqe in the toolbar to be selected
        ToolbarPageSteps.showToolbar();
        ToolbarPageSteps.isYasqeModeSelected();
    });

    it('Should render mode-yasr', () => {
        // When I configure mode-yasr
        ViewModePageSteps.switchToModeYasr();
        // Then yasr should be visible
        YasrSteps.getYasr().should('be.visible');
        // And yasqe should not be visible
        YasqeSteps.getYasqe().should('not.be.visible');
        // And the yasqe tabs should not be visible
        YasguiSteps.getTabs().should('not.be.visible');
        // And I expect that render yasr in the toolbar to be selected
        ToolbarPageSteps.showToolbar();
        ToolbarPageSteps.isYasrModeSelected();
    });

    it('Should change orientation to horizontal and vertical', () => {
        // When I don't have orientation configuration
        // Then orientation should be vertical by default
        YasguiSteps.isVerticalOrientation();
        // And the toolbar orientation button should be set to vertical
        ViewModePageSteps.showToolbar();
        ToolbarPageSteps.isVerticalOrientation();
        // When The view mode is yasgui
        ViewModePageSteps.switchToModeYasgui();
        // And I switch orientation to horizontal
        ViewModePageSteps.switchToHorizontalOrientation();
        // Then I expect yasqe and yasr to be placed side by side
        YasguiSteps.isHorizontalOrientation();
        // And the toolbar orientation button should be set to horizontal
        ToolbarPageSteps.isHorizontalOrientation();
        // When I switch to vertical orientation
        ViewModePageSteps.switchToVerticalOrientation();
        // Then I expect yasqe and yasr to be placed on top of each other
        YasguiSteps.isVerticalOrientation();
        // And the toolbar orientation button should be set to horizontal
        ToolbarPageSteps.isVerticalOrientation();
    });
})
