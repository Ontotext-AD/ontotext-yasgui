import {DownloadInfo, YasrPlugin} from '../../models/yasr-plugin';
import {TranslationService} from '../../services/translation.service';
import {SvgUtil} from '../../services/utils/svg-util';
import {SparqlUtils} from '../../services/utils/sparql-utils';
import {HtmlUtil} from '../../services/utils/html-util';

export class PivotTablePlugin implements YasrPlugin {

  // TODO add persistence
  // @ts-ignore
  private static readonly PERSISTENCE_ID = 'pivot';
  public static readonly PLUGIN_NAME = 'pivot-table-plugin';

  // @ts-ignore
  private yasr: Yasr;
  // @ts-ignore
  private translationService: TranslationService;

  helpReference: string;
  public label = PivotTablePlugin.PLUGIN_NAME;
  public priority = 4;
  private pluginElement: HTMLDivElement | undefined;

  // @ts-ignore
  constructor(yasr: Yasr) {
    if (yasr) {
      this.yasr = yasr;
      this.translationService = this.yasr.config.translationService;
    }
  }

  initialize(): Promise<void> {
    return new Promise(resolve => {
      HtmlUtil.loadCss('https://pivottable.js.org/dist/pivot.css');
      HtmlUtil.loadJavaScript('https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3.min.js');
      HtmlUtil.loadJavaScript('https://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.2/jquery.min.js');
      HtmlUtil.loadJavaScript('https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js');
      HtmlUtil.loadJavaScript('https://www.gstatic.com/charts/loader.js');
      HtmlUtil.loadJavaScript('https://pivottable.js.org/dist/pivot.js');
      HtmlUtil.loadJavaScript('https://pivottable.js.org/dist/d3_renderers.js');
      HtmlUtil.loadJavaScript('https://pivottable.js.org/dist/export_renderers.js');
      HtmlUtil.loadJavaScript('https://pivottable.js.org/dist/gchart_renderers.js', resolve);
    });
  }

  canHandleResults(): boolean {
    return this.yasr.results && this.yasr.results.getVariables && this.yasr.results.getVariables() && this.yasr.results.getVariables().length > 0;
  }

  draw(_persistentConfig: any, _runtimeConfig?: any): Promise<void> | void {
    this.showPlugin(this.getRenders());
    this.addUnusedVariableHeader();
    this.addColumnsHeader();
    this.addValuesHeader();
    this.addRowsHeader();
    this.updateVariablesElement();
  }

  getIcon(): Element | undefined {
    const icon = document.createElement('div');
    icon.innerHTML = SvgUtil.getPivotTableIconSvgTag();
    return icon;
  }

  destroy(): void {
    // TODO remove all listeners if any.
  }

  download(_filename?: string): DownloadInfo | undefined {

    const pivotTableTableElement = this.yasr.rootEl.querySelector(`.${PivotTablePlugin.PLUGIN_NAME}`);
    // @ts-ignore
    const options = $.data(pivotTableTableElement, 'pivotUIOptions');

    if (options) {
      switch (options.rendererName) {
        case PivotTableRendererName.TSV_EXPORT:
          return this.getTSVDownloadInfo(options);
        case PivotTableRendererName.TABLE:
        case PivotTableRendererName.TABLE_BARCHART:
        case PivotTableRendererName.HEATMAP:
        case PivotTableRendererName.ROW_HEATMAP:
        case PivotTableRendererName.COL_HEATMAP:
          return this.getCSVDownloadInfo();
        case PivotTableRendererName.BAR_CHART:
        case PivotTableRendererName.LINE_CHART:
        case PivotTableRendererName.STACKED_BAR_CHART:
        case PivotTableRendererName.AREA_CHART:
        case PivotTableRendererName.SCATTER_CHART:
          return this.getSvgDownloadInfo(options);
      }
    }

    return;
  }

  private getSvgDownloadInfo(_options): DownloadInfo | undefined {
    return {
      contentType: "image/svg+xml",
      filename: "queryResults.svg",
      getData: () => {

        // TODO after persistence try to use the render instead  loading from the DOM.
        // const svgEl = this.getRenderedElement(options).find('svg')[0];
        const svgEl = this.yasr.rootEl.querySelector('.pvtRendererArea svg');
        return svgEl.outerHTML;
      }
    };
  }

