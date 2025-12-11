import {YasqeSteps} from "../../steps/yasqe-steps";
import {QueryStubDescription, QueryStubs} from "../../stubs/query-stubs";
import ActionsPageSteps from "../../steps/pages/actions-page-steps";
import {YasguiSteps} from '../../steps/yasgui-steps';
import {YasrSteps} from "../../steps/yasr-steps";

describe('Include inferred action', () => {
  beforeEach(() => {
    QueryStubs.stubDefaultQueryResponse();
    // Given I have opened a page with the yasgui
    // And there is an open tab with sparql query in it
    ActionsPageSteps.visit();
  });

  it('should not be able to toggle the inferred button state if it is configured to be immutable', () => {
    // When I open the editor configured the infer button to be immutable.
    ActionsPageSteps.configureInferImmutable();

    // Then I expect inferred button to be on.
    YasqeSteps.getActionButtonTooltip(3).should('have.attr', 'yasgui-data-tooltip', 'Include inferred data in results: ON');
    YasqeSteps.getActionButton(3).should('have.class', 'icon-inferred-on');

    // When I click on inferred button
    YasqeSteps.getActionButton(3).click({force: true});

    // Then I expect inferred button to not be toggled.
    YasqeSteps.getActionButtonTooltip(3).should('have.attr', 'yasgui-data-tooltip', 'Include inferred data in results: ON');
    YasqeSteps.getActionButton(3).should('have.class', 'icon-inferred-on');
  });

  it('Should be able to toggle the include inferred button state', () => {
    // When I open the editor
    // Then I expect that include inferred statements should be enabled by default
    YasqeSteps.getActionButtonTooltip(3).should('have.attr', 'yasgui-data-tooltip', 'Include inferred data in results: ON');
    YasqeSteps.getActionButton(3).should('have.class', 'icon-inferred-on');
    // When I click in the include inferred action
    YasqeSteps.includeInferredStatements();
    // Then I expect it to be disabled
    YasqeSteps.getActionButtonTooltip(3).should('have.attr', 'yasgui-data-tooltip', 'Include inferred data in results: OFF');
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

  describe('infer configuration', () => {
    it('should be enabled if "infer" configuration is not configured.', () => {
      // When I visit a page with "ontotext-yasgui-web-component" in it,
      // and "infer" configuration is not setup.
      // Then I expect that inferred element to be enabled by default
      YasqeSteps.getActionButtonTooltip(3).should('have.attr', 'yasgui-data-tooltip', 'Include inferred data in results: ON');
      YasqeSteps.getActionButton(3).should('have.class', 'icon-inferred-on');

      // When I open a new Tab.
      YasguiSteps.openANewTab();

      // Then I expect that inferred element to be enabled in the new tab.
      YasqeSteps.getActionButtonTooltip(3).should('have.attr', 'yasgui-data-tooltip', 'Include inferred data in results: ON');
      YasqeSteps.getActionButton(3).should('have.class', 'icon-inferred-on');
    });

    it('should be enabled if "infer" configuration is set to true.', () => {
      // When I visit a page with "ontotext-yasgui-web-component" in it,
      // and "infer" configuration is set to true.
      ActionsPageSteps.configureInferEnabled();

      // Then I expect that inferred element to be enabled.
      YasqeSteps.getActionButtonTooltip(3).should('have.attr', 'yasgui-data-tooltip', 'Include inferred data in results: ON');
      YasqeSteps.getActionButton(3).should('have.class', 'icon-inferred-on');

      // When I open a new Tab.
      YasguiSteps.openANewTab();

      // Then I expect that inferred element to be enabled in the new tab.
      YasqeSteps.getActionButtonTooltip(3).should('have.attr', 'yasgui-data-tooltip', 'Include inferred data in results: ON');
      YasqeSteps.getActionButton(3).should('have.class', 'icon-inferred-on');
    });

    it('should not be enabled if "infer" configuration is set to false.', () => {
      // When I visit a page with "ontotext-yasgui-web-component" in it,
      // and "infer" configuration is not setup.
      // Then I expect that inferred element to be enabled by default
      YasqeSteps.getActionButtonTooltip(3).should('have.attr', 'yasgui-data-tooltip', 'Include inferred data in results: ON');
      YasqeSteps.getActionButton(3).should('have.class', 'icon-inferred-on');

      // When I change configure infer to false,
      ActionsPageSteps.configureInferDisabled();
      // and open a new Tab.
      YasguiSteps.openANewTab();

      // Then I expect that infer element to be disabled.
      YasqeSteps.getActionButtonTooltip(3).should('have.attr', 'yasgui-data-tooltip', 'Include inferred data in results: OFF');
      YasqeSteps.getActionButton(3).should('have.class', 'icon-inferred-off');

      // When I come back to the first tab
      YasguiSteps.openTab(0);

      // Then I expect "infer" to be enabled.
      YasqeSteps.getActionButtonTooltip(3).should('have.attr', 'yasgui-data-tooltip', 'Include inferred data in results: ON');
      YasqeSteps.getActionButton(3).should('have.class', 'icon-inferred-on');
    });

    it('should reset "infer" state when resetting results.', () => {
      // When I visit a page with "ontotext-yasgui-web-component" in it,
      // and "infer" configuration is not setup.
      // Then I expect that inferred element to be enabled by default
      YasqeSteps.getActionButtonTooltip(3).should('have.attr', 'yasgui-data-tooltip', 'Include inferred data in results: ON');
      YasqeSteps.getActionButton(3).should('have.class', 'icon-inferred-on');

      // When I change configure "infer" to false
      YasqeSteps.includeInferredStatements();
      // Then I expect that the infer element to be disabled.
      YasqeSteps.getActionButtonTooltip(3).should('have.attr', 'yasgui-data-tooltip', 'Include inferred data in results: OFF');
      YasqeSteps.getActionButton(3).should('have.class', 'icon-inferred-off');

      // And I execute the query
      YasqeSteps.executeQuery(0);
      // Then I should see the results table
      YasrSteps.getTableResults().should('be.visible');
      // When I reset the results
      ActionsPageSteps.resetResults();
      // Then I should see no results table
      YasrSteps.getRawResults().should('not.be.visible');

      // And I expect "infer" to be enabled.
      YasqeSteps.getActionButtonTooltip(3).should('have.attr', 'yasgui-data-tooltip', 'Include inferred data in results: ON');
      YasqeSteps.getActionButton(3).should('have.class', 'icon-inferred-on');
    });
  });

  describe('sameAs configuration', () => {
    it('should be enabled if "sameAs" configuration is not configured.', () => {
      // When I visit a page with "ontotext-yasgui-web-component" in it,
      // and "sameAs" configuration is not setup.
      // Then I expect that sameAs element to be enabled
      YasqeSteps.getActionButtonTooltip(4).should('have.attr', 'yasgui-data-tooltip', 'Expand results over owl:sameAs: ON');
      YasqeSteps.getActionButton(4).should('have.class', 'icon-same-as-on');

      // When I open a new Tab.
      YasguiSteps.openANewTab();

      // Then I expect that include inferred statements should be enabled.
      YasqeSteps.getActionButtonTooltip(4).should('have.attr', 'yasgui-data-tooltip', 'Expand results over owl:sameAs: ON');
      YasqeSteps.getActionButton(4).should('have.class', 'icon-same-as-on');
    });

    it('should be enabled if "sameAs" configuration is set to true.', () => {
      // When I visit a page with "ontotext-yasgui-web-component" in it,
      // and "sameAs" configuration is set to true.
      ActionsPageSteps.configureSameAsEnabled();

      // Then I expect that sameAs element to be enabled.
      YasqeSteps.getActionButtonTooltip(4).should('have.attr', 'yasgui-data-tooltip', 'Expand results over owl:sameAs: ON');
      YasqeSteps.getActionButton(4).should('have.class', 'icon-same-as-on');

      // When I open a new Tab.
      YasguiSteps.openANewTab();

      // Then I expect that sameAs element to be enabled.
      YasqeSteps.getActionButtonTooltip(4).should('have.attr', 'yasgui-data-tooltip', 'Expand results over owl:sameAs: ON');
      YasqeSteps.getActionButton(4).should('have.class', 'icon-same-as-on');
    });

    it('should not be enabled if "sameAs" configuration is set to false.', () => {
      // When I visit a page with "ontotext-yasgui-web-component" in it,
      // and "sameAs" element is enabled by default.
      // Then I expect that sameAs element to be enabled by default
      YasqeSteps.getActionButtonTooltip(4).should('have.attr', 'yasgui-data-tooltip', 'Expand results over owl:sameAs: ON');
      YasqeSteps.getActionButton(4).should('have.class', 'icon-same-as-on');

      // When I change configure infer to false,
      ActionsPageSteps.configureSameAsDisabled();

      // Then I expect sameAs to not be changed in the first tab.
      YasqeSteps.getActionButtonTooltip(4).should('have.attr', 'yasgui-data-tooltip', 'Expand results over owl:sameAs: ON');
      YasqeSteps.getActionButton(4).should('have.class', 'icon-same-as-on');

      // and open a new Tab.
      YasguiSteps.openANewTab();

      // Then I expect that sameAs element to not be enabled.
      YasqeSteps.getActionButtonTooltip(4).should('have.attr', 'yasgui-data-tooltip', 'Expand results over owl:sameAs: OFF');
      YasqeSteps.getActionButton(4).should('have.class', 'icon-same-as-off');

      // When I come back to the first tab
      YasguiSteps.openTab(0);

      // Then I expect sameAs to be enabled.
      YasqeSteps.getActionButtonTooltip(4).should('have.attr', 'yasgui-data-tooltip', 'Expand results over owl:sameAs: ON');
      YasqeSteps.getActionButton(4).should('have.class', 'icon-same-as-on');
    });

    it('should be disabled if "infer" is set to false and "sameAs" configuration not defined.', () => {
      // When I visit a page with "ontotext-yasgui-web-component" in it,
      // and "infer" configuration is set to false,
      ActionsPageSteps.configureInferDisabled();
      // and "sameAs" configuration is not defined.
      // Then I expect that sameAs element to be disabled.
      YasqeSteps.getActionButtonTooltip(4).should('have.attr', 'yasgui-data-tooltip', "Requires 'Include Inferred'!");
      YasqeSteps.getActionButton(4).should('have.class', 'icon-same-as-off');

      // When I open a new Tab.
      YasguiSteps.openANewTab();

      // Then I same as element to be disabled.
      YasqeSteps.getActionButtonTooltip(4).should('have.attr', 'yasgui-data-tooltip', "Requires 'Include Inferred'!");
      YasqeSteps.getActionButton(4).should('have.class', 'icon-same-as-off');

      // When I expect come back to the first tab
      YasguiSteps.openTab(0);

      // Then I expect sameAs element to be disabled.
      YasqeSteps.getActionButtonTooltip(4).should('have.attr', 'yasgui-data-tooltip', "Requires 'Include Inferred'!");
      YasqeSteps.getActionButton(4).should('have.class', 'icon-same-as-off');
    });

    it('should be disabled if "infer" is set to false and "sameAs" configuration is set to true.', () => {
      // When I visit a page with "ontotext-yasgui-web-component" in it,
      // and "infer" configuration is set to false,
      ActionsPageSteps.configureInferDisabled();
      // and "sameAs" configuration is not defined.
      // Then I expect that sameAs element to be disabled.
      YasqeSteps.getActionButtonTooltip(4).should('have.attr', 'yasgui-data-tooltip', "Requires 'Include Inferred'!");
      YasqeSteps.getActionButton(4).should('have.class', 'icon-same-as-off');

      // When I configure sameAs to be true,
      ActionsPageSteps.configureSameAsEnabled();
      // and open a new Tab.
      YasguiSteps.openANewTab();

      // Then I expect same as element to be disabled.
      YasqeSteps.getActionButtonTooltip(4).should('have.attr', 'yasgui-data-tooltip', "Requires 'Include Inferred'!");
      YasqeSteps.getActionButton(4).should('have.class', 'icon-same-as-off');

      // When I come back to the first tab
      YasguiSteps.openTab(0);

      // Then I expect sameAs element to be disabled.
      YasqeSteps.getActionButtonTooltip(4).should('have.attr', 'yasgui-data-tooltip', "Requires 'Include Inferred'!");
      YasqeSteps.getActionButton(4).should('have.class', 'icon-same-as-off');
    });

    it('should be disabled if "infer" is set to false and "sameAs" configuration is set to false.', () => {
      // When I visit a page with "ontotext-yasgui-web-component" in it,
      // and "infer" configuration is set to false,
      ActionsPageSteps.configureInferDisabled();
      // and "sameAs" configuration is not defined.
      // Then I expect that sameAs element to be disabled.
      YasqeSteps.getActionButtonTooltip(4).should('have.attr', 'yasgui-data-tooltip', "Requires 'Include Inferred'!");
      YasqeSteps.getActionButton(4).should('have.class', 'icon-same-as-off');

      // When I configure sameAs to be true,
      ActionsPageSteps.configureSameAsEnabled();
      // and open a new Tab.
      YasguiSteps.openANewTab();

      // Then I expect same as element to be disabled.
      YasqeSteps.getActionButtonTooltip(4).should('have.attr', 'yasgui-data-tooltip', "Requires 'Include Inferred'!");
      YasqeSteps.getActionButton(4).should('have.class', 'icon-same-as-off');

      // When I come back to the first tab
      YasguiSteps.openTab(0);

      // Then I expect sameAs element to be disabled.
      YasqeSteps.getActionButtonTooltip(4).should('have.attr', 'yasgui-data-tooltip', "Requires 'Include Inferred'!");
      YasqeSteps.getActionButton(4).should('have.class', 'icon-same-as-off');
    });
  });
});
