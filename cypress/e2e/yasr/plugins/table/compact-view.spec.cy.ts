import {QueryStubs} from "../../../../stubs/query-stubs";
import {YasqeSteps} from "../../../../steps/yasqe-steps";
import {YasrSteps} from "../../../../steps/yasr-steps";
import {YasrTablePluginSteps} from "../../../../steps/yasr-table-plugin-steps";
import {CompactViewPageSteps} from "../../../../steps/pages/compact-view-page-steps";

describe('Compact view', () => {
  beforeEach(() => {
    CompactViewPageSteps.visit();
    QueryStubs.stubManyColumnResult();
  });

  it('Should expand the literal when it is collapsed and the user clicks on it', () => {
    // When execute a query that returns literals.
    YasqeSteps.executeQuery();

    // Then I expect the literals not to be truncated with ellipses.
    YasrSteps.getResultCell(0, 1).find('p').then(($element) => cy.assertEllipsisNotActive($element[0]));
    YasrSteps.getResultCell(0, 2).find('p').then(($element) => cy.assertEllipsisNotActive($element[0]));
    YasrSteps.getResultCell(0, 3).find('a').then(($element) => cy.assertEllipsisNotActive($element[0]));
    YasrSteps.getResultCell(0, 4).find('p').then(($element) => cy.assertEllipsisNotActive($element[0]));

    // When I switch on "Compact view".
    YasrTablePluginSteps.getCompactViewCheckbox().click();

    // Then I expect the literals to be truncated with ellipses.
    YasrSteps.getResultCell(0, 1).find('p').then(($element) => cy.assertEllipsisActive($element[0]));
    YasrSteps.getResultCell(0, 2).find('p').then(($element) => cy.assertEllipsisActive($element[0]));
    YasrSteps.getResultCell(0, 3).find('a').then(($element) => cy.assertEllipsisActive($element[0]));
    YasrSteps.getResultCell(0, 4).find('p').then(($element) => cy.assertEllipsisActive($element[0]));


    // When I click on first cell with truncated value.
    YasrSteps.getResultCell(0, 1).click();

    // Then I expect only first cell to be expanded.
    YasrSteps.getResultCell(0, 1).find('p').then(($element) => cy.assertEllipsisNotActive($element[0]));
    YasrSteps.getResultCell(0, 2).find('p').then(($element) => cy.assertEllipsisActive($element[0]));
    YasrSteps.getResultCell(0, 3).find('a').then(($element) => cy.assertEllipsisActive($element[0]));
    YasrSteps.getResultCell(0, 4).find('p').then(($element) => cy.assertEllipsisActive($element[0]));

    // When I click on fourth cell with truncated value.
    YasrSteps.getResultCell(0, 4).click();

    // Then I expect both cells to be expanded.
    YasrSteps.getResultCell(0, 1).find('p').then(($element) => cy.assertEllipsisNotActive($element[0]));
    YasrSteps.getResultCell(0, 2).find('p').then(($element) => cy.assertEllipsisActive($element[0]));
    YasrSteps.getResultCell(0, 3).find('a').then(($element) => cy.assertEllipsisActive($element[0]));
    YasrSteps.getResultCell(0, 4).find('p').then(($element) => cy.assertEllipsisNotActive($element[0]));

    // When I switch off "Compact view".
    YasrTablePluginSteps.getCompactViewCheckbox().click();

    // Then I expect all cells to be expanded.
    YasrSteps.getResultCell(0, 1).find('p').then(($element) => cy.assertEllipsisNotActive($element[0]));
    YasrSteps.getResultCell(0, 2).find('p').then(($element) => cy.assertEllipsisNotActive($element[0]));
    YasrSteps.getResultCell(0, 3).find('a').then(($element) => cy.assertEllipsisNotActive($element[0]));
    YasrSteps.getResultCell(0, 4).find('p').then(($element) => cy.assertEllipsisNotActive($element[0]));

    // When I switch on "Compact view" again.
    YasrTablePluginSteps.getCompactViewCheckbox().click();

    // Then I expect all cells be truncated with ellipsis.
    YasrSteps.getResultCell(0, 1).find('p').then(($element) => cy.assertEllipsisActive($element[0]));
    YasrSteps.getResultCell(0, 2).find('p').then(($element) => cy.assertEllipsisActive($element[0]));
    YasrSteps.getResultCell(0, 3).find('a').then(($element) => cy.assertEllipsisActive($element[0]));
    YasrSteps.getResultCell(0, 4).find('p').then(($element) => cy.assertEllipsisActive($element[0]));
  });
});