  private getTSVDownloadInfo(_options): DownloadInfo | undefined {
    return {
      contentType: "text/tsv",
      filename: "queryResults.tsv",
      getData: () => {
        // TODO after persistence try to use the render instead loading from the DOM.
        // return this.getRenderedElement(options).html();
        return this.yasr.rootEl.querySelector('.pvtRendererArea textarea').innerHTML;
      }
    };
  }

  private getCSVDownloadInfo(): DownloadInfo | undefined {
    return {
      contentType: "text/csv",
      filename: "queryResults.csv",
      getData: () => HtmlUtil.tableToCsv(this.yasr.rootEl.querySelector('.pvtRendererArea table'))
    };
  }

  // @ts-ignore
  private getRenderedElement(options) {
    const input = (callback) => this.getResults(callback);
    // @ts-ignore
    const pivotData = $.pivotUtilities.PivotData;
    const materializedInput = [];
    pivotData.forEachRecord(input, options.derivedAttributes, function (record) {
      materializedInput.push(record);
    });

    return options.renderers[options.rendererName](new pivotData(materializedInput, options));
  }

  private getRenders(): any {
    // @ts-ignore
    return $.extend(true, $.pivotUtilities.renderers, $.pivotUtilities.d3_renderers, $.pivotUtilities.gchart_renderers, $.pivotUtilities.export_renderers);
  }

  private showPlugin(renderers) {
    this.pluginElement = document.createElement("div");
    this.pluginElement.className = PivotTablePlugin.PLUGIN_NAME;
    this.yasr.resultsEl.appendChild(this.pluginElement);

    // @ts-ignore
    google.load("visualization", "1", {packages: ["corechart", "charteditor"]});

    // @ts-ignore
    $(this.yasr.rootEl.querySelector(`.${PivotTablePlugin.PLUGIN_NAME}`))
      .pivotUI((callback) => this.getResults(callback), {renderers});
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
    unusedVariablesHeaderElement.innerText = this.yasr.translationService.translate('Available Variables');
    unusedVariablesContainer.prepend(unusedVariablesHeaderElement);
  }

  private addColumnsHeader(): void {
    const columnsContainer = this.pluginElement.querySelector('.pvtCols');
    columnsContainer.classList.add('pivottable-plugin-columns');
    const columnsHeaderElement = document.createElement('div');
    columnsHeaderElement.classList.add('pivottable-plugin-columns-header');
    columnsHeaderElement.innerText = this.yasr.translationService.translate('Columns');
    columnsContainer.prepend(columnsHeaderElement);
  }

  private addValuesHeader(): void {
    const valuesContainer = this.pluginElement.querySelector('.pvtVals');
    valuesContainer.classList.add('pivottable-plugin-values');
    const valuesHeaderElement = document.createElement('div');
    valuesHeaderElement.classList.add('pivottable-plugin-values-header');
    valuesHeaderElement.innerText = this.yasr.translationService.translate('Cells');
    valuesContainer.prepend(valuesHeaderElement);
  }

  private addRowsHeader(): void {
    const rowsContainer = this.pluginElement.querySelector('.pvtRows');
    rowsContainer.classList.add('pivottable-plugin-rows');
    const rowsHeaderElement = document.createElement('div');
    rowsHeaderElement.classList.add('pivottable-plugin-rows-header');
    rowsHeaderElement.innerText = this.yasr.translationService.translate('Rows');
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

    //SvgUtil.getPivotTableValueIcon()
  }
}

export enum PivotTableRendererName {
  TABLE = 'Table',
  TABLE_BARCHART = 'Table Barchart',
  HEATMAP = 'Heatmap',
  ROW_HEATMAP = 'Row Heatmap',
  COL_HEATMAP = 'Col Heatmap',
  TREEMAP = 'Treemap',
  LINE_CHART = 'Line Chart',
  BAR_CHART = 'Bar Chart',
  STACKED_BAR_CHART = 'Stacked Bar Chart',
  AREA_CHART = 'Area Chart',
  SCATTER_CHART = 'Scatter Chart',
  TSV_EXPORT = 'TSV Export'
}
