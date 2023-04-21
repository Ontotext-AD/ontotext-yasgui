import {QueryStubs} from '../../stubs/query-stubs';
import {YasqeSteps} from '../../steps/yasqe-steps';
import {AbortQueryPageSteps} from '../../steps/pages/abort-query-page-steps';
import {YasguiSteps} from '../../steps/yasgui-steps';

describe('Abort query', () => {

  beforeEach(() => {
    AbortQueryPageSteps.visit();
  });

  it('should abort query when click on "Abort query" button.', () => {
    // When I visit a page with "ontotext-yasgui-web-component" in it,
    // and execute a query that takes a long time.
    QueryStubs.stubDefaultQueryResponse(1000);
    YasqeSteps.executeQueryWithoutWaiteResult();

    // Then I expect to an "Abort query" button to be displayed,
    YasqeSteps.getAbortQueryButton().should('exist');
    // and button has text
    YasqeSteps.getAbortQueryButton().should('have.text', 'Abort query');

    // When I hover over the "Abort button".
    YasqeSteps.hoverOverAbortQueryButton();

    // Then I expect to see tooltip that describes what happen if click on it.
    cy.get('div[data-tippy-root]').contains('Click to abort query');

    // When I click on the button.
    YasqeSteps.getAbortQueryButton().realClick();

    // Then I expect button text to be changed.
    YasqeSteps.getAbortQueryButton().should('have.text', 'Stop has been requested');

    // When I hover over the "Stop has been requested".
    YasqeSteps.hoverOverAbortQueryButton();

    // Then I expect to see tooltip that describes what happen if click on it.
    YasguiSteps.getTooltipRoot().contains('Query was requested to abort and will be terminated on the first I/O operation');

    // When abort query finished.
    // I expect the button not be visible.
    YasqeSteps.getAbortQueryButton().should('not.be.visible');
  });
});
