import PageSteps from '../steps/page-steps';
import {YasqeSteps} from '../steps/yasqe-steps';
import {YasrSteps} from '../steps/yasr-steps';
import {QueryStubs} from "../stubs/query-stubs";

describe('Default view', () => {

    beforeEach(() => {
        QueryStubs.stubDefaultQueryResponse();
    });

    it('Should load component with default configuration', () => {
        PageSteps.visitDefaultViewPage();
        YasqeSteps.executeQuery();
        YasrSteps.getResults().should('have.length', 36);
    });
})
