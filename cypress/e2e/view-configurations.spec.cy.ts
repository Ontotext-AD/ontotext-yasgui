import {YasguiSteps} from '../steps/yasgui-steps';
import {YasqeSteps} from '../steps/yasqe-steps';
import {YasrSteps} from '../steps/yasr-steps';
import ViewConfigurationsPageSteps from "../steps/view-configurations-page-steps";
import {QueryStubs} from "../stubs/query-stubs";

describe('View configurations', () => {

   beforeEach(() => {
      QueryStubs.stubDefaultQueryResponse();
      ViewConfigurationsPageSteps.visit();
      cy.clearLocalStorage('yasgui_config');
      cy.clearLocalStorage('prefixes');
   });

   it('Should render all tabs by default', () => {
      // GIVEN: "view-configurations" page is visited.

      // THEN: all components of yasgui, yasr, yasqe have to be visible.
      YasqeSteps.getQueryTabs().should('be.visible');
      YasrSteps.getResultHeader().should('be.visible');
   });

   it('Should hide query tabs', () => {
      // GIVEN: "view-configurations" page is visited.

      // WHEN: set configuration property "showEditorTabs" to false.
      ViewConfigurationsPageSteps.hideEditorTab();

      // THEN: only query tabs have to be invisible.
      YasqeSteps.getQueryTabs().should('not.be.visible');
      YasrSteps.getResultHeader().should('be.visible');

      // WHEN: set configuration property "showEditorTabs" to true.
      ViewConfigurationsPageSteps.showEditorTab();

      // THEN: all components of yasgui, yasr, yasqe have to be visible.
      YasqeSteps.getQueryTabs().should('be.visible');
      YasrSteps.getResultHeader().should('be.visible');
   });

   it('Should hide result tabs', () => {
      // GIVEN: "view-configurations" page is visited.

      // WHEN: set configuration property "showResultTabs" to false.
      ViewConfigurationsPageSteps.hideResultTabs();

      // THEN: only result tabs have to be invisible.
      YasqeSteps.getQueryTabs().should('be.visible');
      YasrSteps.getResultHeader().should('not.be.visible');

      // WHEN: set configuration property "showResultTabs" to true.
      ViewConfigurationsPageSteps.showResultTabs();

      // THEN: all components of yasgui, yasr, yasqe have to be visible.
      YasqeSteps.getQueryTabs().should('be.visible');
      YasrSteps.getResultHeader().should('be.visible');
   });

   it('Should set query passed through "initialQuery" configuration', () => {
      // GIVEN: "view-configurations" page is visited.

      // WHEN: set 'initial_query' value to configuration "initialQuery"
      ViewConfigurationsPageSteps.setInitialQuery();

      // THEN: 'initial_query' have to be set in the query editor.
      YasqeSteps.getEditor().contains('initial_query');
   });

   it('Should set default query', () => {
      // GIVEN: "view-configurations" page is visited.

      // WHEN: set 'default_query' value to configuration "query".
      ViewConfigurationsPageSteps.setDefaultQuery();
      // AND: open a new tab.
      YasguiSteps.openANewTab();

      // THEN: 'default_query' have to be set in the query editor.
      YasqeSteps.getEditor().contains('default_query');
   });

   it('Should fire event when query is executed', () => {
      // GIVEN: "view-configurations" page is visited.

      // WHEN: execute an query
      YasqeSteps.executeQuery();

      // THEN: an event "queryExecuted" have to be fired
      // AND: a new element in dom have to be added.
      ViewConfigurationsPageSteps.getQueryRanInfo().should('be.visible');
   });
});
