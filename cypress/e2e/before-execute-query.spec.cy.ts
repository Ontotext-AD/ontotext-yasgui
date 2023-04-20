import {QueryStubDescription, QueryStubs} from '../stubs/query-stubs';
import {BeforeExecuteQueryPageSteps} from '../steps/pages/before-execute-query-page-steps';
import {YasqeSteps} from '../steps/yasqe-steps';
import {ErrorPluginSteps} from '../steps/error-plugin-steps';
import {YasrTablePluginSteps} from '../steps/yasr-table-plugin-steps';

describe('Before execute query functionality', () => {
  beforeEach(() => {
    BeforeExecuteQueryPageSteps.visit();
    QueryStubs.stubQueryResults(new QueryStubDescription().setPageSize(10).setTotalElements(6));
  });

  it('should display error message if "beforeUpdateQuery" result has status "ERROR"', () => {
    // When I execute query for which client returns "beforeUpdateQuery" result with status error.
    BeforeExecuteQueryPageSteps.setupErrorResult();
    YasqeSteps.clearEditor();
    YasqeSteps.writeInEditor('INSERT DATA {<https://swapi.co/vocabulary/#planet> <http://www.w3.org/2000/01/rdf-schema#label> "Test name".\n<https://swapi.co/vocabulary/#planet> <http://www.w3.org/2000/01/rdf-schema#label> "Test name two".\n}');
    YasqeSteps.executeQuery();

    // Then I expect to see an error message.
    ErrorPluginSteps.getErrorPluginBody().contains('Before Update Query Error Result.');
  });

  it('should display custom message if "beforeUpdateQuery" result has status "SUCCESS"', () => {
    // When I execute query for which client returns "beforeUpdateQuery" result with status SUCCESS.
    BeforeExecuteQueryPageSteps.setupSuccessResult();
    YasqeSteps.clearEditor();
    YasqeSteps.writeInEditor('INSERT DATA {<https://swapi.co/vocabulary/#planet> <http://www.w3.org/2000/01/rdf-schema#label> "Test name".\n<https://swapi.co/vocabulary/#planet> <http://www.w3.org/2000/01/rdf-schema#label> "Test name two".\n}');
    YasqeSteps.executeQuery();

    // Then I expect to see a success message.
    YasrTablePluginSteps.getQueryResultInfo().contains('Before Update Query Success Result.');
  });
});
