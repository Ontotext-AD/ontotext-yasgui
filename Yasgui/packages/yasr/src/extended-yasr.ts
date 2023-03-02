import Yasr, { Config } from "@triply/yasr";
import { addClass, removeClass, TranslationService } from "@triply/yasgui-utils";
import Yasqe from "@triply/yasqe";

export class ExtendedYasr extends Yasr {
  static readonly ONE_MINUTE_iN_SECONDS = 60;
  static readonly TEN_MINUTES_IN_SECONDS = 600;
  static readonly ONE_HOUR_IN_MILLISECONDS = 3600000;
  static readonly ONE_DAY_IN_SECONDS = 86400;
  static readonly ONE_SECOND_IN_MILLISECONDS = 1000;
  static readonly ONE_DAY_IN_MILLISECONDS = 86400000;
  static readonly ONE_MINUTE_IN_MILLISECONDS = 60000;

  downloadAsElement: HTMLElement | undefined;

  externalPluginsConfigurations: Map<string, any> | undefined;
  resultQueryPaginationElement: Page | undefined;
  private eventsListeners: Map<string, Function> | undefined;
  private persistentJson: any;

  constructor(yasqe: Yasqe, parent: HTMLElement, conf: Partial<Config> = {}, persistentJson?: any) {
    super(yasqe, parent, conf, persistentJson?.yasr.response);
    this.persistentJson = persistentJson;
    this.externalPluginsConfigurations = conf.externalPluginsConfigurations;
    if (yasqe.config.paginationOn) {
      this.yasqe.on("queryResponse", this.updateQueryResultPaginationElementHandler.bind(this));
      this.yasqe.on("countQueryReady", this.updateQueryResultPaginationElementHandler.bind(this));
      this.updateQueryResultPaginationElement(this.resultQueryPaginationElement);
    }
  }

  //=================================
  //       Overridden functions.
  //=================================
  drawPluginSelectors() {
    super.drawPluginSelectors();

    if (!this.yasqe.config.paginationOn && !this.config.downloadAsOn) {
      return;
    }
    const pluginSelectorsEl = this.getPluginSelectorsEl();
    const spacerElement = document.createElement("li");
    spacerElement.classList.add("spacer");
    pluginSelectorsEl.appendChild(spacerElement);

    if (this.config.downloadAsOn) {
      const downloadAsLiElement = document.createElement("li");
      this.downloadAsElement = this.createDownloadAsElement();
      this.updateDownloadAsElementVisibility();
      pluginSelectorsEl.appendChild(downloadAsLiElement);
      downloadAsLiElement.appendChild(this.downloadAsElement);
    }

    if (this.yasqe.config.paginationOn) {
      const resultPaginationLiElement = document.createElement("li");
      this.resultQueryPaginationElement = this.createResultPaginationElement();
      resultPaginationLiElement.appendChild(this.resultQueryPaginationElement);
      pluginSelectorsEl.appendChild(resultPaginationLiElement);
    }
  }

  updatePluginSelectorNames() {
    super.updatePluginSelectorNames();
    if (this.downloadAsElement) {
      this.updateDownloadAsElement(this.toDownloadAs(this.downloadAsElement));
      this.updateDownloadAsElementVisibility();
    }
  }

  //==================================================
  //       Functions that extend YASR functionality
  //==================================================

  createResultPaginationElement(): Page {
    const element: Page = (document.createElement("ontotext-pagination") as unknown) as Page;
    const pageSelectedListener = this.pageSelectedHandler(this);
    this.getEventsListeners().set("pageSelected", pageSelectedListener);
    element.addEventListener("pageSelected", pageSelectedListener);
    this.updateQueryResultPaginationElement(element);
    return element;
  }

  updateQueryResultPaginationElementHandler() {
    this.updateQueryResultPaginationElement(this.resultQueryPaginationElement);
  }

