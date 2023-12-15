import {DownloadInfo, YasrPlugin} from '../../../models/yasr-plugin';
import {TranslationService} from '../../../services/translation.service';
import {SvgUtil} from '../../../services/utils/svg-util';
import {HtmlUtil} from "../../../services/utils/html-util";
import {SparqlUtils} from "../../../services/utils/sparql-utils";
import {Yasr} from "../../../models/yasgui/yasr";

export interface PluginConfig {
  width: string;
  height: string;
}

export interface ChartsPersistentConfig {
  chartState: any;
  chartOptions: any;
}

export class ChartsPlugin implements YasrPlugin {
  private config: PluginConfig;
  // @ts-ignore
  private yasr: Yasr;
  // @ts-ignore
  private translationService: TranslationService;
  private chartEditor = null;
  private wrapper = null;
  private chartEditorOkHandler = undefined;
  protected persistentConfig = {} as ChartsPersistentConfig;
  private unsubscribeFromLanguageChange: () => void;

  helpReference: string;
  public static readonly PLUGIN_NAME = 'charts';
  public label = "charts";
  public priority = 3;
  public static defaults: PluginConfig = {
    width: '100%',
    height: '600px'
  }

  constructor(yasr: Yasr) {
    if (yasr) {
      this.yasr = yasr;
      this.translationService = this.yasr.config.translationService;
    }
    this.config = ChartsPlugin.defaults;
  }

  onLanguageChange(_currentLang): void {
    this.yasr.resultsEl.parentElement.querySelector('.chart-config-control button').innerHTML = this.translateConfigButtonTitle();

    HtmlUtil.removeAllJavaScriptsThatMatch('https://www.gstatic');
    HtmlUtil.removeAllStyleSheetsThatMatch('https://www.gstatic');
    this.init(true);
  }

  canHandleResults(): boolean {
    return !!this.yasr.results && this.yasr.results.getVariables() && this.yasr.results.getVariables().length > 0;
  }

  initialize(): Promise<void> {
    this.unsubscribeFromLanguageChange = this.translationService.subscribeForLanguageChange({
      name: 'GoogleCharts',
      notify: (currentLang) => this.onLanguageChange(currentLang)
    });
    HtmlUtil.removeAllJavaScriptsThatMatch('https://www.gstatic');
    HtmlUtil.removeAllStyleSheetsThatMatch('https://www.gstatic');
    return this.init(false);
  }

  private init(shouldReload: boolean): Promise<void> {
    return new Promise<void>((resolve) => {
      HtmlUtil.loadJavaScript('https://www.gstatic.com/charts/loader.js', () => {
        let currentLang = this.translationService.getCurrentLang();
        // @ts-ignore
        google.charts.load('current', {
          packages: ['charteditor'],
          language: currentLang
        }).then(resolve);
      }, false, shouldReload);
    });
  }

  draw(_persistentConfig: any, _runtimeConfig?: any): Promise<void> | void {
    this.persistentConfig = { ...this.persistentConfig, ..._persistentConfig };
    this.initEditor();
    this.drawChart();
  }

  download(_filename?: string): DownloadInfo | undefined {
    if (!this.yasr.results) {
      return null;
    }
    const svgEl = this.yasr.resultsEl.getElementsByTagName('svg');
    if (svgEl.length > 0) {
      return this.exportSvg(svgEl[0]);
    }
    //ok, not a svg. is it a table?
    const tableEl = this.yasr.resultsEl.querySelectorAll('.google-visualization-table-table');
    if (tableEl.length > 0) {
      return this.exportCsv()
    }
  }

  private exportSvg(svgEl: any): DownloadInfo {
    const svg = svgEl.cloneNode(true);
    let htmlString = svg.outerHTML;
    // wrap in div, so users can more easily tune width/height
    htmlString = '<div style="width: 800px; height: 600px;">\n' + htmlString + '\n</div>';
    return {
      contentType: "image/svg+xml",
      filename: "queryResults.svg",
      getData: () => {
        return htmlString;
      }
    };
  }

  private exportCsv(): DownloadInfo {
    // @ts-ignore
    const data = this.wrapper.getDataTable();
    // build column headings
    let csvColumns = '';
    for (let i = 0; i < data.getNumberOfColumns(); i++) {
      csvColumns += data.getColumnLabel(i);
      if (i < (data.getNumberOfColumns() - 1)) {
        csvColumns += ',';
      }
    }
    csvColumns += '\n';
    // @ts-ignore
    let csv = google.visualization.dataTableToCsv(data);
    csv = csvColumns + csv;
    return {
      getData: () => {
        return csv;
      },
      filename: "queryResults.csv",
      contentType: "text/csv"
    };
  }

  getIcon(): Element | undefined {
    const icon = document.createElement('div');
    icon.innerHTML = SvgUtil.getYasrChartPluginIcon();
    return icon;
  }

