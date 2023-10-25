import {YasrPlugin} from '../../models/yasr-plugin';
import {TranslationService} from '../../services/translation.service';
import {SvgUtil} from '../../services/utils/svg-util';

export class PivotTablePlugin implements YasrPlugin {

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

  canHandleResults(): boolean {
    // TODO check is this correct
    return !!this.yasr.results && this.yasr.results.getVariables() && this.yasr.results.getVariables().length > 0;
  }

  destroy(): void {
    // TODO remove all listeners if any.
  }

  draw(_persistentConfig: any, _runtimeConfig?: any): Promise<void> | void {
    // TODO implement the pivot table rendering of response.
    const pluginHtml = document.createElement("div");
    pluginHtml.innerText = 'Pivot plugin is shown';
    this.yasr.resultsEl.appendChild(pluginHtml);
  }

  getIcon(): Element | undefined {
    const icon = document.createElement('div');
    icon.innerHTML = SvgUtil.getPivotTableIconSvgTag();
    return icon;
  }

  initialize(): Promise<void> {
    return Promise.resolve(undefined);
  }
}