  updateQueryResultPaginationElement(resultQueryPaginationElement: Page | undefined) {
    if (!resultQueryPaginationElement) {
      return;
    }
    resultQueryPaginationElement.pageNumber = this.yasqe?.getPageNumber();
    resultQueryPaginationElement.pageSize = this.yasqe?.getPageSize();
    resultQueryPaginationElement.pageElements = this.results?.getBindings()?.length || 0;
    resultQueryPaginationElement.totalElements = this.persistentJson?.yasr.response?.totalElements || -1;
    resultQueryPaginationElement.hasMorePages = this.results?.getHasMorePages();
    this.updateQueryResultPaginationVisibility(resultQueryPaginationElement);
  }

  updateQueryResultPaginationVisibility(resultQueryPaginationElement: Page) {
    removeClass(resultQueryPaginationElement, "hidden");
    const hasNotResults = !this.results?.getBindings()?.length;
    if (
      (hasNotResults && resultQueryPaginationElement.pageNumber === 1) ||
      !this.hasMoreElements(resultQueryPaginationElement)
    ) {
      addClass(resultQueryPaginationElement, "hidden");
    }
  }

  private getEventsListeners(): Map<string, Function> {
    if (!this.eventsListeners) {
      this.eventsListeners = new Map();
    }
    return this.eventsListeners;
  }

  // Private functions
  private toDownloadAs(element: HTMLElement | undefined): DownloadAs | undefined {
    return element ? ((element as any) as DownloadAs) : undefined;
  }

  private createDownloadAsElement(): HTMLElement {
    const element = document.createElement("ontotext-download-as");
    const downloadAsComponent = this.toDownloadAs(element);
    if (downloadAsComponent) {
      downloadAsComponent.translationService = this.translationService;
    }
    this.updateDownloadAsElement(downloadAsComponent);
    return element;
  }

  private updateDownloadAsElement(element: DownloadAs | undefined) {
    if (!element) {
      return;
    }
    element.query = this.yasqe?.getValueWithoutComments();
    element.pluginName = this.getSelectedPluginName();

    const infer = this.yasqe?.getInfer();
    if (infer !== undefined) {
      element.infer = infer;
    }
    const sameAs = this.yasqe?.getSameAs();
    if (sameAs !== undefined) {
      element.sameAs = sameAs;
    }
    const downloadAsConfiguration = this.getDownloadAsConfiguration();
    if (downloadAsConfiguration) {
      element.items = downloadAsConfiguration.items ? [...downloadAsConfiguration.items] : [];
      if (downloadAsConfiguration.hasOwnProperty("nameLabelKey")) {
        element.nameLabelKey = downloadAsConfiguration.nameLabelKey;
      }
      element.tooltipLabelKey = downloadAsConfiguration.tooltipLabelKey || downloadAsConfiguration.nameLabelKey;
    } else {
      element.items = [];
    }
  }

  private getDownloadAsConfiguration() {
    return this.externalPluginsConfigurations
      ? this.externalPluginsConfigurations.get(this.getSelectedPluginName())?.["downloadAsConfig"]
      : undefined;
  }

  private updateDownloadAsElementVisibility() {
    removeClass(this.downloadAsElement, "hidden");
    if (!this.results?.getBindings()?.length) {
      addClass(this.downloadAsElement, "hidden");
    }
  }

  private hasMoreElements(resultQueryPaginationElement: Page): boolean {
    if (resultQueryPaginationElement.pageNumber && resultQueryPaginationElement.pageNumber > 1) {
      return true;
    }
    if (resultQueryPaginationElement.hasMorePages !== undefined) {
      return resultQueryPaginationElement.hasMorePages;
    }

    if (resultQueryPaginationElement.pageSize && resultQueryPaginationElement.totalElements) {
      return resultQueryPaginationElement.pageSize < resultQueryPaginationElement.totalElements;
    }
    return false;
  }

  public destroy() {
    super.destroy();
    const pageSelected: any = this.getEventsListeners().get("pageSelected");
    if (pageSelected) {
      this.resultQueryPaginationElement?.removeEventListener("pageSelected", pageSelected);
    }
  }

  private pageSelectedHandler(yasr: ExtendedYasr) {
    return (pageEvent: any) => {
      const page: Page = pageEvent.detail;
      const yasqe = yasr.yasqe;
      if (yasqe) {
        yasqe.setPageNumber(page.pageNumber || 1);
        yasqe.setPageSize(page.pageSize || 10);
        yasqe.query();
      }
    };
  }

