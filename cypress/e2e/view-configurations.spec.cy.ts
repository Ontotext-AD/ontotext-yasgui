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

  describe('View mode', () => {

    it('Should render all tabs by default', () => {
      // GIVEN: "view-configurations" page is visited.
      // When I haven't executed any query.
      YasrSteps.getResultHeader().should('be.hidden');
      // When I execute a query.
      YasqeSteps.executeQuery();
      // THEN: all components of yasgui, yasr, yasqe have to be visible.
      YasqeSteps.getQueryTabs().should('be.visible');
      YasrSteps.getResultHeader().should('be.visible');
    });

    it('Should hide query tabs', () => {
      // GIVEN: "view-configurations" page is visited.
      YasqeSteps.executeQuery();
      // WHEN: set configuration property "showEditorTabs" to false.
      ViewConfigurationsPageSteps.hideEditorTabs();

      // THEN: only query tabs have to be invisible.
      YasqeSteps.getQueryTabs().should('not.be.visible');
      YasrSteps.getResultHeader().should('be.visible');

      // WHEN: set configuration property "showEditorTabs" to true.
      ViewConfigurationsPageSteps.showEditorTabs();

      // THEN: all components of yasgui, yasr, yasqe have to be visible.
      YasqeSteps.getQueryTabs().should('be.visible');
      YasrSteps.getResultHeader().should('be.visible');
    });

    it('Should hide result tabs', () => {
      // GIVEN: "view-configurations" page is visited.

      // WHEN: set configuration property "showResultTabs" to false.
      ViewConfigurationsPageSteps.hideResultTabs();

      // THEN: results tab have to not be visible.
      YasqeSteps.getQueryTabs().should('be.visible');
      YasrSteps.getExtendedTableTab().should('not.be.visible');
      YasrSteps.getResponseTableTab().should('not.be.visible');

      // WHEN: set configuration property "showResultTabs" to true.
      ViewConfigurationsPageSteps.showResultTabs();
      YasqeSteps.executeQuery();
      // THEN: all components of yasgui, yasr, yasqe have to be visible.
      YasqeSteps.getQueryTabs().should('be.visible');
      YasrSteps.getResultHeader().should('be.visible');
    });
  });

  describe('Query configurations', () => {

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

  describe('Control bar', () => {

    it('Should control bar not be visible with default configuration', () => {
      // WHEN: "view-configurations" page is visited.

      // THEN: an event "queryExecuted" have to be fired
      // AND: a new element in dom have to be added.
      YasqeSteps.getControlBar().should('not.be.visible');
    });

    it('Should control bar be visible', () => {
      // When I configure control panel to be visible.
      ViewConfigurationsPageSteps.showControlBar();

      // Then I expected control panel to not be visible.
      YasqeSteps.getControlBar().should('be.visible');

    });

    it('Should control bar not be visible', () => {
      // When I configure control panel to be visible.
      ViewConfigurationsPageSteps.showControlBar();

      // And I change configuration of control panel to not be visible.
      ViewConfigurationsPageSteps.hideControlBar();

      // Then I expected control panel to be visible.
      YasqeSteps.getControlBar().should('not.be.visible');
    });

    it("Should control bar not be visible when is turned of and new tab is opened", () => {
      // When control bar is hidden
      ViewConfigurationsPageSteps.hideControlBar();

      // And I open a new query tab
      YasguiSteps.openANewTab();

      // Then I expect control bar to be not visible in the new tab
      YasqeSteps.getControlBar().should('not.be.visible');
    });

    it("Should control bar not be visible when is turned of and new tab is opened", () => {
      // When control bar is configured to be enabled.
      ViewConfigurationsPageSteps.showControlBar();

      // And I open a new query tab
      YasguiSteps.openANewTab();

      // Then I expect control bar to be visible in the new tab
      YasqeSteps.getControlBar().should('be.visible');
    });
  });
});
