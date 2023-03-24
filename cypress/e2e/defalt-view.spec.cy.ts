import DefaultViewPageSteps from '../steps/default-view-page-steps';
import {YasqeSteps} from '../steps/yasqe-steps';
import {YasrSteps} from '../steps/yasr-steps';
import {QueryStubDescription, QueryStubs} from "../stubs/query-stubs";

describe('Default view', () => {

  beforeEach(() => {
    DefaultViewPageSteps.visitDefaultViewPage();
    QueryStubs.stubQueryResults(new QueryStubDescription().setPageSize(10).setTotalElements(6));
  });

  it('Should load component with default configuration', () => {
    YasqeSteps.executeQuery();
    YasrSteps.getResults().should('have.length', 6);
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
  });
})
