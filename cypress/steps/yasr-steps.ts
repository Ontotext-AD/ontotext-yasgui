export class YasrSteps {
  static getYasr(index = 0) {
    return cy.get('.yasr').eq(index);
  }

  static getResultHeader() {
    return cy.get('.yasr_header');
  }

  static getErrorHeader() {
    return cy.get('.errorHeader');
  }

  static getPluginsButtons() {
    return cy.get('.yasr_btnGroup');
  }

  static getResultsTable(yasrIndex = 0) {
    return YasrSteps.getYasr(yasrIndex).find('.yasr_results tbody');
  }
  static getResultsTableHeaders(yasrIndex = 0) {
    return YasrSteps.getYasr(yasrIndex).find('.yasr_results thead');
  }

  static getHeaderCell(columnNumber = 0, yasrIndex = 0) {
    return YasrSteps.getResultsTableHeaders(yasrIndex).find('th').eq(columnNumber);
  }

  static clickOnColumnHeader(columnNumber = 0) {
    YasrSteps.getHeaderCell(columnNumber).click();
  }

  static getTableResults(yasrIndex = 0) {
    return this.getYasr(yasrIndex).find('.yasr_results tbody').find('tr');
  }

  static getResultRow(rowNumber: number, yasrIndex = 0) {
    return this.getTableResults(yasrIndex).eq(rowNumber);
  }

  static getResultCell(rowNumber: number, cellNumber: number, yasrIndex = 0) {
    return this.getResultRow(rowNumber, yasrIndex).find('td').eq(cellNumber);
  }

  static getResultLink(rowNumber: number, cellNumber: number, yasrIndex = 0) {
    return YasrSteps.getResultCell(rowNumber, cellNumber, yasrIndex).find('a');
  }

  static getTriple(rowNumber: number, tripleNumber: 0 | 1 | 2, yasrIndex = 0) {
    return this.getResultCell(rowNumber, 1, yasrIndex).find('.triple-list').find('.uri-cell').eq(tripleNumber);
  }

  static hoverTripleResource(rowNumber: number, tripleNumber: 0 | 1 | 2, yasrIndex = 0) {
    this.getTriple(rowNumber, tripleNumber, yasrIndex).realHover();
  }

  static getTripleCopyResourceLink(rowNumber: number, tripleNumber: 0 | 1 | 2, yasrIndex = 0) {
    return this.getTriple(rowNumber, tripleNumber, yasrIndex)
      .realHover()
      .find('.resource-copy-link a');
  }

  static hoverCell(rowNumber: number, cellNumber: number, yasrIndex = 0) {
    this.getResultCell(rowNumber, cellNumber, yasrIndex).realHover();
  }

  static showSharedResourceLink(rowNumber: number, cellNumber: number, yasrIndex = 0) {
    return this.getResultCell(rowNumber, cellNumber, yasrIndex)
      .realHover()
      .find('.resource-copy-link a');
  }

  static getCopyResourceLink(rowNumber: number, cellNumber: number, yasrIndex = 0) {
    return this.getResultCell(rowNumber, cellNumber, yasrIndex)
      .find('.resource-copy-link a');
  }

  static clickOnCopyTripleLink(rowNumber: number, cellNumber: number, yasrIndex = 0) {
    this.getResultCell(rowNumber, cellNumber, yasrIndex)
      .find('.triple-open-link').eq(0)
      .realHover();

    this.getResultCell(rowNumber, cellNumber, yasrIndex)
      .find('.triple-open-link').eq(0).find('.resource-copy-link a').realClick();
  }

  static clickOnCopyResourceLink(rowNumber: number, cellNumber: number, yasrIndex = 0) {
    this.showSharedResourceLink(rowNumber, cellNumber, yasrIndex).realClick();
  }

  static clickCopyLinkDialogCloseButton() {
    this.getCopyResourceLinkDialog().find('.close-button').realClick();
  }

  static clickCopyLinkDialogCancelButton() {
    this.getCopyResourceLinkDialog().find('.cancel-button').realClick();
  }

  static clickCopyLinkDialogCopyButton() {
    this.getCopyResourceLinkDialog().find('.copy-button').realClick();
  }

  static clickOutsideCopyLinkDialog() {
    cy.get('body').click(0, 0).realClick();
  }

  static attachMessageHandler() {
    cy.get('#attachMessageHandler').realClick();
  }

  static getMessage() {
    return cy.get('#copy-resourc-link-successfully-message');
  }

  static getCopyResourceLinkDialog() {
    return cy.get('.copy-resource-link-dialog');
  }

  static getCopyResourceLinkInput() {
    return this.getCopyResourceLinkDialog().find('input');
  }

  static getResultFilter() {
    return cy.get('.tableFilter');
  }

  static switchToPlugin(pluginName: string, yasrIndex = 0) {
    YasrSteps.getYasr(yasrIndex).find(`.select_${pluginName}`).realClick();

  }

  static switchToExtendedTablePlugin(yasrIndex = 0) {
    YasrSteps.switchToPlugin('extended_table', yasrIndex);
  }

  static switchToRawResponsePlugin(yasrIndex = 0) {
    YasrSteps.switchToPlugin('extended_response', yasrIndex);
  }

  static getPagination(yasrIndex = 0) {
    return YasrSteps.getYasr(yasrIndex).find('.ontotext-pagination');
  }

  static getResponseInfo(yasrIndex = 0) {
    return YasrSteps.getYasr(yasrIndex).find('.yasr_response_chip');
  }

  static openRawResponseTab() {
    this.getYasr().find('.select_extended_response').click();
  }

  static getPivotTablePluginTab() {
    return YasrSteps.getYasr().find('.select_pivot-table-plugin');
  }

  static openPivotPluginTab() {
    YasrSteps.getPivotTablePluginTab().click();
  }

  static getRawResults() {
    return this.getYasr().find('.yasr_results');
  }

  static getRawResultsValue() {
    return this.getRawResults().find('.CodeMirror').then(($el) => {
      // @ts-ignore
      return $el[0].CodeMirror;
    }).then((cm) => {
      return cm.getValue();
    });
  }

  static getShowAllRawResponseButton() {
    return this.getRawResults().find('.overlay_btn');
  }

  static showMoreRawResponse() {
    this.getShowAllRawResponseButton().click();
  }

  static getYasrToolbar() {
    return cy.get('.yasr-toolbar');
  }

  static getResultCellLink(rowIndex: number, columnIndex: number) {
    return YasrSteps.getResultCell(rowIndex, columnIndex).find('a').eq(0);
  }

  static getResultUriCell(rowIndex: number, columnIndex: number) {
    return YasrSteps.getResultCell(rowIndex, columnIndex).find('.uri-cell');
  }

  static getResultNoUriCell(rowIndex: number, columnIndex: number) {
    return YasrSteps.getResultCell(rowIndex, columnIndex).find('.nonUri');
  }

  static getResultLiteralCell(rowIndex, columnIndex) {
    return YasrSteps.getResultCell(rowIndex, columnIndex).find('.literal-cell');
  }

  static getExtendedTableTab() {
    return YasrSteps.getResultHeader().find('.select_extended_table');
  }

  static getResponseTableTab() {
    return YasrSteps.getResultHeader().find('.select_extended_response');
  }

  static getEmptyResultElement() {
    return cy.get('.yasr_response_chip.empty');
  }

  static openChartsTab() {
    this.getYasr().find('.select_charts').click();
  }

  static getGoogleChartConfigButton() {
    return this.getYasr().find('#openChartConfigBtn');
  }

  static openGoogleChartsConfig() {
    this.getGoogleChartConfigButton().click();
  }

  static getGoogleDataTable() {
    return this.getYasr().find('.google-visualization-table-table');
  }

  static getGoogleChartVisualization() {
    return this.getYasr().find('.yasr_results svg');
  }

  static getResultTableHeaderResizableElement(yasrIndex = 0) {
    return YasrSteps.getYasr(yasrIndex).get('.grip-resizable');
  }

  static getHideRowNumbersCheckbox() {
    return YasrSteps.getYasr(0).find('.row-number-switch');
  }

  static toggleHideRowNumbers() {
    YasrSteps.getHideRowNumbersCheckbox().click();
  }

  static getLoader(index?: number) {
    return YasrSteps.getYasr(index).find('.ontotext-yasgui-loader');
  }
}
