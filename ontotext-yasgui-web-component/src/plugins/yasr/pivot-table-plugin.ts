import {YasrPlugin} from '../../models/yasr-plugin';
import {TranslationService} from '../../services/translation.service';
import {SvgUtil} from '../../services/utils/svg-util';
import {HtmlUtil} from '../../services/utils/html-util';
import {SparqlUtils} from '../../services/utils/sparql-utils';

export class PivotTablePlugin implements YasrPlugin {

  // TODO add persistence
  // @ts-ignore
  private static readonly PERSISTENCE_ID = 'pivot';
  private static readonly PLUGIN_CLASS_NAME = 'pivot-table-plugin';

  // @ts-ignore
  private yasr: Yasr;
  // @ts-ignore
  private translationService: TranslationService;

  helpReference: string;
  public label = "pivot-table";
  public priority = 4;

  // @ts-ignore
  constructor(yasr: Yasr) {
    if (yasr) {
      this.yasr = yasr;
      this.translationService = this.yasr.config.translationService;
    }
  }

  initialize(): Promise<void> {
    return new Promise(resolve => {
      HtmlUtil.addScriptTag('https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3.min.js');
      HtmlUtil.addScriptTag('https://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.2/jquery.min.js');
      HtmlUtil.addScriptTag('https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js');
      HtmlUtil.addScriptTag('https://www.google.com/jsapi');
      HtmlUtil.addScriptTag('https://www.gstatic.com/charts/loader.js');
      HtmlUtil.addScriptTag('https://pivottable.js.org/dist/pivot.js');
      HtmlUtil.addScriptTag('https://pivottable.js.org/dist/d3_renderers.js');
      HtmlUtil.addScriptTag('https://pivottable.js.org/dist/gchart_renderers.js', () => resolve());
    });
  }

  canHandleResults(): boolean {
    return this.yasr.results && this.yasr.results.getVariables && this.yasr.results.getVariables() && this.yasr.results.getVariables().length > 0;
  }

  draw(_persistentConfig: any, _runtimeConfig?: any): Promise<void> | void {
    this.showPlugin(this.getRenders());
  }

  getIcon(): Element | undefined {
    const icon = document.createElement('div');
    icon.innerHTML = SvgUtil.getPivotTableIconSvgTag();
    return icon;
  }

  destroy(): void {
    // TODO remove all listeners if any.
  }

  private getRenders(): any {
    // @ts-ignore
    return $.extend(true, $.pivotUtilities.renderers, $.pivotUtilities.d3_renderers, $.pivotUtilities.gchart_renderers);
  }

  private showPlugin(renderers) {
    const pluginHtml = document.createElement("div");
    pluginHtml.className = PivotTablePlugin.PLUGIN_CLASS_NAME;
    this.yasr.resultsEl.appendChild(pluginHtml);

    // @ts-ignore
    google.load("visualization", "1", {packages: ["corechart", "charteditor"]});
    // @ts-ignore
    $(`.${PivotTablePlugin.PLUGIN_CLASS_NAME}`).pivotUI((callback) => this.getResults(callback), {renderers});
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
}
