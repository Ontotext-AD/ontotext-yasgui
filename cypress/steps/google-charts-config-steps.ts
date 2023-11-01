export class GoogleChartsConfigSteps {
  static getConfigDialog() {
    return cy.get('.google-visualization-charteditor-dialog');
  }

  static selectPieChart() {
    this.getConfigDialog().find('#google-visualization-charteditor-thumbnail-piechart').click();
    // Wait explicitly without condition because the selected chart preview is generic and we can
    // not distinguish the preview in any way and also the preview element is always present in the
    // dialog but the chart is rendered with a bit of delay.
    cy.wait(1000);
  }

  static selectLineChart() {
    this.getConfigDialog().find('#google-visualization-charteditor-thumbnail-linechart').click();
    // Wait explicitly without condition because the selected chart preview is generic and we can
    // not distinguish the preview in any way and also the preview element is always present in the
    // dialog but the chart is rendered with a bit of delay.
    cy.wait(1000);
  }

  static getConfirmSelectedChartButton() {
    return this.getConfigDialog().find('[name=ok]');
  }

  static confirmSelectedChart() {
    this.getConfirmSelectedChartButton().click();
  }

  static getPieChartPreview() {
    return this.getConfigDialog().find('#google-visualization-charteditor-preview-div-chart');
  }
}
