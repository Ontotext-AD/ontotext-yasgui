import {YasrPluginPageSteps} from '../../../../steps/pages/yasr-plugin-page-steps';
import {YasqeSteps} from '../../../../steps/yasqe-steps';
import {YasrSteps} from '../../../../steps/yasr-steps';

describe('YASR columns resizable functionality', () => {
  beforeEach(() => {
    YasrPluginPageSteps.visit();
  });

  it('Should disabled column resizing if there are more columns than configured', () => {
    // When execute a query that returns results with few columns.
    YasqeSteps.executeQuery();

    // I expect columns to be resizable,
    YasrSteps.getResultTableHeaderResizableElement().should('have.length.greaterThan', 0);
    // regardless if row number column is visible.
    YasrSteps.toggleHideRowNumbers()
    YasrSteps.getResultTableHeaderResizableElement().should('have.length.greaterThan', 0);
    YasrSteps.toggleHideRowNumbers();

    // When I configure the component not to be resizable when the number of result columns is less than the specified configuration value,
    YasrPluginPageSteps.configureSmallResizableColumns();
    // and execute a query.
    YasqeSteps.executeQuery();

    // Then I expect the columns not be resizable.
    YasrSteps.getResultTableHeaderResizableElement().should('have.length', 0);
    // regardless if row number is visible.
    YasrSteps.toggleHideRowNumbers();
    YasrSteps.getResultTableHeaderResizableElement().should('have.length', 0);
  });
});