  destroy(): void {
    // @ts-ignore
    google.visualization.events?.removeListener(this.chartEditorOkHandler);
    const configButtonWrapper = this.yasr?.rootEl.querySelector('.yasr_header .chart-config-control');
    configButtonWrapper?.remove();
    this.unsubscribeFromLanguageChange();
  }

  private drawChart() {
    this.yasr.resultsEl.innerHTML = '';
    this.addChartConfigButton();
    const chartState = this.persistentConfig.chartState && JSON.parse(this.persistentConfig.chartState);
    const dataModel = this.buildModel();
    let dataTable = undefined;
    if(chartState && chartState.dataTable.rows.length === dataModel.getNumberOfRows() && chartState.dataTable.cols.length === dataModel.getNumberOfColumns()) {
      dataTable = chartState.dataTable;
    } else {
      dataTable = dataModel;
    }

    this.createChartContainer();
    // @ts-ignore
    this.wrapper = new google.visualization.ChartWrapper({
      chartType: chartState ? chartState.chartType : 'Table',
      dataTable: dataTable,
      containerId: this.getContainerId()
    });

    // Generic handler for chart errors. For now we just remove them all because we show our own
    // customized error. See https://ontotext.atlassian.net/browse/GDB-9147
    // @ts-ignore
    google.visualization.events.addListener(this.wrapper, 'error', (_googleError) => {
      const container = document.getElementById(this.wrapper.getContainerId())
      // @ts-ignore
      google.visualization.errors?.removeAll(container);
    });

    if (chartState) {
      this.wrapper.setOptions(chartState.options)
    } else {
      this.wrapper.setOption('width', this.config.width);
      this.wrapper.setOption('height', this.config.height);
    }
    this.wrapper.draw();
  }

  private buildModel() {
    // @ts-ignore
    const dataTable = new google.visualization.DataTable();
    const jsonResults = this.yasr.results.getAsJson();
    jsonResults.head.vars.forEach((variable) => {
      let type = 'string';
      try {
        type = this.getGoogleTypeForBindings(jsonResults.results.bindings, variable);
      } catch (e) {
        if (e instanceof TypesMappingError) {
          this.yasr.showWarning(e.msg)
        } else {
          throw e;
        }
      }
      dataTable.addColumn(type, variable);
    });

    const prefixes = SparqlUtils.mapPrefixesToNamespaces(this.yasr.getPrefixes());

    jsonResults.results.bindings.forEach((binding) => {
      const row = jsonResults.head.vars.map((variable, columnId) => {
        return ChartsPlugin.castGoogleType(binding[variable], prefixes, dataTable.getColumnType(columnId));
      });
      dataTable.addRow(row);
    });
    return dataTable;
  }

  private getContainerId(): string {
    const tabId = this.yasr.yasqe.tabId;
    return `${tabId}_visualization`
  }

  private createChartContainer() {
    const pluginHtml = document.createElement("div");
    pluginHtml.id = this.getContainerId();
    this.yasr.resultsEl.appendChild(pluginHtml);
  }

  private redrawChart() {
    const chartWrapper = this.chartEditor.getChartWrapper();
    chartWrapper.draw(document.getElementById(this.getContainerId()));
    this.persistentConfig.chartOptions = chartWrapper.getOptions();
    this.persistentConfig.chartState = chartWrapper.toJSON();
    this.yasr.storePluginConfig(ChartsPlugin.PLUGIN_NAME, this.persistentConfig);
  }

  private initEditor() {
    // @ts-ignore
    this.chartEditor = new google.visualization.ChartEditor();
    // @ts-ignore
    this.chartEditorOkHandler = google.visualization.events.addListener(this.chartEditor, 'ok', this.redrawChart.bind(this));
  }

  private addChartConfigButton() {
    if (this.yasr.resultsEl.parentElement.querySelector('#openChartConfigBtn')) {
      return;
    }
    const openConfigButton = document.createElement('button');
    openConfigButton.id = 'openChartConfigBtn';
    openConfigButton.innerHTML = this.translateConfigButtonTitle();
    openConfigButton.addEventListener('click', () => {
      this.chartEditor.openDialog(this.wrapper, {});
    });
    // Wrap it in a div so that it can be easily styled without clashing with the header layout styles
    const buttonWrapper = document.createElement('div');
    buttonWrapper.classList.add('chart-config-control');
    buttonWrapper.prepend(openConfigButton);
    const infoContainer = this.yasr.resultsEl.parentElement.querySelector('.yasr_header .space_element');
    infoContainer.insertAdjacentElement('beforebegin', buttonWrapper);
  }

  private translateConfigButtonTitle(): string {
    return this.translationService.translate("yasr.plugin_control.plugin.charts.config.button");
  }

