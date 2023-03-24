import DefaultViewPageSteps from '../steps/default-view-page-steps';
import {QueryStubDescription, QueryStubs} from "../stubs/query-stubs";
import {YasqeSteps} from "../steps/yasqe-steps";
import {YasrSteps} from "../steps/yasr-steps";
import {YasguiSteps} from "../steps/yasgui-steps";

describe('Yasgui tabs', () => {

  beforeEach(() => {
    DefaultViewPageSteps.visitDefaultViewPage();
    QueryStubs.stubQueryResults(new QueryStubDescription().setPageSize(10).setTotalElements(6));
  });

  it('Should ask for confirmation on tab close', () => {
    // Given I have opened yasgui with a single opened tab
    // And I have created a second tab
    YasguiSteps.openANewTab();
    YasguiSteps.getTabs().should('have.length', 2);
    // Do this check just for a bit of delay before closing the tab
    YasqeSteps.executeQuery(1);
    YasrSteps.getResults().should('have.length', 6);
    // When I close the second tab
    YasguiSteps.closeTab(1);
    // Then I expect a confirmation dialog to be opened

    // When I cancel the operation

    // Then I expect that to remain opened

    // When I try closing it again

    // And I confirm

    // Then I expect that the tab will be closed
    YasguiSteps.getTabs().should('have.length', 1);
  });
});
