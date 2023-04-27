import {YasqeSteps} from "../../steps/yasqe-steps";
import {YasrSteps} from "../../steps/yasr-steps";
import {QueryStubDescription, QueryStubs} from "../../stubs/query-stubs";
import ActionsPageSteps from "../../steps/pages/actions-page-steps";
import {YasguiSteps} from "../../steps/yasgui-steps";
import {KeyboardShortcutSteps} from '../../steps/keyboard-shortcut-steps';
import {KeyboardShortcutPageSteps} from '../../steps/pages/keyboard-shortcut-page-steps';

describe('Execute query action', () => {
  beforeEach(() => {
    QueryStubs.stubQueryResults(new QueryStubDescription().setPageSize(10).setTotalElements(6));
  });

  it('Should be able to execute a query', () => {
    ActionsPageSteps.visit();
    YasqeSteps.getExecuteQueryButtonTooltip().should('have.attr', 'data-tooltip', 'Run query');
    YasqeSteps.getExecuteQueryButton().should('be.visible');
    YasqeSteps.executeQuery();
    YasrSteps.getTableResults().should('have.length', 6);
  });

  it('Should display a progress indicator during query execution', () => {
    QueryStubs.stubDefaultQueryResponse(2000);
    ActionsPageSteps.visit();
    YasqeSteps.executeQueryWithoutWaiteResult();
    YasqeSteps.getTabWithProgressBar().should('exist');
  });

  it('Should emit queryExecuted event on each editor tab', {
    retries: {
      runMode: 1,
      openMode: 0
    }
  }, () => {
    ActionsPageSteps.visit();
    YasqeSteps.executeQuery();
    ActionsPageSteps.getEventLog().should('have.value', '\n"select * where {  \\n ?s ?p ?o . \\n } limit 100"');
    YasguiSteps.openANewTab();
    ActionsPageSteps.clearEventLog();
    YasqeSteps.executeQuery(1);
    ActionsPageSteps.getEventLog().should('have.value', '\n"select * where {  \\n ?s ?p ?o . \\n } limit 100"');
  });

  it('should not run explain plan query for update query ', {
    retries: {
      runMode: 1,
      openMode: 0
    }
  }, () => {
    // When I visit a page with "ontotext-yasgui-web-component" in it,
    KeyboardShortcutPageSteps.visit();
    // and write an update query,
    YasqeSteps.clearEditor();
    YasqeSteps.writeInEditor("INSERT DATA { ontogen:name rdf:label \"Test name\"");
    // and execute explain plan query.
    KeyboardShortcutSteps.clickOnExplainPlanQueryShortcut();

    // Then I expect the query don't run,
    YasrSteps.getResultsTable().should('not.exist');
    // and a notification message to be emitted.
    KeyboardShortcutPageSteps.getActionOutputField().should('have.value', '{"code":"explain_not_allowed","messageType":"warning","message":"Explain only works with SELECT, CONSTRUCT or DESCRIBE queries."}');
  });

  it('should not run explain plan query when repository is virtual.', () => {
    // When I visit a page with "ontotext-yasgui-web-component" in it,
    KeyboardShortcutPageSteps.visit();
    // and repository is virtual
    KeyboardShortcutPageSteps.setVirtualRepository();
    // and execute explain plan query.
    KeyboardShortcutSteps.clickOnExplainPlanQueryShortcut();

    // Then I expect the query don't run,
    YasrSteps.getResultsTable().should('not.exist');
    // and a notification message to be emitted.
    KeyboardShortcutPageSteps.getActionOutputField().should('have.value', '{"code":"explain_not_allowed","messageType":"warning","message":"Explain not supported for Virtual repositories."}');
  });

  it('should not run update query when repository is virtual.', () => {
    // When I visit a page with "ontotext-yasgui-web-component" in it,
    KeyboardShortcutPageSteps.visit();
    KeyboardShortcutPageSteps.setVirtualRepository();
    YasqeSteps.clearEditor();
    YasqeSteps.writeInEditor("INSERT DATA { ontogen:name rdf:label \"Test name\"");
    YasqeSteps.executeQueryWithoutWaiteResult();

    // Then I expect the query don't run,
    YasrSteps.getResultsTable().should('not.exist');
    // and a notification message to be emitted.
    KeyboardShortcutPageSteps.getActionOutputField().should('have.value', '{"code":"explain_not_allowed","messageType":"warning","message":"Updates are not supported for Virtual repositories."}');
  });
});