  updateResponseInfo() {
    let resultInfo = "";
    const responseInfoElement = this.getResponseInfoElement();
    removeClass(responseInfoElement, "empty");
    const responseTime = this.results?.getResponseTime();
    const queryStartedTime = this.results?.getQueryStartedTime();
    if (this.results && responseTime && queryStartedTime) {
      const queryFinishedTime = queryStartedTime + responseTime;
      const staleWarningMessage = this.getStaleWarningMessage(queryFinishedTime);
      // TODO Message of resultInfo depends by query type which can be query or update
      resultInfo = staleWarningMessage ? staleWarningMessage : "";
      const bindings = this.results.getBindings();
      if (!bindings || bindings.length === 0) {
        resultInfo = this.translationService.translate("yasr.plugin_control.response_chip.message.result_empty");
      } else {
        // TODO fix message and parameters when server side paging is implemented.
        // message key have to be "yasr.plugin_control.response_chip.message.result_info"
        const params = [{ key: "countResults", value: `${bindings.length}` }];
        resultInfo +=
          bindings.length === 1
            ? this.translationService.translate("yasr.plugin_control.info.count_result", params)
            : this.translationService.translate("yasr.plugin_control.info.count_results", params);
      }

      const params = [
        {
          key: "seconds",
          value: this.getHumanReadableSeconds(responseTime, true),
        },
        {
          key: "timestamp",
          value: this.getHumanReadableTimestamp(queryFinishedTime),
        },
      ];
      resultInfo += ` ${this.translationService.translate(
        "yasr.plugin_control.response_chip.message.result_time",
        params
      )}`;
    } else {
      addClass(responseInfoElement, "empty");
    }
    responseInfoElement.innerHTML = resultInfo;
  }

  private getHumanReadableTimestamp(time: number) {
    const now = this.getNowInMilliseconds();
    const delta = (now - time) / ExtendedYasr.ONE_SECOND_IN_MILLISECONDS;
    if (delta < ExtendedYasr.ONE_MINUTE_iN_SECONDS) {
      return this.translationService.translate("yasr.plugin_control.response_chip.timestamp.moments_ago");
    } else if (delta < ExtendedYasr.TEN_MINUTES_IN_SECONDS) {
      return this.translationService.translate("yasr.plugin_control.response_chip.timestamp.minutes_ago");
    } else {
      const dNow = new Date(now);
      const dTime = new Date(time);
      if (
        dNow.getFullYear() === dTime.getFullYear() &&
        dNow.getMonth() === dTime.getMonth() &&
        dNow.getDate() === dTime.getDate()
      ) {
        // today
        return this.translationService.translate(
          "yasr.plugin_control.response_chip.timestamp.today_at",
          this.toTimeParameters(time)
        );
      } else if (delta < ExtendedYasr.ONE_DAY_IN_SECONDS) {
        // yesterday
        return this.translationService.translate(
          "yasr.plugin_control.response_chip.timestamp.yesterday_at",
          this.toTimeParameters(time)
        );
      }
    }
    return this.translationService.translate(
      "yasr.plugin_control.response_chip.timestamp.on_at",
      this.toTimeParameters(time)
    );
  }

  private toTimeParameters(timeInMilliseconds: number): { key: string; value: string }[] {
    const date = new Date(timeInMilliseconds);
    return [
      { key: "hours", value: `${date.getHours()}` },
      { key: "minutes", value: `${this.normalize(date.getMinutes())}` },
      { key: "seconds", value: `${this.normalize(date.getSeconds())}` },
      { key: "date", value: `${this.normalize(date.getDate())}` },
      { key: "month", value: `${this.normalize(date.getMonth() + 1)}` },
      { key: "year", value: `${date.getFullYear()}` },
    ];
  }