  private static getGoogleTypeForBinding(binding): string | null {
    if (!binding) {
      return null;
    }
    if (binding.type != null && (binding.type === 'typed-literal' || binding.type === 'literal')) {
      switch (binding.datatype) {
        case 'http://www.w3.org/2001/XMLSchema#float':
        case 'http://www.w3.org/2001/XMLSchema#decimal':
        case 'http://www.w3.org/2001/XMLSchema#int':
        case 'http://www.w3.org/2001/XMLSchema#integer':
        case 'http://www.w3.org/2001/XMLSchema#long':
        case 'http://www.w3.org/2001/XMLSchema#gYearMonth':
        case 'http://www.w3.org/2001/XMLSchema#gYear':
        case 'http://www.w3.org/2001/XMLSchema#gMonthDay':
        case 'http://www.w3.org/2001/XMLSchema#gDay':
        case 'http://www.w3.org/2001/XMLSchema#gMonth':
          return "number";
        case 'http://www.w3.org/2001/XMLSchema#date':
          return "date";
        case 'http://www.w3.org/2001/XMLSchema#dateTime':
          return "datetime";
        case 'http://www.w3.org/2001/XMLSchema#time':
          return "timeofday";
        default:
          return "string";
      }
    } else {
      return "string";
    }
  }

  private getGoogleTypeForBindings(bindings, varName): string {
    const types = {};
    let typeCount = 0;
    bindings.forEach((binding) => {
      const type = ChartsPlugin.getGoogleTypeForBinding(binding[varName]);
      if (type != null) {
        if (!(type in types)) {
          types[type] = 0;
          typeCount++;
        }
        types[type]++;
      }
    });
    if (typeCount == 0) {
      return 'string';
    } else if (typeCount == 1) {
      for (const type in types) {
        //just return this one
        return type;
      }
    } else {
      // we have conflicting types. Throw error
      console.log('Mapping bindings to types failed', types, varName);
      throw new TypesMappingError(
        this.translationService.translate('yasr.exceptions.conflict_render', [{key: 'varName', value: varName}]));
    }
  }

  private static castGoogleType(binding, prefixes, googleType) {
    if (binding == null) {
      return null;
    }

    if (googleType != 'string' && binding.type != null && (binding.type === 'typed-literal' || binding.type === 'literal')) {
      switch (binding.datatype) {
        case 'http://www.w3.org/2001/XMLSchema#float':
        case 'http://www.w3.org/2001/XMLSchema#decimal':
        case 'http://www.w3.org/2001/XMLSchema#int':
        case 'http://www.w3.org/2001/XMLSchema#integer':
        case 'http://www.w3.org/2001/XMLSchema#long':
        case 'http://www.w3.org/2001/XMLSchema#gYearMonth':
        case 'http://www.w3.org/2001/XMLSchema#gYear':
        case 'http://www.w3.org/2001/XMLSchema#gMonthDay':
        case 'http://www.w3.org/2001/XMLSchema#gDay':
        case 'http://www.w3.org/2001/XMLSchema#gMonth':
          return Number(binding.value);
        case 'http://www.w3.org/2001/XMLSchema#date': {
          // the date function does not parse -any- date (including most xsd dates!)
          // datetime and time seem to be fine though.
          // so, first try our custom parser. if that does not work, try the regular date parser anyway
          const date = ChartsPlugin.parseXmlSchemaDate(binding.value);
          if (date) {
            return date;
          }
          break;
        }
        case 'http://www.w3.org/2001/XMLSchema#dateTime':
          return new Date(binding.value);
        case 'http://www.w3.org/2001/XMLSchema#time':
          return new Date(binding.value);
        default:
          return binding.value;
      }
    } else {
      if (binding.type == 'uri') {
        return ChartsPlugin.uriToPrefixed(prefixes, binding.value);
      } else {
        return binding.value;
      }
    }
  }

  private static uriToPrefixed(prefixes, uri): string {
    let prefixedUri = uri;
    if (prefixes) {
      const prefix = prefixes[uri];
      if (prefix && uri.indexOf(prefix) === 0) {
        prefixedUri = prefix + ':' + prefixedUri.substring(prefix.length);
      }
    }
    return prefixedUri;
  }

  // There are no PROPER xml schema to js date parsers
  // A few libraries exist: moment, jsdate, Xdate, but none of them parse valid xml schema dates (e.g. 1999-11-05+02:00).
  // And: I'm not going to write one myself
  // There are other hacky solutions (regular expressions based on trial/error) such as http://stackoverflow.com/questions/2731579/convert-an-xml-schema-date-string-to-a-javascript-date
  // But if we're doing hacky stuff, I at least want to do it MYSELF!
  private static parseXmlSchemaDate(dateString): Date | null {
    //change +02:00 to Z+02:00 (something which is parseable by js date)
    const date = new Date(dateString.replace(/(\d)([+-]\d{2}:\d{2})/, '$1Z$2'));
    // @ts-ignore
    if (isNaN(date)) return null;
    return date;
  }
}

export class TypesMappingError {
  constructor(public msg: string) {
    this.msg = msg;
  }
}
