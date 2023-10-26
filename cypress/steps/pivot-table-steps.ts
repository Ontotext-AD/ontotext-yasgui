export class PivotTableSteps {

  static readonly ROWS_CONTAINER_SELECTOR = '.pvtRows';
  static readonly COLS_CONTAINER_SELECTOR = '.pvtCols';

  static getPivotTablePlugin() {
    return cy.get('.pivot-table-plugin');
  }

  static getPivotTableUIPlugin() {
    return PivotTableSteps.getPivotTablePlugin().find('.pvtUi');
  }

  static getUnusedVariablesContainer() {
    return PivotTableSteps.getPivotTableUIPlugin().find('.pvtUnused');
  }

  static getUnusedVariable(variableName: string) {
    return PivotTableSteps.getUnusedVariablesContainer().find('.pvtAttr').contains(variableName);
  }

  static getRowsContainer() {
    return PivotTableSteps.getPivotTableUIPlugin().find(PivotTableSteps.ROWS_CONTAINER_SELECTOR);
  }

  static getColsContainer() {
    return PivotTableSteps.getPivotTableUIPlugin().find(PivotTableSteps.COLS_CONTAINER_SELECTOR);
  }

  static getResultArea() {
    return PivotTableSteps.getPivotTableUIPlugin().find('.pvtRendererArea');
  }

  static verifyRowVariable(rowNumber: number, variableName: string) {
    return PivotTableSteps.getResultArea().find('tbody tr th').eq(rowNumber).should('have.text', variableName);
  }

  static verifyColVariable(rowNumber: number, variableName: string) {
    return PivotTableSteps.getResultArea().find('thead tr th').eq(rowNumber).should('have.text', variableName);
  }
}
