import {QueryStubs} from '../../stubs/query-stubs';
import {YasrTablePluginSteps} from '../../steps/yasr-table-plugin-steps';
import {YasqeSteps} from '../../steps/yasqe-steps';
import DefaultViewPageSteps from '../../steps/default-view-page-steps';
import {YasrSteps} from '../../steps/yasr-steps';

describe('Plugin: Table', () => {

   beforeEach(() => {
      // Given I visit a page with "ontotex-yasgu-web-component" in it.
      YasrTablePluginSteps.visit();
   });

   describe('Result info message', () => {

      it('Should not display a data message when a query returns no results', () => {
         // When I execute a query which doesn't return results.
         QueryStubs.stubEmptyQueryResponse();
         YasqeSteps.executeQuery();

         // Then I expect the data table with results to be empty.
         YasrTablePluginSteps.getEmptyResult().contains('No data available in table');
         // And result info message have to describe that there are not results and to inform client when the query was executed.
         YasrTablePluginSteps.getQueryResultInfo().contains(/No results\. Query took \d{1}\.\d{1}s, moments ago\./);
      });

      it('Should display message described how many results are returned when a query returns results', () => {
         // When I execute a query which return results.
         QueryStubs.stubDefaultQueryResponse();
         YasqeSteps.executeQuery();

         // Then I expect the data table with results to not be empty.
         YasrTablePluginSteps.getResults().should('have.length', 36);
         // And result info message have to describe how many results are returned and to inform client when the query was executed.
         YasrTablePluginSteps.getQueryResultInfo().contains(/36 results Query took \d{1}\.\d{1}s, moments ago\./);

         // When I go to other page
         DefaultViewPageSteps.visitDefaultViewPage();
         // And return to the first one.
         YasrTablePluginSteps.visit();

         // Then I expect result info message to be same.
         YasrTablePluginSteps.getQueryResultInfo().contains(/36 results Query took \d{1}\.\d{1}s, moments ago\./);
      });
   });

   describe('Results formatting', () => {

      it('Should all resource be formatted with short uri when results are of type uri', () => {
         // When I execute a query which return results and results type is uri.
         QueryStubs.stubDefaultQueryResponse();
         YasqeSteps.executeQuery();

         // Then I expect results to be displayed with short uri.
         YasrSteps.getResultCell(1, 2).contains('rdf:type');
         YasrSteps.getResultCell(4, 3).contains('owl:TransitiveProperty');
      });

      it('Should copy url link be visible when the mouse is over a cell of result table', () => {
         // When I execute a query which return results and results type is uri.
         QueryStubs.stubDefaultQueryResponse();
         YasqeSteps.executeQuery();

         // And I hovered the mouse over a cell of result table.
         YasrSteps.hoverCell(1, 2);

         // Then I expect copy url link to be visible
         YasrSteps.getCopyResourceLink(1, 2).should('be.visible');
      });
   });

   describe('Copy resource link dialog', () => {

      it('Should open copy link dialog', () => {
         // When I execute a query which returns results of type is uri.
         QueryStubs.stubDefaultQueryResponse();
         YasqeSteps.executeQuery();
         // And click on a copy link.
         YasrSteps.clickOnCopyResourceLink(10, 2);

         // Then I expect copy link dialog to be opened.
         YasrSteps.getCopyResourceLinkDialog().should('be.visible');
      });

      it('Should close copy link dialog when click on close button', () => {
         // When I execute a query which returns results of type is uri.
         QueryStubs.stubDefaultQueryResponse();
         YasqeSteps.executeQuery();
         // And copy resource dialog is open.
         openCopyResourceLinkDialog();

         // When I click on close button
         YasrSteps.clickCopyLinkDialogCloseButton();

         // Then I expect copy link dialog to be closed.
         YasrSteps.getCopyResourceLinkDialog().should('not.exist');
      });

      it('Should close copy link dialog when click on cancel button', () => {
         // When I execute a query which returns results of type is uri.
         QueryStubs.stubDefaultQueryResponse();
         YasqeSteps.executeQuery();
         // And copy resource link dialog is open
         openCopyResourceLinkDialog();

         // And click on cancel button
         YasrSteps.clickCopyLinkDialogCancelButton();

         // Then I expect copy link dialog to be closed.
         YasrSteps.getCopyResourceLinkDialog().should('not.exist');
      });

      it('Should close copy link dialog when click on copy link button', () => {
         // When I execute a query which returns results of type is uri.
         QueryStubs.stubDefaultQueryResponse();
         YasqeSteps.executeQuery();
         // And copy resource link dialog is open
         openCopyResourceLinkDialog();

         // And click on copy button
         YasrSteps.clickCopyLinkDialogCopyButton();

         // Then I expect copy link dialog to be closed.
         YasrSteps.getCopyResourceLinkDialog().should('not.exist');
      });

      it('Should close copy link dialog when click outside dialog', () => {
         // When I execute a query which returns results of type is uri.
         QueryStubs.stubDefaultQueryResponse();
         YasqeSteps.executeQuery();
         // And copy resource link dialog is open
         openCopyResourceLinkDialog();

         // And click on copy button
         YasrSteps.clickOutsideCopyLinkDialog();

         // Then I expect copy link dialog to be closed.
         YasrSteps.getCopyResourceLinkDialog().should('not.exist');
      });

      it('Should input of copy link dialog be filled when dialog is open', () => {
         // When I execute a query which returns results of type is uri.
         QueryStubs.stubDefaultQueryResponse();
         YasqeSteps.executeQuery();
         // And copy resource link dialog is open
         openCopyResourceLinkDialog();

         // Then I expect the input of dialog to have value.
         YasrSteps.getCopyResourceLinkInput().should('have.value', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type');
      });

      it('Should copy value of copy link dialog input into clipboard when click on copy link dialog', () => {
         // When I execute a query which returns results of type is uri.
         QueryStubs.stubDefaultQueryResponse();
         YasqeSteps.executeQuery();
         // And copy resource link dialog is open
         openCopyResourceLinkDialog();

         // When click on button copy to clipboard
         YasrSteps.clickCopyLinkDialogCopyButton();

         // Then I expect the value from input to be copied into clipboard.
         cy.assertClipboardValue('http://www.w3.org/1999/02/22-rdf-syntax-ns#type');
      });

      it('Should send notify message when resource link is copied successfully', () => {
         // When I attach handler to receive message from component
         YasrSteps.attachMessageHandler();
         // And I execute a query which returns results of type is uri.
         QueryStubs.stubDefaultQueryResponse();
         YasqeSteps.executeQuery();
         // And copy resource link dialog is open
         openCopyResourceLinkDialog();
         // And click on button copy to clipboard
         YasrSteps.clickCopyLinkDialogCopyButton();

         // Then I expect the value from input to be copied into clipboard.
         YasrSteps.getMessage().contains('{"TYPE":"notificationMessage","payload":{"code":"resource_link_copied_successfully","messageType":"success","message":"URL copied successfully to clipboard."}}');
      });
   });

   function openCopyResourceLinkDialog(rowNumber = 10, cellNumber = 2) {
      YasrSteps.clickOnCopyResourceLink(10, 2);
      YasrSteps.getCopyResourceLinkDialog().should('be.visible');
   }
});
