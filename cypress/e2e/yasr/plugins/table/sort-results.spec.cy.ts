import DefaultViewPageSteps from '../../../../steps/default-view-page-steps';
import {YasqeSteps} from '../../../../steps/yasqe-steps';
import {YasrSteps} from '../../../../steps/yasr-steps';

describe('Sort table plugin functionality', () => {

  beforeEach(() => {
    DefaultViewPageSteps.visit();
  });

  it('should sort results', () => {
    // When I visit a page with "ontotext-yasgui-web-component" in it,
    // and execute a query that returns results.
    YasqeSteps.executeQuery();

    // Then I expect the first column shows the result row number,
    YasrSteps.getResultCell(0, 0).should('have.text', '1');
    YasrSteps.getResultCell(1, 0).should('have.text', '2');
    // and results are displayed without sorting,
    YasrSteps.getResultCell(73, 1).should('have.text', 'owl:differentFrom');
    YasrSteps.getResultCell(74, 1).should('have.text', 'http://example/book1');

    // When I click on a table column.
    YasrSteps.clickOnColumnHeader(1);
    // Then I expect the first column shows the result row number,
    YasrSteps.getResultCell(0, 0).should('have.text', '1');
    YasrSteps.getResultCell(1, 0).should('have.text', '2');
    // and results are sorted ascending,
    YasrSteps.getResultCell(0, 1).should('have.text', 'http://example/book1');
    YasrSteps.getResultCell(1, 1).should('have.text', 'http://purl.org/dc/elements/1.1/creator');

    // When I click on a table column.
    YasrSteps.clickOnColumnHeader(1);
    // Then I expect the first column shows the result row number,
    YasrSteps.getResultCell(0, 0).should('have.text', '1');
    YasrSteps.getResultCell(1, 0).should('have.text', '2');
    // and results are sorted descending,
    YasrSteps.getResultCell(2, 1).should('have.text', 'xsd:string');
    YasrSteps.getResultCell(3, 1).should('have.text', 'xsd:nonNegativeInteger');
  });
});
