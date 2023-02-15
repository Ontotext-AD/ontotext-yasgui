import {YasqeSteps} from "../../steps/yasqe-steps";
import {QueryStubs} from "../../stubs/query-stubs";
import ActionsPageSteps from "../../steps/actions-page-steps";

describe('Expand results over sameAs', () => {
  beforeEach(() => {
    QueryStubs.stubDefaultQueryResponse();
    // Given I have opened a page with the yasgui
    // And there is an open tab with sparql query in it
    ActionsPageSteps.visit();
  });

  it('Should be able to toggle the include inferred button state', () => {
    // When I open the editor
    // Then I expect that expand results should be enabled by default
    YasqeSteps.getExpandResultsOverSameAsButtonTooltip().should('have.attr', 'data-tooltip', 'Expand results over owl:sameAs: ON');
    YasqeSteps.getExpandResultsOverSameAsButton().should('have.class', 'icon-same-as-on');
    // When I click the expand results action
    YasqeSteps.expandResultsOverSameAs();
    // Then I expect it to be disabled
    YasqeSteps.getExpandResultsOverSameAsButtonTooltip().should('have.attr', 'data-tooltip', 'Expand results over owl:sameAs: OFF');
    YasqeSteps.getExpandResultsOverSameAsButton().should('have.class', 'icon-same-as-off');
  });

  it('Should be able to configure the default value of the expand results config', () => {
    // When I open the editor
    // Then I expect that expand results should be enabled by default
    YasqeSteps.getExpandResultsOverSameAsButtonTooltip().should('have.attr', 'data-tooltip', 'Expand results over owl:sameAs: ON');
    YasqeSteps.getExpandResultsOverSameAsButton().should('have.class', 'icon-same-as-on');
    // When I change the default of the expand results config
    YasqeSteps.toggleExpandResults();
    // Then I expect that the expand results value would be changed
    YasqeSteps.getExpandResultsOverSameAsButtonTooltip().should('have.attr', 'data-tooltip', 'Expand results over owl:sameAs: OFF');
    YasqeSteps.getExpandResultsOverSameAsButton().should('have.class', 'icon-same-as-off');
  });

  it('Should toggle sameAs parameter in requests', () => {
    // Given I have executed the query without changing configs
    YasqeSteps.executeQuery();
    // Then I expect that sameAs=true will be sent with the request
    cy.wait('@getDefaultQueryResponse').its('request.body').should('contain', 'sameAs=true');
    // When I disable expand results statements
    YasqeSteps.expandResultsOverSameAs();
    YasqeSteps.executeQuery();
    // Then I expect that sameAs=false will be sent with the request
    cy.wait('@getDefaultQueryResponse').its('request.body').should('contain', 'sameAs=false');
  });

  it('Should toggle sameAs parameter when include inferred is changed', () => {
    // Given I have executed the query without changing configs
    YasqeSteps.executeQuery();
    // Then I expect that sameAs=true and inferred=true will be sent with the request
    cy.wait('@getDefaultQueryResponse').its('request.body').should('contain', 'infer=true&sameAs=true');
    // When I disable include inferred statements
    YasqeSteps.includeInferredStatements();
    YasqeSteps.executeQuery();
    // Then I expect that sameAs=false and inferred=false will be sent with the request
    cy.wait('@getDefaultQueryResponse').its('request.body').should('contain', 'infer=false&sameAs=false');
    // And expand results action should be disabled when inferred is disabled
    YasqeSteps.getExpandResultsOverSameAsButton().should('have.class', 'disabled');
    YasqeSteps.includeInferredStatements();
    YasqeSteps.getExpandResultsOverSameAsButton().should('not.have.class', 'disabled');
  });
});
