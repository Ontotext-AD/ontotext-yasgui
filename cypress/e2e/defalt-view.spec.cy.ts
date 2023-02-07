import DefaultViewPageSteps from '../steps/default-view-page-steps';
import {YasqeSteps} from '../steps/yasqe-steps';
import {YasrSteps} from '../steps/yasr-steps';
import {QueryStubs} from "../stubs/query-stubs";

describe('Default view', () => {

  beforeEach(() => {
    QueryStubs.stubDefaultQueryResponse();
    DefaultViewPageSteps.visitDefaultViewPage();
  });

  it('Should load component with default configuration', () => {
    YasqeSteps.executeQuery();
    YasrSteps.getResults().should('have.length', 36);
  });

  context('Instance methods', () => {

    it('Should be able to get the query mode', () => {
      DefaultViewPageSteps.getQueryMode();
      DefaultViewPageSteps.getOutputField().should('have.value', 'query');
    });

    it('Should be able to get the query type', () => {
      DefaultViewPageSteps.getQueryType();
      DefaultViewPageSteps.getOutputField().should('have.value', 'SELECT');
    });
  })
})
