import {YasqeSteps} from "../../steps/yasqe-steps";
import {YasrSteps} from "../../steps/yasr-steps";
import {QueryStubs} from "../../stubs/query-stubs";
import ActionsPageSteps from "../../steps/actions-page-steps";

describe('Execute query action', () => {
    beforeEach(() => {
        QueryStubs.stubDefaultQueryResponse();
    });

    it('Should be able to execute a query', () => {
        ActionsPageSteps.visit();
        YasqeSteps.getExecuteQueryButton().should('be.visible');
        YasqeSteps.executeQuery();
        YasrSteps.getResults().should('have.length', 36);
    });

    it('Should display a progress indicator during query execution', () => {
        QueryStubs.stubDefaultQueryResponse(2000);
        ActionsPageSteps.visit();
        YasqeSteps.executeQuery();
        YasrSteps.getResults().should('have.length', 36);
    });
});
