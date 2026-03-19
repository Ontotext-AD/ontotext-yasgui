import DefaultViewPageSteps from '../../../../steps/default-view-page-steps';
import {YasqeSteps} from '../../../../steps/yasqe-steps';
import {YasrSteps} from '../../../../steps/yasr-steps';
import {QueryStubs} from '../../../../stubs/query-stubs';

describe('Explain Response Plugin', () => {
  it('should display the Explain Response plugin regardless currently selected plugin', () => {
    // GIVEN: I visit a page containing "ontotex-yasgui-web-component" with the extended table plugin selected.
    DefaultViewPageSteps.visit();
    YasqeSteps.executeQuery();

    // WHEN: I execute a query that returns an explain response.
    QueryStubs.stubExplainPlanQueryResponse();
    YasqeSteps.executeQueryWithoutWaitResult();
    // THEN: I should not see the info message.
    YasrSteps.getFallbackInfo().should('not.be.visible');
    // AND: The plugin tabs should not be visible.
    YasrSteps.getPluginsButtons().should('not.be.visible');
    // AND: I should see the explain response in the Explain Response plugin.
    YasrSteps.getExplainPlanResult().should('contain.text', 'NOTE: Optimization groups are evaluated one after another exactly in the given order.');
  });
});
