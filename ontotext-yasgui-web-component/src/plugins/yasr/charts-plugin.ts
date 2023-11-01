import {DownloadInfo, YasrPlugin} from '../../models/yasr-plugin';
import {TranslationService} from '../../services/translation.service';
import {SvgUtil} from '../../services/utils/svg-util';
import {HtmlUtil} from "../../services/utils/html-util";
import {SparqlUtils} from "../../services/utils/sparql-utils";

export class ChartsPlugin implements YasrPlugin {
  // @ts-ignore
  private yasr: Yasr;
  // @ts-ignore
  private translationService: TranslationService;
  public static readonly PLUGIN_NAME = 'charts';
  public label = "charts";
  public priority = 7;
  helpReference: string;
  private chartEditor = null;
  private wrapper = null;
  private loaded = false;
  private chartEditorOkHandler = undefined;

  // @ts-ignore
  constructor(yasr: Yasr) {
    if (yasr) {
      this.yasr = yasr;
      this.translationService = this.yasr.config.translationService;
    }
  }

  canHandleResults(): boolean {
    return !!this.yasr.results && this.yasr.results.getVariables() && this.yasr.results.getVariables().length > 0;
  }

  initialize(): Promise<void> {
    return new Promise((resolve) => {
      // One script tag loads all the required libraries!
      HtmlUtil.loadJavaScript('https://www.gstatic.com/charts/loader.js', this.chartLoadHandler.bind(this));

      const interval = setInterval(() => {
        if (this.loaded) {
          clearInterval(interval);
          resolve();
        }
      }, 100)
    });
  }

  download?(filename?: string): DownloadInfo | undefined {
    console.log('download', filename);
    return;
  }

  draw(_persistentConfig: any, _runtimeConfig?: any): Promise<void> | void {
    this.initEditor();
    this.drawChart();
  }

  getIcon(): Element | undefined {
    const icon = document.createElement('div');
    icon.innerHTML = SvgUtil.getYasrChartPluginIcon();
    return icon;
  }

  destroy(): void {
    // @ts-ignore
    google.visualization.events.removeListener(this.chartEditorOkHandler);
  }

  private drawChart() {
    this.yasr.resultsEl.innerHTML = '';
    this.addChartConfigButton();
    const dataTable = this.buildModel();
    this.createChartContainer();
    // @ts-ignore
    this.wrapper = new google.visualization.ChartWrapper({
      chartType: 'Table',
      dataTable: dataTable,
      containerId: 'visualization'
    });
    this.wrapper.setOption("width", '100%');
    this.wrapper.setOption("height", 600);
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
          // yasr.warn(e.toHtml())
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

  private createChartContainer() {
    const pluginHtml = document.createElement("div");
    pluginHtml.id = 'visualization';
    this.yasr.resultsEl.appendChild(pluginHtml);
  }

  private redrawChart() {
    this.chartEditor.getChartWrapper().draw(document.getElementById('visualization'));
  }

  private chartLoadHandler() {
    // @ts-ignore
    google.charts.load('current', {packages: ['charteditor']}).then(this.onLoadCallback.bind(this));
  }

  private onLoadCallback() {
    this.initEditor();
    this.drawChart();
    // chart loader and modules are loaded
    this.loaded = true;
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
    openConfigButton.innerHTML = this.translationService.translate("yasr.plugin_control.plugin.charts.config.button");
    openConfigButton.addEventListener('click', () => {
      this.chartEditor.openDialog(this.wrapper, {});
    });
    const infoContainer = this.yasr.resultsEl.parentElement.querySelector('.yasr_header .yasr_response_chip');
    infoContainer.prepend(openConfigButton);
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
      throw new TypesMappingError('Mapping bindings to types failed', types, varName);
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

function TypesMappingError(msg, types, varName) {
  this.msg = msg;
  this.types = types;
  this.varName = varName;
}
