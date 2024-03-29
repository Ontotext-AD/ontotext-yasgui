import DefaultViewPageSteps from '../steps/default-view-page-steps';
import {QueryStubDescription, QueryStubs} from "../stubs/query-stubs";
import {YasqeSteps} from "../steps/yasqe-steps";
import {YasrSteps} from "../steps/yasr-steps";
import {TabContextMenu, YasguiSteps} from "../steps/yasgui-steps";
import {ConfirmationDialogSteps} from "../steps/confirmation-dialog.steps";

describe('Yasgui tabs', () => {

  beforeEach(() => {
    DefaultViewPageSteps.visit();
    QueryStubs.stubQueryResults(new QueryStubDescription().setPageSize(10).setTotalElements(6));
  });

  it('Should mark tab as errorneous if query is invalid', () => {
    // Given I have opened yasgui with a single opened tab
    // And I have created a second tab
    openNewTab(1, 2);
    // Then I expect to have no error mark on the tab
    YasguiSteps.getCurrentTab().should('not.have.class', 'query-invalid');
    // When I write invalid query
    YasqeSteps.writeInEditor("test");
    // Then I expect that the tab will have an error mark and a title with an error message
    YasguiSteps.getCurrentTab().should('have.class', 'query-invalid')
      .and('have.attr', 'title', 'Query contains a syntax error. See the relevant line for more information.');
    // When I switch the tab
    YasguiSteps.openTab(0);
    // Then I expect that the error mark should stay
    YasguiSteps.getTab(1).should('have.class', 'query-invalid')
      .and('have.attr', 'title', 'Query contains a syntax error. See the relevant line for more information.');
  });

  it('Should ask for confirmation on tab close', () => {
    // Given I have opened yasgui with a single opened tab
    // And I have created a second tab
    openNewTab(1, 2);
    // When I close the second tab
    YasguiSteps.closeTab(1);
    // Then I expect a confirmation dialog to be opened
    ConfirmationDialogSteps.getConfirmation().should('be.visible');
    ConfirmationDialogSteps.getConfirmation().should('contain.text', 'Are you sure you want to close this query tab?');
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
    YasguiSteps.getCurrentTabTitle().should('have.text', 'Unnamed');
  });

  it('Should ask for confirmation on tab close through tab context menu', () => {
    // Given I have opened yasgui with a single opened tab
    // And I have created a second tab
    openNewTab(1, 2);
    // When I close the second tab
    YasguiSteps.openTabContextMenu(1).should('be.visible');
    TabContextMenu.closeTab();
    // Then I expect a confirmation dialog to be opened
    ConfirmationDialogSteps.getConfirmation().should('be.visible');
    // And I confirm
    ConfirmationDialogSteps.confirm();
    // Then I expect that the tab will be closed
    YasguiSteps.getTabs().should('have.length', 1);
    YasguiSteps.getCurrentTabTitle().should('have.text', 'Unnamed');
  });

  it('Should ask for confirmation on close other tabs action', () => {
    // Given I have opened yasgui with a single opened tab
    // And I have created more tabs
    openNewTab(1, 2);
    openNewTab(2, 3);
    // When I try closing all other tabs but the last one
    YasguiSteps.openTabContextMenu(2).should('be.visible');
    TabContextMenu.closeOtherTabs();
    // Then I expect a confirmation dialog to be opened
    ConfirmationDialogSteps.getConfirmation().should('be.visible');
    ConfirmationDialogSteps.getConfirmation().should('contain.text', 'Are you sure you want to close all other query tabs?');
    // When I cancel the operation
    ConfirmationDialogSteps.reject();
    ConfirmationDialogSteps.getConfirmation().should('not.exist');
    // Then I expect that to remain opened
    YasguiSteps.getTabs().should('have.length', 3);
    YasguiSteps.openTabContextMenu(2).should('be.visible');
    TabContextMenu.closeOtherTabs();
    ConfirmationDialogSteps.getConfirmation().should('be.visible');
    // And I confirm
    ConfirmationDialogSteps.confirm();
    // Then I expect that the tab will be closed
    YasguiSteps.getTabs().should('have.length', 1);
    YasguiSteps.getCurrentTabTitle().should('have.text', 'Unnamed 2');
  });

  it('Should ask for confirmation on close other tabs action by clicking close tab button with pressed down shift', () => {
    // Given I have opened yasgui with a single opened tab
    // And I have created more tabs
    openNewTab(1, 2);
    openNewTab(2, 3);
    openNewTab(3, 4);
    // When I click close tab button with pressed down shift button.
    YasguiSteps.closeTab(1, true);
    // Then I expect a confirmation dialog to be opened
    ConfirmationDialogSteps.getConfirmation().should('be.visible');
    ConfirmationDialogSteps.getConfirmation().should('contain.text', 'Are you sure you want to close all other query tabs?');
    // When I cancel the operation
    ConfirmationDialogSteps.reject();
    ConfirmationDialogSteps.getConfirmation().should('not.exist');

    // When I click close tab button with pressed down shift button.
    YasguiSteps.closeTab(2, true);
    // Then I expect a confirmation dialog to be opened
    ConfirmationDialogSteps.getConfirmation().should('be.visible');
    ConfirmationDialogSteps.getConfirmation().should('contain.text', 'Are you sure you want to close all other query tabs?');
    // When I confirm the operation
    ConfirmationDialogSteps.confirm();

    // Then I expect others tabs to be closed
    YasguiSteps.getTabs().should('have.length', 1);
    YasguiSteps.getCurrentTabTitle().should('have.text', 'Unnamed 2');
  });

  it('Should prevent closing the last yasgui tab', () => {
    // Given I have opened yasgui with a single opened tab
    YasguiSteps.getTabs().should('have.length', 1);
    // When I try closing the tab
    YasguiSteps.closeTab(0);
    // Then I expect the tab to remain opened
    YasguiSteps.getTabs().should('have.length', 1);
    DefaultViewPageSteps.getOutputField().should('have.value', 'Last tab must remain open.');
  });

  it('Should display information about ongoing queries if try to close a tab with ongoing  query', () => {
    // When I execute a long-running query,
    QueryStubs.stubLongRunningQuery();
    YasguiSteps.openANewTab();
    YasqeSteps.executeQueryWithoutWaitResult(1);
    // and try to close the tab
    YasguiSteps.closeTab(1);

    // Then I expect to see confirm dialog that explain me about the ongoing query.
    ConfirmationDialogSteps.getConfirmation().should('be.visible');
    ConfirmationDialogSteps.getConfirmation().contains('You have running 1 query, that will be aborted.');
  });

  it('Should not display information about ongoing queries if try to close other tabs without ongoing queries in current one', () => {
    // When I execute a long-running query in a tab (other tabs have not ongoing queries),
    QueryStubs.stubLongRunningQuery();
    YasguiSteps.openANewTab();
    YasqeSteps.executeQueryWithoutWaitResult(1);
    // and try to close other tabs.
    YasguiSteps.openTabContextMenu(1).should('be.visible');
    TabContextMenu.closeOtherTabs();

    // Then I expect to see confirmation dialog,
    ConfirmationDialogSteps.getConfirmation().should('contain.text', 'Are you sure you want to close all other query tabs?');
    // without explanation that there are ongoing queries.
    ConfirmationDialogSteps.getConfirmation().should('not.contain.text', 'You have running queries in your tabs, and they will be aborted when you close the tabs.');
  });

  it('Should display information about ongoing queries if try to close other tabs wit ongoing queries', () => {
    // When I execute a long-running query in a tab,
    QueryStubs.stubLongRunningQuery();
    YasguiSteps.openANewTab();
    YasqeSteps.executeQueryWithoutWaitResult(1);
    // and try to close other tabs from different tab (from tab that haven't ongoing query).
    YasguiSteps.openTabContextMenu(0).should('be.visible');
    TabContextMenu.closeOtherTabs();

    // Then I expect to see confirm message that explain me about the ongoing queries.
    ConfirmationDialogSteps.getConfirmation().should('contain.text', 'You have running 1 query, that will be aborted.');
  });
});

function openNewTab(tabIndex: number, expectedTabsCount: number) {
  YasguiSteps.openANewTab();
  YasguiSteps.getTabs().should('have.length', expectedTabsCount);
  // Do this check just for a bit of delay before closing the tab
  YasqeSteps.executeQuery(tabIndex);
  YasrSteps.getTableResults(tabIndex).should('have.length', 6);
}
