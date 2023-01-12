import {PersistenceSteps} from '../steps/persistence-steps';
import {YasguiSteps} from '../steps/yasgui-steps';

describe('Persistence context', () => {

   it('Should be able to create instances independent each other', () => {
      // When I create an instance of "ontotext-yasgui-web-component".
      PersistenceSteps.visitFirstInstancePage();
      // And I open a new tab
      YasguiSteps.openANewTab();
      // And I create another instance.
      PersistenceSteps.visitSecondInstancePage();

      // Then I expect the new instance to have only one tab.
      YasguiSteps.getTabs().should('have.length', 1);

      // And when I go to page with first instance
      PersistenceSteps.visitFirstInstancePage();

      // Then I expect to see two tabs
      YasguiSteps.getTabs().should('have.length', 2);
   });
});