import {YasqeSteps} from "../../steps/yasqe-steps";
import {QueryStubDescription, QueryStubs} from "../../stubs/query-stubs";
import ActionsPageSteps from "../../steps/pages/actions-page-steps";

describe('Include inferred action', () => {
  beforeEach(() => {
    QueryStubs.stubDefaultQueryResponse();
    // Given I have opened a page with the yasgui
    // And there is an open tab with sparql query in it
    ActionsPageSteps.visit();
  });

  it('Should be able to toggle the include inferred button state', () => {
    // When I open the editor
    // Then I expect that include inferred statements should be enabled by default
    YasqeSteps.getActionButtonTooltip(3).should('have.attr', 'data-tooltip', 'Include inferred data in results: ON');
    YasqeSteps.getActionButton(3).should('have.class', 'icon-inferred-on');
    // When I click in the include inferred action
    YasqeSteps.includeInferredStatements();
    // Then I expect it to be disabled
    YasqeSteps.getActionButtonTooltip(3).should('have.attr', 'data-tooltip', 'Include inferred data in results: OFF');
    YasqeSteps.getActionButton(3).should('have.class', 'icon-inferred-off');
  });

  it('Should be able to configure the default value of the infer config', () => {
    // When I open the editor
    // Then I expect that include inferred statements should be enabled by default
    YasqeSteps.getActionButtonTooltip(3).should('have.attr', 'data-tooltip', 'Include inferred data in results: ON');
    YasqeSteps.getActionButton(3).should('have.class', 'icon-inferred-on');
    // When I change the default inferred config
    YasqeSteps.toggleIncludeInferred();
    // Then I expect that the include inferred value would be changed
    YasqeSteps.getActionButtonTooltip(3).should('have.attr', 'data-tooltip', 'Include inferred data in results: OFF');
    YasqeSteps.getActionButton(3).should('have.class', 'icon-inferred-off');
  });

  it('Should toggle infer request parameter in requests', () => {
    QueryStubs.stubQueryResults(new QueryStubDescription().setPageSize(10).setTotalElements(16));
    // Given I have executing the query without changing configs
    YasqeSteps.executeQuery();
    // Then I expect that infer=true will be sent with the request
    cy.wait('@query-1_0_11_11').its('request.body').should('contain', 'infer=true');
    // When I disable include inferred statements
    YasqeSteps.includeInferredStatements();
    YasqeSteps.executeQuery();
    // Then I expect that infer=false will be sent with the request
    cy.wait('@query-1_0_11_11').its('request.body').should('contain', 'infer=false');
  });
});
