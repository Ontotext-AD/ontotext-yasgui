import PageSteps from '../steps/page-steps';
import {YasqeSteps} from '../steps/yasqe-steps';
import {YasrSteps} from '../steps/yasr-steps';

describe('Default view', () => {

    beforeEach(() => {
        cy.intercept('/repositories/test-repo', {fixture: '/queries/default-query-response.json'}).as('getGuides');
    });

    it('Should load component with default configuration', () => {
        PageSteps.visitDefaultViewPage();
        YasqeSteps.executeQuery();
        YasrSteps.getResults().should('have.length', 36);
    });
})
