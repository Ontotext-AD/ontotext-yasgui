export class YasrTablePluginSteps {

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
