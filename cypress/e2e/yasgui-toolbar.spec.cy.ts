import {YasguiSteps} from '../steps/yasgui-steps';
import {YasqeSteps} from '../steps/yasqe-steps';
import {YasrSteps} from '../steps/yasr-steps';
import {QueryStubs} from "../stubs/query-stubs";
import {ToolbarPageSteps} from '../steps/toolbar-page-steps';
import DefaultViewPageSteps from "../steps/default-view-page-steps";

describe('Yasgui Toolbar', () => {
    beforeEach(() => {
        QueryStubs.stubDefaultQueryResponse();
    });

    describe('By default', () => {
        it('Should be hidden', () => {
            // Given I haven configured the toolbar visibility
            // When I open a page with the yasgui
            DefaultViewPageSteps.visit();
            // Then I expect that the toolbar should be hidden
            // TODO: Seems like the toolbar is initially visible and cypress sees that before the app to have the chance to hide it!!!
            // Find a way to remove this wait here.
            cy.wait(1000);
            ToolbarPageSteps.getToolbar().should('be.hidden');
        });

        it('Should render mode-yasgui', () => {
            // When I visit a page with ontotext-yasgui
            ToolbarPageSteps.visit();
            // Then YASQE should be visible
            YasqeSteps.getYasqe().should('be.visible');
            // When I execute a query.
            YasqeSteps.executeQuery();
            // Then YASR should be visible
            YasrSteps.getYasr().should('be.visible');
            // And YASGUI tabs should be visible
            YasguiSteps.getTabs().should('have.length', 1);
            // And only yasgui button have to be selected
            ToolbarPageSteps.isYasqeModeDeselected();
            ToolbarPageSteps.isYasguiModeSelected();
            ToolbarPageSteps.isYasrModeDeselected();
            ToolbarPageSteps.isVerticalOrientation();
            ToolbarPageSteps.getOrientationButton().should('have.class', 'red');
        });
    });

    it('Should be able to configure the toolbar visibility', () => {
        // When I visit a page with ontotext-yasgui
        ToolbarPageSteps.visit();
        // I expect toolbar with buttons to be visible If configuration "showToolbar" is undefined
        ToolbarPageSteps.getToolbar().should('be.visible');
        // When I create ontotext-yasgui with configuration "showToolbar" set to false
        ToolbarPageSteps.hideToolbar();
        // Then I expect toolbar to not be visible.
        ToolbarPageSteps.getToolbar().should('not.be.visible');
        // When I create ontotext-yasgui with configuration "showToolbar" set to true
        ToolbarPageSteps.showToolbar();
        // Then I expect toolbar to not be visible.
        ToolbarPageSteps.getToolbar().should('be.visible');
    });

    it('Should render mode-yasqe', () => {
        ToolbarPageSteps.visit();
        // When I switch to mode-yasqe
        ToolbarPageSteps.switchToModeYasqe();
        // Then yasqe should be visible
        YasqeSteps.getYasqe().should('be.visible');
        YasguiSteps.getTabs().should('have.length', 1);
        // And yasr should be not visible
        YasrSteps.getYasr().should('not.be.visible');
        // And only yasqe button have to be selected
        ToolbarPageSteps.isYasqeModeSelected();
        ToolbarPageSteps.isYasguiModeDeselected();
        ToolbarPageSteps.isYasrModeDeselected();
    });

    it('Should render mode-yasr', () => {
        ToolbarPageSteps.visit();
        // When I switch to mode-yasr
        ToolbarPageSteps.switchToModeYasr();
        // And only yasr should be visible
        YasqeSteps.getYasqe().should('not.be.visible');
        YasguiSteps.getTabs().should('not.be.visible');
        YasrSteps.getYasr().should('be.visible');
        // And only yasr button have to be selected
        ToolbarPageSteps.isYasqeModeDeselected();
        ToolbarPageSteps.isYasguiModeDeselected();
        ToolbarPageSteps.isYasrModeSelected();
    });

    it('Should change orientation to horizontal and vertical', () => {
        // When I visit a page with ontotext-yasgui
        ToolbarPageSteps.visit();
        // Then Orientation should be vertical by default
        YasguiSteps.isVerticalOrientation();
        // When I switch orientation to horizontal
        ToolbarPageSteps.toggleOrientation();
        // Then I expect yasqe and yasr to be placed side by side
        YasguiSteps.isHorizontalOrientation();
        // When I switch to vertical orientation
        ToolbarPageSteps.toggleOrientation();
        // Then I expect yasqe and yasr to be placed on top of each other
        YasguiSteps.isVerticalOrientation();
    });

    it('Should show tooltip when mouse enter into orientation button', () => {
        ToolbarPageSteps.visit();
        // When The mouse is over button orientation.
        ToolbarPageSteps.showLayoutOrientationButtonTooltip();
        //Then I expect to see tooltip with value "Switch to horizontal view".
        cy.contains('Switch to horizontal view');
        // When The mouse leave button orientation.
        ToolbarPageSteps.hideLayoutOrientationButtonTooltip();
        // Then I expect tooltip to not exist.
        cy.contains('Switch to horizontal view').should('not.exist');
    });

    it('Should show tooltip when click on button orientation', () => {
        ToolbarPageSteps.visit();
        // When I click on button orientation.
        ToolbarPageSteps.toggleOrientation();
        //Then I expect to see tooltip with value "Switch to vertical view".
        cy.contains('Switch to vertical view');
        // When I click on button orientation again.
        ToolbarPageSteps.toggleOrientation();
        //Then I expect to see tooltip with value "Switch to horizontal view".
        cy.contains('Switch to horizontal view');
        // When I move mouse outside of button orientation.
        ToolbarPageSteps.hideLayoutOrientationButtonTooltip();
        // Then I expect tooltip to not exist.
        cy.contains('Switch to horizontal view').should('not.exist');
    });
})
