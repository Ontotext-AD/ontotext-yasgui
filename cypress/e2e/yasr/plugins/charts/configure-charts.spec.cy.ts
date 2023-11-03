import {YasrChartsPluginPageSteps} from "../../../../steps/pages/yasr-charts-plugin-page-steps";
import {YasrSteps} from "../../../../steps/yasr-steps";
import {YasqeSteps} from "../../../../steps/yasqe-steps";
import {ChartsStubs} from "../../../../stubs/charts-stubs";
import {GoogleChartsConfigSteps} from "../../../../steps/google-charts-config-steps";
import {YasguiSteps} from "../../../../steps/yasgui-steps";

describe('Plugin: Charts', () => {

  beforeEach(() => {
    ChartsStubs.stubLoader();
    ChartsStubs.stub_jsapi_compiled_annotatedtimeline_module();
    ChartsStubs.stub_jsapi_compiled_annotationchart_module();
    ChartsStubs.stub_jsapi_compiled_charteditor_module();
    ChartsStubs.stub_jsapi_compiled_controls_module();
    ChartsStubs.stub_jsapi_compiled_corechart_module();
    ChartsStubs.stub_jsapi_compiled_default_module();
    ChartsStubs.stub_jsapi_compiled_flashui_module();
    ChartsStubs.stub_jsapi_compiled_gauge_module();
    ChartsStubs.stub_jsapi_compiled_geo_module();
    ChartsStubs.stub_jsapi_compiled_geochart_module();
    ChartsStubs.stub_jsapi_compiled_graphics_module();
    ChartsStubs.stub_jsapi_compiled_imagechart_module();
    ChartsStubs.stub_jsapi_compiled_motionchart_module();
    ChartsStubs.stub_jsapi_compiled_orgchart_module();
    ChartsStubs.stub_jsapi_compiled_table_module();
    ChartsStubs.stub_jsapi_compiled_ui_module();

    // Given I have opened a page with the editor
    YasrChartsPluginPageSteps.visit();
  });

  it('Should render results in a datatable by default', () => {
    // When I open the yasr charts tab
    YasrSteps.openChartsTab();
    // Then I should not see results
    YasrSteps.getRawResults().should('be.empty');
    // And I should not see the chart config button
    YasrSteps.getGoogleChartConfigButton().should('not.exist');
    // When I execute a query
    YasqeSteps.executeQuery();
    // Then I should see results in a datatable
    // TODO: check for rows and columns?
    YasrSteps.getGoogleDataTable().should('be.visible');
    // And I should see the chart config button
    YasrSteps.getGoogleChartConfigButton().should('be.visible');
  });

  it('Should be able to configure a chart', () => {
    configurePieChart();
    // Then I expect to see the pie chart rendered in the results
    YasrSteps.getGoogleChartVisualization().should('be.visible');
    // And the config chart button should still be visible
    YasrSteps.getGoogleChartConfigButton().should('be.visible');
    // And I can switch to another chart type
    configureLineChart();
  });

  it('Should persist chart data and configuration', () => {
    // Given I have configured a pie chart
    configurePieChart();
    // When I switch to another renderer
    YasrSteps.openRawResponseTab();
    // And I switch back to the charts tab
    YasrSteps.openChartsTab();
    // Then I expect to see the configured pie chart again
    YasrSteps.getGoogleChartVisualization().should('be.visible');
    verifyChartState('/charts/pie-chart-state');
    // When I configure a line chart
    configureLineChart();
    // And I switch again to another yasr tab
    YasrSteps.openRawResponseTab();
    // And I switch back to the charts tab
    YasrSteps.openChartsTab();
    // Then I expect to see the configured line chart again
    YasrSteps.getGoogleChartVisualization().should('be.visible');
    verifyChartState('/charts/line-chart-state');
    // When I open another editor tab
    YasguiSteps.openANewTab();
    // And I configure different visualization
    YasqeSteps.executeQuery(1);
    YasrSteps.getTableResults(1).should('have.length', 8);
    // And I go back to the previous yasgui tab
    YasguiSteps.openTab(0);
    // Then I expect the chart to be rendered again
    YasrSteps.getGoogleChartVisualization().should('be.visible');
    verifyChartState('/charts/line-chart-state');
  });
});

function verifyChartState(fixturePath: string) {
  cy.getAllLocalStorage().then((result: any) => {
    let domain = Cypress.config('baseUrl');
    domain = domain.substring(0, domain.length - 1)
    let pluginConfig = result[domain]['yagui__yasr-plugins'];
    pluginConfig = JSON.parse(pluginConfig);
    pluginConfig = pluginConfig.val;
    const activeTab = pluginConfig.active;
    const tab = pluginConfig.tabConfig[activeTab];
    const tabPlugins = tab.yasr.settings.pluginsConfig;
    cy.fixture(fixturePath).then((fixture) => {
      expect(tabPlugins.charts.chartState).to.equal(fixture)
    });
  })
}

function configurePieChart() {
  // And I have opened the yasr charts tab
  YasrSteps.openChartsTab();
  // And I have results
  YasqeSteps.executeQuery();
  YasrSteps.getGoogleDataTable().should('be.visible');
  // When I click on chart config button
  YasrSteps.openGoogleChartsConfig();
  // Then I expect to see the chart config dialog
  GoogleChartsConfigSteps.getConfigDialog().should('be.visible');
  // When I select the pie chart type
  GoogleChartsConfigSteps.selectPieChart();
  GoogleChartsConfigSteps.getPieChartPreview().should('be.visible');
  // And I confirm
  GoogleChartsConfigSteps.getConfirmSelectedChartButton().should('be.visible');
  GoogleChartsConfigSteps.confirmSelectedChart();
}

function configureLineChart() {
  YasrSteps.openGoogleChartsConfig();
  GoogleChartsConfigSteps.getConfigDialog().should('be.visible');
  GoogleChartsConfigSteps.selectLineChart();
  GoogleChartsConfigSteps.getPieChartPreview().should('be.visible');
  GoogleChartsConfigSteps.getConfirmSelectedChartButton().should('be.visible');
  GoogleChartsConfigSteps.confirmSelectedChart();
  YasrSteps.getGoogleChartVisualization().should('be.visible');
}
