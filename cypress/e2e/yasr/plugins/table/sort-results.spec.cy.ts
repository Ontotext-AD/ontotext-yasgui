import {YasqeSteps} from '../../../../steps/yasqe-steps';
import {YasrSteps} from '../../../../steps/yasr-steps';
import {YasrTableSortingPageSteps} from "../../../../steps/pages/yasr-table-sorting-page.steps";

describe('Sort table plugin functionality', () => {

  beforeEach(() => {
    YasrTableSortingPageSteps.visit();
  });

  it('should sort results by columns with different types', () => {
    // Given I have opened the YASGUI
    // And I have executed a query that returns results
    YasqeSteps.executeQuery();
    // Then I expect to have 5 columns in the results table
    YasrSteps.getResultsTableColumns().should('have.length', 5);
    // And I expect the columns to be named as follows (the first column is for the index and doesn't have a name)
    YasrSteps.verifyColumnHeaders(['', 'string', 'integer', 'date', 'literal']);
    // Given Initial order of the results in the third column is
    YasrSteps.verifyTableColumnOrder(0, ['1', '2', '3', '4', '5']);
    YasrSteps.verifyTableColumnOrder(1, ['"a"', '"d"', '"b"', '"w"']);
    YasrSteps.verifyTableColumnOrder(2, ['"10"^^xsd:integer', '"2"^^xsd:integer', '"100"^^xsd:integer', '"11"^^xsd:integer']);
    YasrSteps.verifyTableColumnOrder(3, ['"1981-05-07"^^xsd:date', '"1999-05-10"^^xsd:date', '"2011-01-07"^^xsd:date', '"2000-11-01"^^xsd:date']);
    YasrSteps.verifyTableColumnOrder(4, ['"10"', '"2"', '"100"', '"11"']);

    // Index column is not sortable
    // When I click on the first column
    YasrSteps.clickOnColumnHeader(0);
    // Then I expect the order to be preserved because the first column is the index
    YasrSteps.verifyTableColumnOrder(0, ['1', '2', '3', '4', '5']);

    // Sort by string
    // When I click on the second column to sort the results by string
    YasrSteps.clickOnColumnHeader(1);
    // Then I expect results to be ordered alphabetically by the string column
    YasrSteps.verifyTableColumnOrder(1, ['"a"', '"b"', '"d"', '"w"']);

    // Sort by integer
    // When I click on the third column to sort the results by integer
    YasrSteps.clickOnColumnHeader(2);
    // Then I expect results to be ordered numerically by the integer column
    YasrSteps.verifyTableColumnOrder(2, ['"2"^^xsd:integer', '"10"^^xsd:integer', '"11"^^xsd:integer', '"100"^^xsd:integer']);

    // Sort by date
    // When I click on the fourth column to sort the results by date
    YasrSteps.clickOnColumnHeader(3);
    // Then I expect results to be ordered chronologically by the date column
    YasrSteps.verifyTableColumnOrder(3, ['"1981-05-07"^^xsd:date', '"1999-05-10"^^xsd:date', '"2000-11-01"^^xsd:date', '"2011-01-07"^^xsd:date']);

    // Sort by literal
    // When I click on the fifth column to sort the results by literal
    YasrSteps.clickOnColumnHeader(4);
    // Then I expect results to be ordered alphabetically by the literal column
    YasrSteps.verifyTableColumnOrder(4, ['"10"', '"100"', '"11"', '"2"']);
  });
});
