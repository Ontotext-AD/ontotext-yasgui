export class YasrTablePluginSteps {
   static visit() {
      cy.visit('/pages/yasr-plugins');
   }

   static getEmptyResult() {
      return cy.get('.dataTables_empty');
   }

   static getQueryResultInfo() {
      return cy.get('.tabPanel.active .yasr_response_chip');
   }

   static getResults() {
      return cy.get('.dataTable tbody tr');
   }
}