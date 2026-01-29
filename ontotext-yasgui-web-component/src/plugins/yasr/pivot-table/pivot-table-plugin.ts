import {DownloadInfo, YasrPlugin} from '../../../models/yasr-plugin';
import {TranslationService} from '../../../services/translation.service';
import {SvgUtil} from '../../../services/utils/svg-util';
import {SparqlUtils} from '../../../services/utils/sparql-utils';
import {HtmlUtil} from '../../../services/utils/html-util';
import {PivotTableDownloadUtil} from './pivot-table-download-util';
import {
  PivotTableConfig,
  PivotTablePersistentConfig
} from '../../../models/plugins/pivot-table/pivot-table-persistent-config';
import {D3_7_8_5_RENDER} from './d3_7_8_5_renders';
import {PivotTableService} from '../../../services/plugins/pivot-table-service';
import {PivotTableRenderer} from '../../../models/plugins/pivot-table/pivot-table-renderer';
import {ObjectUtil} from '../../../services/utils/object-util';
import {PivotTableRendererType} from '../../../models/plugins/pivot-table/pivot-table-renderer-type';
import { ExplainPlanUtil } from '../../../services/utils/explain-plan-util';

const NOT_TRANSLATED_RENDERERS_TYPES: string[] = [
  PivotTableRendererType.TREEMAP,
  PivotTableRendererType.LINE_CHART,
  PivotTableRendererType.BAR_CHART,
  PivotTableRendererType.STACKED_BAR_CHART,
  PivotTableRendererType.AREA_CHART,
  PivotTableRendererType.SCATTER_CHART,
  PivotTableRendererType.TSV_EXPORT
]

const PIVOT_TABLE_SUPPORTED_LANGUAGES = ['cs', 'da', 'de', 'es', 'fr', 'jp', 'nl', 'pl', 'pt', 'ru', 'sq', 'tr', 'zh'];

export class PivotTablePlugin implements YasrPlugin {

  // TODO add persistence
  // @ts-ignore
  private static readonly PERSISTENCE_ID = 'pivot';
  public static readonly PLUGIN_NAME = 'pivot-table-plugin';

  // @ts-ignore
  private yasr: Yasr;
  private pivotTableService: PivotTableService;
  private translationService: TranslationService;
  private readonly currentLanguage: string;

  helpReference: string;
  public label = PivotTablePlugin.PLUGIN_NAME;
  public priority = 4;
  private pluginElement: HTMLDivElement | undefined;

  // @ts-ignore
  constructor(yasr: Yasr) {
    if (yasr) {
      this.yasr = yasr;
      this.translationService = this.yasr.config.translationService;
      this.currentLanguage = this.translationService.getLanguage();
      this.pivotTableService = new PivotTableService(this.translationService);
    }
  }

  initialize(): Promise<void> {
    return new Promise(resolve => {
      HtmlUtil.loadCss('https://pivottable.js.org/dist/pivot.css');
      HtmlUtil.loadJavaScript('https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js');
      HtmlUtil.loadJavaScript('https://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.2/jquery.min.js');
      HtmlUtil.loadJavaScript('https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js');
      HtmlUtil.loadJavaScript('https://www.gstatic.com/charts/loader.js');
      HtmlUtil.loadJavaScript('https://pivottable.js.org/dist/pivot.js');
      if (PIVOT_TABLE_SUPPORTED_LANGUAGES.includes(this.currentLanguage)) {
        HtmlUtil.loadJavaScript(`https://pivottable.js.org/dist/pivot.${this.currentLanguage}.js`);
      }
      HtmlUtil.loadJavaScript('https://pivottable.js.org/dist/export_renderers.js');
      HtmlUtil.loadJavaScript('https://pivottable.js.org/dist/gchart_renderers.js', () => {
        D3_7_8_5_RENDER.register();
        this.setupRenderers();
        this.setupAggregators();
        resolve();
      });
    });
  }

  canHandleResults(): boolean {
    const results = this.yasr?.results;
    const isExplain = ExplainPlanUtil.isExplainResults(results);

    const variables = results?.getVariables?.();
    return variables?.length > 0 && !isExplain;
  }

  draw(persistentConfig: PivotTablePersistentConfig, _runtimeConfig?: any): Promise<void> | void {
    // @ts-ignore
    // if Google module visualization is loaded then we can continue with drawing.
    if (google.visualization) {
      this.drawPivotTable(persistentConfig);
    } else {
      // @ts-ignore
      google.charts.load('current', {packages: ['corechart', 'charteditor'], language: this.currentLanguage});
      // If the render is a Google chart we have to wait the module to be loaded.
      if (persistentConfig && persistentConfig.rendererType && this.isGoogleChartRender(this.pivotTableService.getPivotRendererByType(persistentConfig.rendererType))) {
        // @ts-ignore
        google.setOnLoadCallback(() => {
          this.drawPivotTable(persistentConfig);
        });
      } else {
        // If the render is not a Google chart or the Google we can continue with drawing.
        this.drawPivotTable(persistentConfig);
      }
    }
  }

