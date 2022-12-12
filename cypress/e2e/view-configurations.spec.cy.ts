import PageSteps from '../steps/page-steps';
import {YasguiSteps} from '../steps/yasgui-steps';
import {YasqeSteps} from '../steps/yasqe-steps';

describe('View configurations', () => {

   beforeEach(() => {
      cy.intercept('/repositories/test-repo', {fixture: '/queries/default-query-response.json'}).as('getGuides');
      PageSteps.visitConfigurationPage();
      cy.clearLocalStorage('yasgui_config');
      cy.clearLocalStorage('prefixes');
   });

   it('Should render all tabs by default', () => {
      // GIVEN: "view-configurations" page is visited.

      // THEN: all components of yasgui, yasr, yasqe have to be visible.
      cy.get('.tabsList').should('be.visible');
      cy.get('.yasr_header').should('be.visible');
   });

   it('Should hide query tabs', () => {
      // GIVEN: "view-configurations" page is visited.

      // WHEN: set configuration property "showEditorTabs" to false.
      PageSteps.hideEditorTab();

      // THEN: only query tabs have to be invisible.
      cy.get('.tabsList').should('not.be.visible');
      cy.get('.yasr_header').should('be.visible');

      // WHEN: set configuration property "showEditorTabs" to true.
      PageSteps.showEditorTab();

      // THEN: all components of yasgui, yasr, yasqe have to be visible.
      cy.get('.tabsList').should('be.visible');
      cy.get('.yasr_header').should('be.visible');
   });

   it('Should hide result tabs', () => {
      // GIVEN: "view-configurations" page is visited.

      // WHEN: set configuration property "showResultTabs" to false.
      PageSteps.hideResultTabs();

      // THEN: only result tabs have to be invisible.
      cy.get('.tabsList').should('be.visible');
      cy.get('.yasr_header').should('not.be.visible');

      // WHEN: set configuration property "showResultTabs" to true.
      PageSteps.showResultTabs();

      // THEN: all components of yasgui, yasr, yasqe have to be visible.
      cy.get('.tabsList').should('be.visible');
      cy.get('.yasr_header').should('be.visible');
   });

   it('Should set query passed through "initialQuery" configuration', () => {
      // GIVEN: "view-configurations" page is visited.

      // WHEN: set 'initial_query' value to configuration "initialQuery"
      PageSteps.setInitialQuery();

      // THEN: 'initial_query' have to be set in the query editor.
      cy.get(".yasqe").contains('initial_query');
   });

   it('Should set default query', () => {
      // GIVEN: "view-configurations" page is visited.

      // WHEN: set 'default_query' value to configuration "query".
      PageSteps.setDefaultQuery();
      // AND: open a new tab.
      YasguiSteps.openANewTab();

      // THEN: 'default_query' have to be set in the query editor.
      cy.get(".yasqe:visible").contains('default_query');
   });

   it('Should fire event when query is executed', () => {
      // GIVEN: "view-configurations" page is visited.

      // WHEN: execute an query
      YasqeSteps.executeQuery();

      // THEN: an event "queryExecuted" have to be fired
      // AND: a new element in dom have to be added.
      cy.get('#queryRan').should('be.visible');
   });
});