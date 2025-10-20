import {YasqeSteps} from "../../steps/yasqe-steps";
import {YasrSteps} from "../../steps/yasr-steps";
import {QueryStubDescription, QueryStubs} from "../../stubs/query-stubs";
import ActionsPageSteps from "../../steps/pages/actions-page-steps";
import {YasguiSteps} from "../../steps/yasgui-steps";
import {KeyboardShortcutSteps} from '../../steps/keyboard-shortcut-steps';
import {KeyboardShortcutPageSteps} from '../../steps/pages/keyboard-shortcut-page-steps';
import {DEFAULT_SPARQL_QUERY_FROM_LOG} from "../../stubs/constants";

describe('Execute query action', () => {
  beforeEach(() => {
    QueryStubs.stubQueryResults(new QueryStubDescription().setPageSize(10).setTotalElements(6));
  });

  it('Should be able to execute a query', () => {
    ActionsPageSteps.visit();
    YasqeSteps.getExecuteQueryButtonTooltip().should('have.attr', 'data-tooltip', 'Explore all options');
    YasqeSteps.getExecuteQueryButton().should('be.visible');
    YasqeSteps.executeQuery();
    YasrSteps.getTableResults().should('have.length', 6);
  });

  it('Should display a progress indicator during query execution', () => {
    QueryStubs.stubDefaultQueryResponse(2000);
    ActionsPageSteps.visit();
    YasqeSteps.executeQueryWithoutWaitResult();
    YasqeSteps.getTabWithProgressBar().should('exist');
  });

  it('Should be able to execute LLM explain all', () => {
    // Given I'm on the page
    ActionsPageSteps.visit();
    // When I click on the explain query button dropdown
    YasqeSteps.getExecuteQueryButtonTooltip().should('have.attr', 'data-tooltip', 'Explore all options');
    YasqeSteps.getRunSplitButton().should('be.visible');
    YasqeSteps.openRunSplitMenu();
    YasqeSteps.getRunDropdownMenu().should('have.class', 'open').and('be.visible');
    // Then I expect to see the LLM explain all option
    YasqeSteps.getRunDropdownMenuOption(1).should('have.text', 'LLM explain all');
    // When I select the LLM explain all option
    YasqeSteps.selectRunDropdownMenuOption(1);
    // Then I expect to see the results
    YasrSteps.getTableResults().should('have.length', 6);
    // And the query should NOT include the explain query/results comment
    YasqeSteps.getQuery().then((query) => {
      expect(query).to.not.include('# :gpt-query-only:');
      expect(query).to.not.include('# :gpt-result-only:');
    });
  });

  it('Should be able to execute LLM explain query', () => {
    // Given I'm on the page
    ActionsPageSteps.visit();
    // When I click on the explain query button dropdown
    YasqeSteps.openRunSplitMenu();
    YasqeSteps.getRunDropdownMenu().should('have.class', 'open').and('be.visible');
    // Then I expect to see the LLM explain query option
    YasqeSteps.getRunDropdownMenuOption(2).should('have.text', 'LLM explain query');
    // When I select the LLM explain query option
    YasqeSteps.selectRunDropdownMenuOption(2);
    // Then I expect to see the results
    YasrSteps.getTableResults().should('have.length', 6);
    // And the query should include the explain query comment
    YasqeSteps.getQuery().then((query) => {
      expect(query).to.include('# :gpt-query-only:');
    });
  });

  it('Should be able to execute LLM explain results', () => {
    // Given I'm on the page
    ActionsPageSteps.visit();
    // When I click on the explain query button dropdown
    YasqeSteps.openRunSplitMenu();
    YasqeSteps.getRunDropdownMenu().should('have.class', 'open').and('be.visible');
    // Then I expect to see the LLM explain results option
    YasqeSteps.getRunDropdownMenuOption(3).should('have.text', 'LLM explain results');
    // When I select the LLM explain results option
    YasqeSteps.selectRunDropdownMenuOption(3);
    // Then I expect to see the results
    YasrSteps.getTableResults().should('have.length', 6);
    // And the query should include the explain result comment
    YasqeSteps.getQuery().then((query) => {
      expect(query).to.include('# :gpt-result-only:');
    });
  });

  it('Should be able to execute Explain query plan', () => {
    // Given I'm on the page
    ActionsPageSteps.visit();
    // When I click on the explain query button dropdown
    YasqeSteps.openRunSplitMenu();
    YasqeSteps.getRunDropdownMenu().should('have.class', 'open').and('be.visible');
    // Then I expect to see the Explain query plan option
    YasqeSteps.getRunDropdownMenuOption(0).should('have.text', 'Explain query plan');
    // When I select the Explain query plan option
    YasqeSteps.selectRunDropdownMenuOption(0);
    // Then I expect to see the results
    YasrSteps.getTableResults().should('have.length', 6);
  });

  it('Should emit queryExecuted event on each editor tab', {
    retries: {
      runMode: 1,
      openMode: 0
    }
  }, () => {
    ActionsPageSteps.visit();
    YasqeSteps.executeQuery();
    ActionsPageSteps.getEventLog().should('have.value', DEFAULT_SPARQL_QUERY_FROM_LOG);
    YasguiSteps.openANewTab();
    ActionsPageSteps.clearEventLog();
    YasqeSteps.executeQuery(1);
    ActionsPageSteps.getEventLog().should('have.value', DEFAULT_SPARQL_QUERY_FROM_LOG);
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
    YasqeSteps.executeQueryWithoutWaitResult();

    // Then I expect the query don't run,
    YasrSteps.getResultsTable().should('not.exist');
    // and a notification message to be emitted.
    KeyboardShortcutPageSteps.getActionOutputField().should('have.value', '{"code":"explain_not_allowed","messageType":"warning","message":"Updates are not supported for Virtual repositories."}');
  });
});
