import {YasqeSteps} from "../../steps/yasqe-steps";
import {QueryStubs} from "../../stubs/query-stubs";
import ActionsPageSteps from "../../steps/actions-page-steps";

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
    YasqeSteps.getActionButton(3).should('have.attr', 'title', 'Include inferred data in results: ON');
    YasqeSteps.getActionButton(3).should('have.class', 'icon-inferred-on');
    // When I click in the include inferred action
    YasqeSteps.includeInferredStatements();
    // Then I expect it to be disabled
    YasqeSteps.getActionButton(3).should('have.attr', 'title', 'Include inferred data in results: OFF');
    YasqeSteps.getActionButton(3).should('have.class', 'icon-inferred-off');
  });

  it('Should be able to configure the default value of the infer config', () => {
    // When I open the editor
    // Then I expect that include inferred statements should be enabled by default
    YasqeSteps.getActionButton(3).should('have.attr', 'title', 'Include inferred data in results: ON');
    YasqeSteps.getActionButton(3).should('have.class', 'icon-inferred-on');
    // When I change the default inferred config
    ActionsPageSteps.toggleIncludeInferred();
    // Then I expect that the include inferred value would be changed
    YasqeSteps.getActionButton(3).should('have.attr', 'title', 'Include inferred data in results: OFF');
    YasqeSteps.getActionButton(3).should('have.class', 'icon-inferred-off');
  });

  it('Should toggle infer request parameter in requests', () => {
    // Given I have executing the query without changing configs
    YasqeSteps.executeQuery();
    // Then I expect that infer=true will be sent with the request
    cy.wait('@getDefaultQueryResponse').its('request.body').should('contain', 'infer=true&sameAs=true');
    // When I disable include inferred statements
    YasqeSteps.includeInferredStatements();
    YasqeSteps.executeQuery();
    // Then I expect that infer=false will be sent with the request
    cy.wait('@getDefaultQueryResponse').its('request.body').should('contain', 'infer=false&sameAs=true');
  });
});
