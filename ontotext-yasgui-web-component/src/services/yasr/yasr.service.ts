import {HtmlElementsUtil} from '../utils/html-elements-util';
import {TranslationParameter, TranslationService} from '../translation.service';
import {ServiceFactory} from '../service-factory';
import {DateService} from '../date.service';
import {Yasgui} from '../../../../Yasgui/packages/yasgui';

type eventHandler = (...args: any[]) => void;

export class YasrService {
  private _hostElement: HTMLElement;
  private translationService: TranslationService;
  private dateService: DateService;
  private eventNameToEventHandlerMapping: Map<string, eventHandler> = new Map<string, eventHandler>();
  private yasgui: Yasgui;

  constructor(serviceFactory: ServiceFactory) {
    this.translationService = serviceFactory.get(TranslationService);
    this.dateService = serviceFactory.get(DateService);
  }

  setYasgui(yasgui: Yasgui) {
    this.yasgui = yasgui;
    // @ts-ignore
    const resultInfoChangedHandler = (yasr: Yasr) => {
      this.updateResponseInfo(yasr);
    };
    this.yasgui.on('result-info-changed', resultInfoChangedHandler);
    this.eventNameToEventHandlerMapping.set('result-info-changed', resultInfoChangedHandler);
    this.updateResponseInfo(this.yasgui.getTab().getYasr());
  }

  set hostElement(value: HTMLElement) {
    this._hostElement = value;
  }

  // @ts-ignore
  private updateResponseInfo(yasr: Yasr) {
    let resultInfo = '';
    const resultInfoElement = HtmlElementsUtil.getQueryResultInfo(this._hostElement);
    resultInfoElement.classList.remove('empty');
    if (yasr.results) {
      const responseTime = yasr.results.getResponseTime();
      const queryFinishedTime = yasr.results.getQueryStartedTime() + responseTime;
      const staleWarningMessage = this.getStaleWarningMessage(queryFinishedTime);
      // TODO Message of resultInfo depends by query type which can be query or update
      resultInfo = staleWarningMessage ? staleWarningMessage : '';
      const bindings = yasr.results.getBindings();
      if (!bindings || bindings.length === 0) {
        resultInfo = this.translationService.translate('yasr.plugin_control.response_chip.message.result_empty');
      } else {
        // TODO fix message and parameters when server side paging is implemented.
        // message key have to be "yasr.plugin_control.response_chip.message.result_info"
        const params = [new TranslationParameter('countResults', bindings.length)];
        resultInfo +=
          bindings.length === 1
            ? this.translationService.translate("yasr.plugin_control.info.count_result", params)
            : this.translationService.translate("yasr.plugin_control.info.count_results", params);
      }

      const params = [{
        key: "seconds",
        value: this.dateService.getHumanReadableSeconds(responseTime, true)
      }, {
        key: "timestamp",
        value: this.dateService.getHumanReadableTimestamp(queryFinishedTime)
      }
      ]
      resultInfo += ` ${this.translationService.translate('yasr.plugin_control.response_chip.message.result_time', params)}`;
    } else {
      resultInfoElement.classList.add('empty');
    }
    resultInfoElement.innerHTML = resultInfo;
  }

  private getStaleWarningMessage(queryFinishedTime: number): string {
    const staleWarningMessage = this.dateService.getStaleWarningMessage(queryFinishedTime);
    if (staleWarningMessage) {
      return `<yasgui-tooltip data-tooltip="${staleWarningMessage}" placement="top"><span class="icon-warning icon-lg" style="padding: 5px"></span></yasgui-tooltip>`;
    }
  }

  destroy() {
    if (this.yasgui) {
      this.eventNameToEventHandlerMapping.forEach((eventHandler, eventName) => {
        this.yasgui.off(eventName, eventHandler);
      });
    }
  }
}
