import DefaultViewPageSteps from '../steps/default-view-page-steps';
import {QueryStubDescription, QueryStubs} from "../stubs/query-stubs";
import {YasqeSteps} from "../steps/yasqe-steps";
import {YasrSteps} from "../steps/yasr-steps";
import {TabContextMenu, YasguiSteps} from "../steps/yasgui-steps";
import {ConfirmationDialogSteps} from "../steps/confirmation-dialog.steps";

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
    ConfirmationDialogSteps.getConfirmation().should('be.visible');
    // When I cancel the operation
    ConfirmationDialogSteps.reject();
    ConfirmationDialogSteps.getConfirmation().should('not.exist');
    // Then I expect that to remain opened
    YasguiSteps.getTabs().should('have.length', 2);
    // When I try closing it again
    YasguiSteps.closeTab(1);
    ConfirmationDialogSteps.getConfirmation().should('be.visible');
    // And I confirm
    ConfirmationDialogSteps.confirm();
    // Then I expect that the tab will be closed
    YasguiSteps.getTabs().should('have.length', 1);
  });

  it('Should ask for confirmation on tab close through tab context menu', () => {
    // Given I have opened yasgui with a single opened tab
    // And I have created a second tab
    YasguiSteps.openANewTab();
    YasguiSteps.getTabs().should('have.length', 2);
    // Do this check just for a bit of delay before closing the tab
    YasqeSteps.executeQuery(1);
    YasrSteps.getResults().should('have.length', 6);
    // When I close the second tab
    YasguiSteps.openTabContextMenu(1).should('be.visible');
    TabContextMenu.closeTab();
    // Then I expect a confirmation dialog to be opened
    ConfirmationDialogSteps.getConfirmation().should('be.visible');
    // And I confirm
    ConfirmationDialogSteps.confirm();
    // Then I expect that the tab will be closed
    YasguiSteps.getTabs().should('have.length', 1);
  });
});
