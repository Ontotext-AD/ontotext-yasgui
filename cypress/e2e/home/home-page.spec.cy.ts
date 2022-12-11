import PageSteps from '../../steps/page-steps';
import {YasguiSteps} from '../../steps/yasgui-steps';

describe('Describes "ontotext-yasgui-web-component" component', () => {

   beforeEach(() => {
      cy.intercept('/repositories/test-repo', {fixture: '/queries/default-query-response.json'}).as('getGuides');
   });

   it('Should load "ontotext-yasgui-web-component" component', () => {
      PageSteps.visitHomePage();
      cy.getByDataSelector('ontotext-yasgui-tag');
      YasguiSteps.executeQuery();

      cy.get('.yasr_results tbody').find('tr').should('have.length', 36);
   })
})