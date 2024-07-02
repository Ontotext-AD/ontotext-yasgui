import {ClearStateConfigPageSteps} from "../steps/pages/clear-state-config-page-steps";
import {YasqeSteps} from "../steps/yasqe-steps";
import {YasrTablePluginSteps} from "../steps/yasr-table-plugin-steps";
import {YasrSteps} from "../steps/yasr-steps";

describe('Clear state configuration', () => {
  it('should clear the results when clearState flag is set', () => {
    // Given I am in the editor
    ClearStateConfigPageSteps.visit();
    // I should not see any results
    YasrTablePluginSteps.getResults().should('not.exist');
    // And I run a query
    YasqeSteps.executeQuery();
    // I should see the results
    YasrTablePluginSteps.getQueryResultInfo().should('exist');
    // When I change the configuration by clearing the state
    ClearStateConfigPageSteps.clearYasguiState();
    // Then I should see that the results are not visible
    YasrTablePluginSteps.getResults().should('not.exist');
    // Then I expect the plugins buttons to not be visible
    YasrSteps.getPluginsButtons().should('not.be.visible');
  });
})
