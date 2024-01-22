import DefaultViewPageSteps from '../../steps/default-view-page-steps';
import {QueryStubs} from '../../stubs/query-stubs';
import {YasqeSteps} from '../../steps/yasqe-steps';
import {YasrSteps} from '../../steps/yasr-steps';
import {YasguiSteps} from "../../steps/yasgui-steps";

describe('Query loader', () => {
  beforeEach(() => {
    DefaultViewPageSteps.visit();
    QueryStubs.stubLongRunningQuery();
  });

  it('Should show loader while query is running', () => {
    // Given I have opened a page
    // And I have opened another tab
    YasguiSteps.openANewTab();
    YasguiSteps.getTabs().should('have.length', 2);
    // When I execute a query
    YasqeSteps.executeQueryWithoutWaitResult(1);
    // Then I expect the loader to be visible
    YasrSteps.getLoader(1).should('be.visible');
    // When I switch to the previous tab
    YasguiSteps.openTab(0);
    // Then I expect the loader to not be visible
    YasrSteps.getLoader(0).should('not.be.visible');
    // When I switch back to the tab with the running query
    YasguiSteps.openTab(1);
    // Then I expect the loader to be visible
    YasrSteps.getLoader(1).should('be.visible');
    // When the query is finished
    YasrSteps.getTableResults(1).should('have.length', 35);
  });
});
