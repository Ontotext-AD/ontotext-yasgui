import PageSteps from '../../steps/page-steps';

describe('Describes "ontotext-yasgui-web-component" component', () => {

   it('Should load "ontotext-yasgui-web-component" component', () => {
      PageSteps.visitHomePage();
      cy.getByDataSelector('ontotext-yasgui-tag');
   })
})