  private getStaleWarningMessage(queryFinishedTime: number): string {
    const millisecondAgo = this.getNowInMilliseconds() - queryFinishedTime;
    if (millisecondAgo >= ExtendedYasr.ONE_HOUR_IN_MILLISECONDS) {
      const staleWarningMessage = this.translationService.translate(
        "yasr.plugin_control.response_chip.timestamp.warning.tooltip",
        [
          {
            key: "timeAgo",
            value: this.getHumanReadableSeconds(millisecondAgo),
          },
        ]
      );
      return `<yasgui-tooltip data-tooltip="${staleWarningMessage}" placement="top"><span class="icon-warning icon-lg" style="padding: 5px"></span></yasgui-tooltip>`;
    }
    return "";
  }

  private getHumanReadableSeconds(millisecondsAgo: number, preciseSeconds = false): string {
    const days = Math.floor(millisecondsAgo / ExtendedYasr.ONE_DAY_IN_MILLISECONDS);
    const hours = Math.floor(
      (millisecondsAgo % ExtendedYasr.ONE_DAY_IN_MILLISECONDS) / ExtendedYasr.ONE_HOUR_IN_MILLISECONDS
    );
    const minutes = Math.floor(
      ((millisecondsAgo % ExtendedYasr.ONE_DAY_IN_MILLISECONDS) % ExtendedYasr.ONE_HOUR_IN_MILLISECONDS) /
        ExtendedYasr.ONE_MINUTE_IN_MILLISECONDS
    );
    const seconds =
      (((millisecondsAgo % ExtendedYasr.ONE_DAY_IN_MILLISECONDS) % ExtendedYasr.ONE_HOUR_IN_MILLISECONDS) %
        ExtendedYasr.ONE_MINUTE_IN_MILLISECONDS) /
      ExtendedYasr.ONE_SECOND_IN_MILLISECONDS;
    return this.toHumanReadableSeconds(days, hours, minutes, this.normalizeSeconds(seconds, preciseSeconds));
  }

  private toHumanReadableSeconds(days: number, hours: number, minutes: number, seconds: number): string {
    let message = "";
    if (days) {
      message += `${this.translationService.translate("yasr.plugin_control.response_chip.message.day", [
        { key: "day", value: `${days}` },
      ])} `;
    }
    if (days || hours) {
      message += `${this.translationService.translate("yasr.plugin_control.response_chip.message.hours", [
        { key: "hours", value: `${hours}` },
      ])} `;
    }
    if (days || hours || minutes) {
      message += `${this.translationService.translate("yasr.plugin_control.response_chip.message.minutes", [
        { key: "minutes", value: `${minutes}` },
      ])} `;
    }
    message += `${this.translationService.translate("yasr.plugin_control.response_chip.message.seconds", [
      { key: "seconds", value: `${seconds}` },
    ])}`;
    return message.replace(/( 0[a-z])+$/, "");
  }

  /**
   * Normalizes passed <code>secondsAgo</code>. Seconds can be passed with fraction.
   * If <code>preciseSeconds</code> is true and <code>secondsAgo</code> < 10 will use fractional seconds rounded to one decimal place,
   * elsewhere it will be rounded up to an integer.
   * @param secondsAgo - the seconds to be normalized.
   * @param preciseSeconds - if true and sec
   */
  private normalizeSeconds(secondsAgo: number, preciseSeconds = false): number {
    if (preciseSeconds && secondsAgo < 10) {
      if (secondsAgo < 0.1) {
        return 0.1;
      }
      return Number((Math.round(secondsAgo * 10) / 10).toFixed(1));
    }

    return Math.round(secondsAgo);
  }

  private getNowInMilliseconds(): number {
    return Date.now();
  }

  private normalize(value: number): string {
    return `${value < 10 ? 0 : ""}${value}`;
  }
}

interface DownloadAs {
  translationService: TranslationService;
  nameLabelKey: string;
  tooltipLabelKey: string;
  query: string | undefined;
  pluginName: string;
  items: any[];
  infer?: boolean;
  sameAs?: boolean;
}

interface Page extends HTMLElement {
  pageSize?: number;
  pageNumber?: number;
  totalElements?: number;
  pageElements?: number;
  hasMorePages?: boolean;
}