  private drawPivotTable(persistentConfig: PivotTablePersistentConfig) {
    const config: PivotTableConfig = {...persistentConfig}
    config.onRefresh = this.onRefresh();
    config.rendererName = config.rendererType ? this.pivotTableService.getPivotRendererByType(config.rendererType).name : undefined;
    config.aggregatorName = config.aggregatorType ? this.pivotTableService.getPivotTableAggregatorByType(config.aggregatorType).name : undefined;
    this.showPlugin(config);
    this.addUnusedVariableHeader();
    this.addColumnsHeader();
    this.addValuesHeader();
    this.addRowsHeader();
    this.updateVariablesElement();
  }

  private isGoogleChartRender(renderer: PivotTableRenderer) {
    if (!renderer) {
      return false;
    }
    switch (renderer.type) {
      case PivotTableRendererType.BAR_CHART:
      case PivotTableRendererType.LINE_CHART:
      case PivotTableRendererType.STACKED_BAR_CHART:
      case PivotTableRendererType.AREA_CHART:
      case PivotTableRendererType.SCATTER_CHART:
        return true;
    }
    return false;
  }

  getIcon(): Element | undefined {
    const icon = document.createElement('div');
    icon.innerHTML = SvgUtil.getPivotTableIconSvgTag();
    return icon;
  }

  destroy(): void {
    // TODO remove all listeners if any.
    const configButtonWrapper = this.yasr.rootEl.querySelector('.yasr_header .chart-config-control');
    configButtonWrapper?.remove();
  }

  download(_filename?: string): DownloadInfo | undefined {
    // @ts-ignore
    const options = $(this.yasr.rootEl.querySelector(`.${PivotTablePlugin.PLUGIN_NAME}`)).data('pivotUIOptions');
    if (options) {
      switch (this.pivotTableService.getPivotRendererByName(options.rendererName).type) {
        case PivotTableRendererType.TSV_EXPORT:
          return PivotTableDownloadUtil.getTSVDownloadInfo(this.yasr);
        case PivotTableRendererType.TABLE:
        case PivotTableRendererType.TABLE_BARCHART:
        case PivotTableRendererType.HEATMAP:
        case PivotTableRendererType.ROW_HEATMAP:
        case PivotTableRendererType.COL_HEATMAP:
          return PivotTableDownloadUtil.getCSVDownloadInfo(this.yasr);
        case PivotTableRendererType.BAR_CHART:
        case PivotTableRendererType.LINE_CHART:
        case PivotTableRendererType.STACKED_BAR_CHART:
        case PivotTableRendererType.AREA_CHART:
        case PivotTableRendererType.SCATTER_CHART:
          return PivotTableDownloadUtil.getSvgDownloadInfo(this.yasr);
      }
    }
    return;
  }

  private setupRenderers(): void {
    this.translateRenders();
    this.sortRenderers();
  }

  /**
   * Pivot table has support for translation of renderers that are loaded by default. For additional renderers, we have to translate them ourselves.
   */
  private translateRenders(): void {
    // @ts-ignore
    const renderers = $.extend(true, $.pivotUtilities[D3_7_8_5_RENDER.RENDER_NAME], $.pivotUtilities.gchart_renderers, $.pivotUtilities.export_renderers);
    NOT_TRANSLATED_RENDERERS_TYPES.forEach((rendererType: string) => {
      const renderer = this.pivotTableService.getPivotRendererByType(rendererType);
      const rendererEnName = this.pivotTableService.getPivotTableRenderName(rendererType, 'en');
      if (renderer) {
        // @ts-ignore
        $.pivotUtilities.locales[this.currentLanguage].renderers[renderer.name] = renderers[rendererEnName];
      } else {
        console.log(`Missing translation for renderer: [${rendererType}] The default will be used!`);
        // @ts-ignore
        $.pivotUtilities.locales[this.currentLanguage].renderers[renderer] = renderers[rendererEnName];
      }
    });
  }

  /**
   * Sorts renderers.
   */
  private sortRenderers(): void {
    // @ts-ignore
    $.pivotUtilities.locales[this.currentLanguage].renderers = ObjectUtil.orderObjectByKey($.pivotUtilities.locales[this.currentLanguage].renderers, this.pivotTableService.getPivotTableRenderersCompareByNameFunction());
  }

  private setupAggregators() {
    if ('fr' === this.currentLanguage) {
      this.addMissedFrenchAggregators();
    }
    this.sortAggregators();
  }

