import {PublicApiPageSteps} from '../steps/pages/public-api-page-steps';
import {YasqeSteps} from '../steps/yasqe-steps';
import {YasrSteps} from '../steps/yasr-steps';

describe('Component public API', () => {
  it('should show or hide yasqe buttons', () => {
    // When I open a page, that contains "ontotext-yasgui-web-components",
    PublicApiPageSteps.visit();
    // and call functions to hide yasqe buttons.
    PublicApiPageSteps.hideActionCreateSavedQuery();
    PublicApiPageSteps.hideInferStatements();
    PublicApiPageSteps.hideExpandResults();
    PublicApiPageSteps.hideShareQuery();
    PublicApiPageSteps.hideShowSavedQueries();

    // Then I expect all buttons to be not visible.
    YasqeSteps.getCreateSavedQueryButton().should('not.be.visible');
    YasqeSteps.getIncludeInferredStatementsButton().should('not.be.visible');
    YasqeSteps.getExpandResultsOverSameAsButton().should('not.be.visible');
    YasqeSteps.getShareQueryButton().should('not.be.visible');
    YasqeSteps.getShowSavedQueriesButton().should('not.be.visible');

    // When call functions to show yasqe buttons.
    PublicApiPageSteps.showActionCreateSavedQuery();
    PublicApiPageSteps.showInferStatements();
    PublicApiPageSteps.showExpandResults();
    PublicApiPageSteps.showShareQuery();
    PublicApiPageSteps.showShowSavedQueries();

    // Then I expect all buttons to be not visible.
    YasqeSteps.getCreateSavedQueryButton().should('be.visible');
    YasqeSteps.getIncludeInferredStatementsButton().should('be.visible');
    YasqeSteps.getExpandResultsOverSameAsButton().should('be.visible');
    YasqeSteps.getShareQueryButton().should('be.visible');
    YasqeSteps.getShowSavedQueriesButton().should('be.visible');
  });

  it('should switch to different render mode', () => {
    // When I open a page, that contains "ontotext-yasgui-web-components",
    PublicApiPageSteps.visit();
    // and switch to yasqe mode
    PublicApiPageSteps.switchToYasqeMode();

    // Then I expect to see only yasqe.
    YasqeSteps.getYasqe().should('be.visible');
    YasrSteps.getYasr().should('not.be.visible');

    // When I switch to yasr mode.
    PublicApiPageSteps.switchToYasrMode();

    // Then I expect to see only yasr.
    YasqeSteps.getYasqe().should('not.be.visible');
    YasrSteps.getYasr().should('be.visible');

    // When I switch to yasgui mode.
    PublicApiPageSteps.switchToYasguiMode();

    // Then I expect to see both yasr and yasqe.
    YasqeSteps.getYasqe().should('be.visible');
    YasrSteps.getYasr().should('be.visible');
  });
});
