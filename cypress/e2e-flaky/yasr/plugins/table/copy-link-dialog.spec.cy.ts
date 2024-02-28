import {QueryStubDescription, QueryStubs} from '../../../../stubs/query-stubs';
import {YasqeSteps} from '../../../../steps/yasqe-steps';
import {YasrSteps} from '../../../../steps/yasr-steps';
import {YasrPluginPageSteps} from '../../../../steps/pages/yasr-plugin-page-steps';

describe('Plugin: Table', () => {

  beforeEach(() => {
    // Given I visit a page with "ontotex-yasgui-web-component" in it.
    YasrPluginPageSteps.visit();
  });

  context('Copy resource link dialog', () => {

    it('Should open copy link dialog', () => {
      // When I execute a query which returns results of type is uri.
      const queryDescription = new QueryStubDescription().setPageSize(10).setTotalElements(2);
      QueryStubs.stubQueryResults(queryDescription);
      YasqeSteps.executeQuery();
      // And click on a copy link.
      YasrSteps.clickOnCopyResourceLink(1, 2);
      // Then I expect copy link dialog to be opened.
      YasrSteps.getCopyResourceLinkDialog().should('be.visible');
    });

    it('Should close copy link dialog on close button click', {
      retries: {
        runMode: 1,
        openMode: 0
      }
    }, () => {
      // When I execute a query which returns results of type is uri.
      const queryDescription = new QueryStubDescription().setPageSize(10).setTotalElements(2);
      QueryStubs.stubQueryResults(queryDescription);
      YasqeSteps.executeQuery();
      // And copy resource dialog is open.
      openCopyResourceLinkDialog(1);
      // When I click on close button
      YasrSteps.clickCopyLinkDialogCloseButton();
      // Then I expect copy link dialog to be closed.
      YasrSteps.getCopyResourceLinkDialog().should('not.exist');
    });

    it('Should close copy link dialog on cancel button click', {
      retries: {
        runMode: 1,
        openMode: 0,
      },
    },() => {
      // When I execute a query which returns results of type is uri.
      const queryDescription = new QueryStubDescription().setPageSize(10).setTotalElements(3);
      QueryStubs.stubQueryResults(queryDescription);
      YasqeSteps.executeQuery();
      // And copy resource link dialog is open
      openCopyResourceLinkDialog(1);
      // And click on cancel button
      YasrSteps.clickCopyLinkDialogCancelButton();
      // Then I expect copy link dialog to be closed.
      YasrSteps.getCopyResourceLinkDialog().should('not.exist');
    });

    it('Should close copy link dialog on copy link button click', {
      retries: {
        runMode: 1,
        openMode: 0
      }
    },() => {
      // When I execute a query which returns results of type is uri.
      const queryDescription = new QueryStubDescription().setPageSize(10).setTotalElements(3);
      QueryStubs.stubQueryResults(queryDescription);
      YasqeSteps.executeQuery();
      // And copy resource link dialog is open
      openCopyResourceLinkDialog(2);
      // And click on copy button
      YasrSteps.clickCopyLinkDialogCopyButton();
      // Then I expect copy link dialog to be closed.
      YasrSteps.getCopyResourceLinkDialog().should('not.exist');
    });

    it('Should close copy link dialog on click outside of the dialog', () => {
      // When I execute a query which returns results of type is uri.
      const queryDescription = new QueryStubDescription().setPageSize(10).setTotalElements(2);
      QueryStubs.stubQueryResults(queryDescription);
      YasqeSteps.executeQuery();
      // And copy resource link dialog is open
      openCopyResourceLinkDialog(1);
      // And click on copy button
      YasrSteps.clickOutsideCopyLinkDialog();
      // Then I expect copy link dialog to be closed.
      YasrSteps.getCopyResourceLinkDialog().should('not.exist');
    });

    it('Should see the copied uri link in the copy link dialog', () => {
      // When I execute a query which returns results of type is uri.
      const queryDescription = new QueryStubDescription().setPageSize(10).setTotalElements(2);
      QueryStubs.stubQueryResults(queryDescription);
      YasqeSteps.executeQuery();
      // And copy resource link dialog is open
      openCopyResourceLinkDialog(1);
      // Then I expect the input of dialog to have value.
      YasrSteps.getCopyResourceLinkInput().should('have.value', 'http://ontotext-yasgui/generated-yri#page_1-row_2-column_2');
    });

    it('Should put the link in the clipboard on copy link button click', () => {
      // When I execute a query which returns results of type is uri.
      const queryDescription = new QueryStubDescription().setPageSize(10).setTotalElements(3);
      QueryStubs.stubQueryResults(queryDescription);
      YasqeSteps.executeQuery();
      // And copy resource link dialog is open
      openCopyResourceLinkDialog(1);
      // When click on button copy to clipboard
      YasrSteps.clickCopyLinkDialogCopyButton();
      // Then I expect the value from input to be copied into clipboard.
      cy.assertClipboardValue('http://ontotext-yasgui/generated-yri#page_1-row_2-column_2');
    });

    it('Should send notify message when resource link is copied successfully', {
      retries: {
        runMode: 1,
        openMode: 0
      }
    }, () => {
      // When I attach handler to receive message from component
      YasrSteps.attachMessageHandler();
      // And I execute a query which returns results of type is uri.
      const queryDescription = new QueryStubDescription().setPageSize(10).setTotalElements(3);
      QueryStubs.stubQueryResults(queryDescription);
      YasqeSteps.executeQuery();
      // And copy resource link dialog is open
      openCopyResourceLinkDialog(2);
      // And click on button copy to clipboard
      YasrSteps.clickCopyLinkDialogCopyButton();
      // Then I expect the value from input to be copied into clipboard.
      YasrSteps.getMessage().contains('{"TYPE":"notificationMessage","payload":{"code":"resource_link_copied_successfully","messageType":"success","message":"URL copied successfully to clipboard."}}');
    });
  });
});

function openCopyResourceLinkDialog(rowNumber = 10, cellNumber = 2) {
  YasrSteps.clickOnCopyResourceLink(rowNumber, cellNumber);
  YasrSteps.getCopyResourceLinkDialog().should('be.visible');
}