  /**
   * Sorts aggregators.
   */
  private sortAggregators(): void {
    // @ts-ignore
    $.pivotUtilities.locales[this.currentLanguage].aggregators = ObjectUtil.orderObjectByKey($.pivotUtilities.locales[this.currentLanguage].aggregators, this.pivotTableService.getPivotTableAggregatorsCompareByNameFunction());
  }

  /**
   * The French pivot table is missing the 'Median', 'Sample Variance', and 'Sample Standard Deviation' aggregators.
   * This function adds these aggregators to the French locale object.
   */
  private addMissedFrenchAggregators() {
    // @ts-ignore
    const frFmt = $.pivotUtilities.numberFormat({
      thousandsSep: " ",
      decimalSep: ","
    });

    // @ts-ignore
    $.pivotUtilities.locales[this.currentLanguage].aggregators[this.translationService.translate(PivotTableService.AGGREGATOR_NAME_PREFIX + 'MEDIAN')] = $.pivotUtilities.aggregatorTemplates.median(frFmt);
    // @ts-ignore
    $.pivotUtilities.locales[this.currentLanguage].aggregators[this.translationService.translate(PivotTableService.AGGREGATOR_NAME_PREFIX + 'SAMPLE_VARIANCE')] = $.pivotUtilities.aggregatorTemplates["var"](1, frFmt);
    // @ts-ignore
    $.pivotUtilities.locales[this.currentLanguage].aggregators[this.translationService.translate(PivotTableService.AGGREGATOR_NAME_PREFIX + 'SAMPLE_STANDARD_DEVIATION')] = $.pivotUtilities.aggregatorTemplates.stdev(1, frFmt);
  }

  private showPlugin(config: PivotTableConfig) {
    this.pluginElement = document.createElement("div");
    this.pluginElement.className = PivotTablePlugin.PLUGIN_NAME;
    this.yasr.resultsEl.appendChild(this.pluginElement);
    // @ts-ignore
    $(this.yasr.rootEl.querySelector(`.${PivotTablePlugin.PLUGIN_NAME}`))
      .pivotUI((callback) => this.getResults(callback), config, false, this.currentLanguage);
  }

  /**
   * This function transforms Yasr results into the input type expected by the PivotTable. It is called to fetch all values that need to be populated.
   *
   * @param callback - a callback function that should be called for each result binding. The function's parameter should be an object containing variables as keys and results as values
   *
   *     .
   * For example, if we have a result with two bindings and variables 's', 'p' and 'o', then <code>callback</code> will be called twice, once per
   * binding.
   * First call have to be with parameter the object:
   * {
   *   s: <value of s from first result>,
   *   p: <value of p from first result>,
   *   o: <value of o from first result>
   * }
   *
   * and the second call have to be with parameter the object:
   *    * {
   *   s: <value of s from second result>,
   *   p: <value of p from second result>,
   *   o: <value of o from second result>
   * }
   *
   */
  private getResults(callback) {
    const variables = this.yasr.results.getVariables();
    const usedPrefixes = this.yasr.getPrefixes();
    this.yasr.results.getBindings()
      .forEach((binding) => {
        callback(this.getResult(variables, binding, usedPrefixes));
      });
  }

  private getResult(variables, binding, usedPrefixes) {
    const rowObj = {};
    variables.forEach((variable) => {
      rowObj[variable] = this.getResultValue(variable, binding, usedPrefixes);
    });
    return rowObj;
  }

  private getResultValue(variable, binding, usedPrefixes): string | null {
    if (variable in binding) {
      const bindingElement = binding[variable];
      const value = bindingElement.value;
      return bindingElement.type === "uri" ? SparqlUtils.uriToPrefixWithLocalName(value, usedPrefixes) : value;
    }
    return null;
  }

  private addUnusedVariableHeader(): void {
    const unusedVariablesContainer = this.pluginElement.querySelector('.pvtUnused');
    unusedVariablesContainer.classList.add('pivottable-plugin-unused-variables');
    const unusedVariablesHeaderElement = document.createElement('div');
    unusedVariablesHeaderElement.classList.add('pivottable-plugin-unused-variables-header');
    unusedVariablesHeaderElement.innerText = this.yasr.translationService.translate('yasr.plugin_control.plugin.name.pivot-table-plugin.available_variables');
    unusedVariablesContainer.prepend(unusedVariablesHeaderElement);
  }

  private addColumnsHeader(): void {
    const columnsContainer = this.pluginElement.querySelector('.pvtCols');
    columnsContainer.classList.add('pivottable-plugin-columns');
    const columnsHeaderElement = document.createElement('div');
    columnsHeaderElement.classList.add('pivottable-plugin-columns-header');
    columnsHeaderElement.innerText = this.yasr.translationService.translate('yasr.plugin_control.plugin.name.pivot-table-plugin.columns');
    columnsContainer.prepend(columnsHeaderElement);
  }

