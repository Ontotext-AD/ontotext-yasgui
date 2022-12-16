import {YasguiSteps} from '../steps/yasgui-steps';
import {YasqeSteps} from '../steps/yasqe-steps';
import {YasrSteps} from '../steps/yasr-steps';
import {QueryStubs} from "../stubs/query-stubs";
import {HeaderPageSteps} from '../steps/header-page-steps';

describe('View modes', () => {
    beforeEach(() => {
        QueryStubs.stubDefaultQueryResponse();
    });

    it('Should headers with render mode button be visible', () => {
        // When I visit page with ontotext-yasgui
        HeaderPageSteps.visit();

        // I expect header with buttons to be visible If configuration "showHeader" is undefined
        cy.get('.ontotext-yasgui-header').should('be.visible');

        // When I create ontotext-yasgui with configuration "showHeader" set to false
        HeaderPageSteps.getHideHeaderButton().click();
        // Then I expect header to not be visible.
        cy.get('.ontotext-yasgui-header').should('not.be.visible');

        // When I create ontotext-yasgui with configuration "showHeader" set to true
        HeaderPageSteps.getShowHeaderButton().click();
        // Then I expect header to not be visible.
        cy.get('.ontotext-yasgui-header').should('be.visible');
    });

    it('Should render mode-yasgui by default', () => {
        HeaderPageSteps.visit();
        // YASQE should be visible
        YasqeSteps.getYasqe().should('be.visible');
        YasqeSteps.executeQuery();
        // YASR should be visible
        YasrSteps.getYasr().should('be.visible');
        // YASGUI tabs should be visible
        YasguiSteps.getTabs().should('have.length', 1);

        // check styling only yasgui button have to be selected
        HeaderPageSteps.getYasqeModeButton().should('not.have.class', 'btn-selected');
        HeaderPageSteps.getYasguiModeButton().should('have.class', 'btn-selected');
        HeaderPageSteps.getYasrModeButton().should('not.have.class', 'btn-selected');
        HeaderPageSteps.getOrientationButton().should('not.have.class', 'icon-rotate-90');
        HeaderPageSteps.getOrientationButton().should('have.class', 'red');
    });

    it('Should render mode-yasqe', () => {
        HeaderPageSteps.visit();
        // When I switch to mode-yasqe
        HeaderPageSteps.switchToModeYasqe();
        // Then Only yasqe should be visible
        YasqeSteps.getYasqe().should('be.visible');
        YasguiSteps.getTabs().should('have.length', 1);
        YasqeSteps.executeQuery();
        // And yasr should be hidden
        YasrSteps.getYasr().should('not.be.visible');

        // check styling only yasqe button have to be selected
        HeaderPageSteps.getYasqeModeButton().should('have.class', 'btn-selected');
        HeaderPageSteps.getYasguiModeButton().should('not.have.class', 'btn-selected');
        HeaderPageSteps.getYasrModeButton().should('not.have.class', 'btn-selected');
    });

    it('Should render mode-yasr', () => {
        HeaderPageSteps.visit();
        // When I switch to mode-yasr
        HeaderPageSteps.switchToModeYasr();
        // Then Only yasqe should not be visible
        YasqeSteps.getYasqe().should('not.be.visible');
        // And the yasqe tabs should not be visible
        YasguiSteps.getTabs().should('not.be.visible');
        // And yasr should be visible
        YasrSteps.getYasr().should('be.visible');

        // check styling only yasr button have to be selected
        HeaderPageSteps.getYasqeModeButton().should('not.have.class', 'btn-selected');
        HeaderPageSteps.getYasguiModeButton().should('not.have.class', 'btn-selected');
        HeaderPageSteps.getYasrModeButton().should('have.class', 'btn-selected');
    });

    it('Should change orientation to horizontal and vertical', () => {
        HeaderPageSteps.visit();
        // Orientation should be vertical by default
        HeaderPageSteps.getYasguiElement().should('have.class', 'orientation-vertical');
        // When The view mode is yasgui
        HeaderPageSteps.switchToModeYasgui();
        // And I switch orientation to horizontal
        HeaderPageSteps.toggleOrientation();
        // Then I expect yasqe and yasr to be placed side by side
        HeaderPageSteps.getYasguiElement().should('have.class', 'orientation-horizontal');
        // When I switch to vertical orientation
        HeaderPageSteps.toggleOrientation();
        // // Then I expect yasqe and yasr to be placed on top of each other
        HeaderPageSteps.getYasguiElement().should('have.class', 'orientation-vertical');
    });

    it('Should show tooltip when mouse enter into orientation button', () => {
        HeaderPageSteps.visit();
        // When I put mouse on button orientation.
        cy.get('.btn-orientation').trigger('mouseover');
        //Then I expect to see tooltip with value "Switch to horizontal view".
        cy.contains('Switch to horizontal view');

        // When I move mouse outside of button orientation.
        cy.get('.btn-orientation').trigger('mouseleave');
        // Then I expect tooltip to not exist.
        cy.contains('Switch to horizontal view').should("not.exist");
    });

    it('Should show tooltip when click on button orientation', () => {
        HeaderPageSteps.visit();
        // When I click on button orientation.
        cy.get('.btn-orientation').click();
        //Then I expect to see tooltip with value "Switch to vertical view".
        cy.contains('Switch to vertical view');

        // When I click on button orientation again.
        cy.get('.btn-orientation').click();
        //Then I expect to see tooltip with value "Switch to horizontal view".
        cy.contains('Switch to horizontal view');

        // When I move mouse outside of button orientation.
        cy.get('.btn-orientation').trigger('mouseleave');
        // Then I expect tooltip to not exist.
        cy.contains('Switch to horizontal view').should("not.exist");
    });
})
