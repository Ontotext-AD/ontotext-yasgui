import DefaultViewPageSteps from '../../../../steps/default-view-page-steps';
import {YasqeSteps} from '../../../../steps/yasqe-steps';
import {YasrSteps} from '../../../../steps/yasr-steps';
import {PivotTableStubs} from '../../../../stubs/pivot-table-stubs';
import {PivotTableSteps} from '../../../../steps/pivot-table-steps';
import {KeyboardShortcutPageSteps} from '../../../../steps/pages/keyboard-shortcut-page-steps';
import {YasrChartsPluginPageSteps} from '../../../../steps/pages/yasr-charts-plugin-page-steps';

describe('Pivot table plugin', () => {
  beforeEach(() => {
    PivotTableStubs.stubD3JavaScript();
    PivotTableStubs.stubJqueryJavaScript();
    PivotTableStubs.stubJqueryUiJavaScript();
    PivotTableStubs.stubJsapiJavaScript();
    PivotTableStubs.stubLoaderJavaScript();
    PivotTableStubs.stubPivotJavaScript();
    DefaultViewPageSteps.visit();
  });

  it('should show table with query data', () => {
    // When I am on page with ontotext-web-component on it,
    // and execute a query
    YasqeSteps.executeQuery();

    // Then I expect the "Pivot table" tab to be visible.
    YasrSteps.getPivotTablePluginTab().should('be.visible');

    // When I open "Pivot Table" plugin
    YasrSteps.openPivotPluginTab();

    // Then I expect to see the pivot table
    PivotTableSteps.getPivotTableUIPlugin().should('be.visible');

    // When I drag the subject into rows container
    PivotTableSteps.getUnusedVariable('s').drag(PivotTableSteps.ROWS_CONTAINER_SELECTOR, {force: true});
    // and drag object into columns container
    PivotTableSteps.getUnusedVariable('o').drag(PivotTableSteps.COLS_CONTAINER_SELECTOR, {force: true});

    // Then I expect result to be shown into result area table
    PivotTableSteps.getResultArea().should('be.visible');
    PivotTableSteps.verifyRowVariable(0, 'http://example/book1');
    PivotTableSteps.verifyColVariable(2, 'A new book');
  });

  it('Should persist pivot table and configuration', () => {
    // When I am on page with ontotext-web-component on it,
    // and execute a query
    YasqeSteps.executeQuery();

    // Then I expect the "Pivot table" tab to be visible.
    YasrSteps.getPivotTablePluginTab().should('be.visible');

    // When I open "Pivot Table" plugin
    YasrSteps.openPivotPluginTab();

    // Then I expect to see the pivot table
    PivotTableSteps.getPivotTableUIPlugin().should('be.visible');

    // When I drag the subject into rows container
    PivotTableSteps.getUnusedVariable('s').drag(PivotTableSteps.ROWS_CONTAINER_SELECTOR, {force: true});
    // and drag object into columns container
    PivotTableSteps.getUnusedVariable('o').drag(PivotTableSteps.COLS_CONTAINER_SELECTOR, {force: true});

    // Then I expect result to be shown into result area table
    PivotTableSteps.getResultArea().should('be.visible');
    PivotTableSteps.verifyRowVariable(0, 'http://example/book1');
    PivotTableSteps.verifyColVariable(2, 'A new book');

    // When switch to another render
    YasrSteps.openRawResponseTab();
    // and then returns to the "Pivot table" render.
    YasrSteps.openPivotPluginTab();

    // Then I expect table to be rendered again
    PivotTableSteps.getResultArea().should('be.visible');
    PivotTableSteps.verifyRowVariable(0, 'http://example/book1');
    PivotTableSteps.verifyColVariable(2, 'A new book');

    // When I go to another view.
    YasrChartsPluginPageSteps.visit();
    // and go back to previous page
    DefaultViewPageSteps.visit();

    // Then I expect table to be rendered again
    PivotTableSteps.getResultArea().should('be.visible');
    PivotTableSteps.verifyRowVariable(0, 'http://example/book1');
    PivotTableSteps.verifyColVariable(2, 'A new book');
  });
});