  private addValuesHeader(): void {
    const valuesContainer = this.pluginElement.querySelector('.pvtVals');
    valuesContainer.classList.add('pivottable-plugin-values');
    const valuesHeaderElement = document.createElement('div');
    valuesHeaderElement.classList.add('pivottable-plugin-values-header');
    valuesHeaderElement.innerText = this.yasr.translationService.translate('yasr.plugin_control.plugin.name.pivot-table-plugin.cells');
    valuesContainer.prepend(valuesHeaderElement);
  }

  private addRowsHeader(): void {
    const rowsContainer = this.pluginElement.querySelector('.pvtRows');
    rowsContainer.classList.add('pivottable-plugin-rows');
    const rowsHeaderElement = document.createElement('div');
    rowsHeaderElement.classList.add('pivottable-plugin-rows-header');
    rowsHeaderElement.innerText = this.yasr.translationService.translate('yasr.plugin_control.plugin.name.pivot-table-plugin.rows');
    rowsContainer.prepend(rowsHeaderElement);
  }

  private updateVariablesElement() {
    this.pluginElement.querySelectorAll('.pvtAttr')
      .forEach((variableElement) => this.updateVariableElement(variableElement));
  }

  private updateVariableElement(variableElement: Element) {
    variableElement.classList.add('povottable-plugin-variable');
    const dropdownElement = variableElement.querySelector('.pvtTriangle');
    const icon = document.createElement('div');
    icon.classList.add('pivottable-plugin-variable-icon');
    icon.innerHTML = SvgUtil.getPivotTableValueIcon();
    variableElement.insertBefore(icon, dropdownElement);
  }

  private onRefresh(): (pivotUIOptions) => void {
    return (pivotUIOptions) => {
      if (pivotUIOptions) {
        switch (this.pivotTableService.getPivotRendererByName(pivotUIOptions.rendererName).type) {
          case PivotTableRendererType.BAR_CHART:
          case PivotTableRendererType.LINE_CHART:
          case PivotTableRendererType.STACKED_BAR_CHART:
          case PivotTableRendererType.AREA_CHART:
          case PivotTableRendererType.SCATTER_CHART:
            this.addChartConfigButton();
            break;
          default:
            this.removeChartConfigButton();
        }
      }
      // FIX ME: When a chart renderer is selected and configured using the Google Chart Editor (by double-clicking on the SVG or clicking on 'Chart Config'),
      // the configuration is not persisted.
      this.yasr.storePluginConfig(PivotTablePlugin.PLUGIN_NAME, this.toPivotTablePersistentConfig(pivotUIOptions));
    }
  }

  private removeChartConfigButton() {
    const element = this.yasr.resultsEl.parentElement.querySelector('#openPivotTableChartConfigBtn');
    if (!element) {
      return;
    }
    element.remove();
  }

  private addChartConfigButton() {
    if (this.yasr.resultsEl.parentElement.querySelector('#openPivotTableChartConfigBtn')) {
      return;
    }
    const openConfigButton = document.createElement('button');
    openConfigButton.id = 'openPivotTableChartConfigBtn';
    openConfigButton.innerHTML = this.translationService.translate("yasr.plugin_control.plugin.charts.config.button");
    openConfigButton.addEventListener('click', () => {
      // @ts-ignore
      $(this.yasr.rootEl.querySelector(`.${PivotTablePlugin.PLUGIN_NAME}`)).find('div[dir="ltr"]').dblclick();
    });
    // Wrap it in a div so that it can be easily styled without clashing with the header layout styles
    const buttonWrapper = document.createElement('div');
    buttonWrapper.classList.add('chart-config-control');
    buttonWrapper.prepend(openConfigButton);
    const infoContainer = this.yasr.resultsEl.parentElement.querySelector('.yasr_header .space_element');
    infoContainer.insertAdjacentElement('beforebegin', buttonWrapper);
  }

  private toPivotTablePersistentConfig(pivotUIOptions): PivotTablePersistentConfig {
    return {
      cols: pivotUIOptions.cols,
      rows: pivotUIOptions.rows,
      colOrder: pivotUIOptions.colOrder,
      rowOrder: pivotUIOptions.rowOrder,
      vals: pivotUIOptions.vals,
      exclusions: pivotUIOptions.exclusions,
      inclusions: pivotUIOptions.inclusions,
      inclusionsInfo: pivotUIOptions.inclusionsInfo,
      aggregatorType: this.pivotTableService.getPivotTableAggregatorByName(pivotUIOptions.aggregatorName).type,
      rendererType: this.pivotTableService.getPivotRendererByName(pivotUIOptions.rendererName).type
    };
  }
}
