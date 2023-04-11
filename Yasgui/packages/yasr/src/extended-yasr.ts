import Yasr, { Config } from "@triply/yasr";
import { addClass, removeClass } from "@triply/yasgui-utils";
import Yasqe from "@triply/yasqe";

export class ExtendedYasr extends Yasr {
  static readonly ONE_MINUTE_iN_SECONDS = 60;
  static readonly TEN_MINUTES_IN_SECONDS = 600;
  static readonly ONE_HOUR_IN_MILLISECONDS = 3600000;
  static readonly ONE_DAY_IN_SECONDS = 86400;
  static readonly ONE_SECOND_IN_MILLISECONDS = 1000;
  static readonly ONE_DAY_IN_MILLISECONDS = 86400000;
  static readonly ONE_MINUTE_IN_MILLISECONDS = 60000;

  // TODO remove it
  externalPluginsConfigurations: Map<string, any> | undefined;

  private yasrToolbarManagers: YasrToolbarPluginManager[] | undefined;
  private readonly persistentJson: any;

  constructor(yasqe: Yasqe, parent: HTMLElement, conf: Partial<Config> = {}, persistentJson?: any) {
    super(yasqe, parent, conf, persistentJson?.yasr.response);
    this.persistentJson = persistentJson;
    this.externalPluginsConfigurations = conf.externalPluginsConfigurations;
    if (yasqe.config.paginationOn) {
      this.yasqe.on("queryResponse", this.draw.bind(this));
      this.yasqe.on("totalElementsPersisted", this.draw.bind(this));
    }
    this.yasqe.on("countAffectedRepositoryStatementsPersisted", this.updateResponseInfo.bind(this));
  }

  //=================================
  //       Overridden functions.
  //=================================
  drawPluginSelectors() {
    if (this.yasqe.isUpdateQuery() || this.yasqe.isAskQuery()) {
      return;
    }
    super.drawPluginSelectors();

    if (!this.yasrToolbarManagers && this.config.yasrToolbarPlugins) {
      this.yasrToolbarManagers = this.config.yasrToolbarPlugins.map(
        (toolbarElementBuilder) => new YasrToolbarPluginManager(toolbarElementBuilder)
      );
      this.yasrToolbarManagers = this.yasrToolbarManagers.sort((managerOne, managerTwo) => {
        return managerOne.getOrder() - managerTwo.getOrder();
      });
    }

    if (!this.yasqe.config.paginationOn && !this.yasrToolbarManagers) {
      return;
    }
    const pluginSelectorsEl = this.getPluginSelectorsEl();
    const spacerElement = document.createElement("li");
    spacerElement.classList.add("spacer");
    pluginSelectorsEl.appendChild(spacerElement);

    if (this.yasrToolbarManagers) {
      const yasrToolbar = document.createElement("li");
      yasrToolbar.className = "yasr-toolbar";
      this.yasrToolbarManagers.forEach((manager) => {
        const element = manager.createElement(this);
        element.classList.add("yasr-toolbar-element");
        yasrToolbar.appendChild(element);
      });
      pluginSelectorsEl.appendChild(yasrToolbar);
    }
  }

  draw() {
    if (this.yasqe.isUpdateQuery() || this.yasqe.isAskQuery() || this.results?.hasError()) {
      this.hidePluginElementVisibility();
    } else {
      this.showPluginElementVisibility();
    }
    super.draw();
  }

  updatePluginSelectorNames() {
    super.updatePluginSelectorNames();
    this.yasrToolbarManagers?.forEach((manager) => manager.updateElement(this));
  }

  private hidePluginElementVisibility() {
    const pluginElement = this.getPluginSelectorsEl();
    if (pluginElement) {
      addClass(pluginElement, "hidden");
    }
  }

  private showPluginElementVisibility() {
    const pluginElement = this.getPluginSelectorsEl();
    if (pluginElement) {
      removeClass(pluginElement, "hidden");
    }
  }

  //==================================================
  //       Functions that extend YASR functionality
  //==================================================
  public hasResults(): boolean {
    if (this.results) {
      const bindings = this.results.getBindings() || [];
      return bindings.length > 0;
    }
    return true;
  }

  getTabId(): string | undefined {
    return this.config.tabId;
  }

  public destroy() {
    super.destroy();
    this.yasrToolbarManagers?.forEach((manager) => manager.destroy(this));
  }

  private getUpdateTypeQueryResponseInfo(): string {
    // TODO show custom message if exist in persistence
    const countAffectedRepositoryStatements = this.results?.getCountAffectedRepositoryStatements();
    if (countAffectedRepositoryStatements === undefined) {
      return "";
    }

    if (countAffectedRepositoryStatements === 0) {
      return this.translationService.translate("yasr.message_info.no_changes.message");
    }

    const messageLabelKey =
      countAffectedRepositoryStatements < 0
        ? "yasr.message_info.removed_statements.message"
        : "yasr.message_info.added_statements.message";
    const params = [
      { key: "countAffectedRepositoryStatements", value: `${Math.abs(countAffectedRepositoryStatements)}` },
    ];
    return this.translationService.translate(messageLabelKey, params);
  }

  private getQueryTypeQueryResponseInfo(): string {
    if (this.yasqe.isAskQuery()) {
      return "";
    }

    const bindings = this.results?.getBindings();
    if (!bindings || bindings.length === 0) {
      return this.translationService.translate("yasr.plugin_control.response_chip.message.result_empty");
    }

    if (!this.yasqe.config.paginationOn) {
      return this.getCountResultMessage(bindings);
    }

    const pageSize = this.yasqe.getPageSize() || this.persistentJson?.yasqe.pageSize;
    const pageNumber = this.yasqe.getPageNumber() || this.persistentJson?.yasqe.pageNumber;
    const totalElements = this.persistentJson?.yasr.response?.totalElements;
    const from = pageSize * (pageNumber - 1);
    let to = from + bindings.length;

    const fromToMessage = this.getFromToMessage(from, to);
    let totalResult = "";
    if (totalElements) {
      totalResult = this.getTotalResultsMessage(totalElements) + ".";
    } else if (this.persistentJson?.yasr.response?.possibleElementsCount) {
      totalResult = this.getHasMoreResultsMessage(this.persistentJson.yasr.response.possibleElementsCount) + ".";
    }
    return `${fromToMessage} ${totalResult}`;
  }

  updateResponseInfo() {
    const responseInfoElement = this.getResponseInfoElement();

    removeClass(responseInfoElement, "hidden");
    if (this.results?.hasError()) {
      addClass(responseInfoElement, "hidden");
      return;
    }

    const responseTime = this.results?.getResponseTime();
    const queryStartedTime = this.results?.getQueryStartedTime();

    if (!this.results || !responseTime || !queryStartedTime) {
      addClass(responseInfoElement, "empty");
      responseInfoElement.innerHTML = "";
      return;
    }

    removeClass(responseInfoElement, "empty");
    const queryFinishedTime = queryStartedTime + responseTime;
    const warningIcon = this.getStaleWarningMessage(queryFinishedTime);
    const resultInfo = this.yasqe.isUpdateQuery()
      ? this.getUpdateTypeQueryResponseInfo()
      : this.getQueryTypeQueryResponseInfo();
    const resultTimeInfo = this.getResultTimeMessage(responseTime, queryFinishedTime);
    responseInfoElement.innerHTML = `${warningIcon} ${resultInfo} ${resultTimeInfo}`;
  }

  private getCountResultMessage(bindings: any[]): string {
    const params = [{ key: "countResults", value: `${bindings.length}` }];
    return bindings.length === 1
      ? this.translationService.translate("yasr.plugin_control.info.count_result", params)
      : this.translationService.translate("yasr.plugin_control.info.count_results", params);
  }

  private getFromToMessage(from: number, to: number): string {
    let params = [
      { key: "from", value: `${from}` },
      { key: "to", value: `${to}` },
    ];

    return this.translationService.translate("yasr.plugin_control.response_chip.message.result_info", params);
  }

  private getTotalResultsMessage(totalElements: number): string {
    const params = [{ key: "totalResults", value: `${totalElements}` }];
    return this.translationService.translate(
      "yasr.plugin_control.response_chip.message.result_info.total_results",
      params
    );
  }

  private getHasMoreResultsMessage(knownResults: number): string {
    const params = [{ key: "atLeastResults", value: `${knownResults}` }];
    return this.translationService.translate(
      "yasr.plugin_control.response_chip.message.result_info.at_least_results",
      params
    );
  }

  public getResultTimeMessage(responseTime: number, queryFinishedTime: number): string {
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
    return ` ${this.translationService.translate("yasr.plugin_control.response_chip.message.result_time", params)}`;
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
      const params = [{ key: "timeAgo", value: this.getHumanReadableSeconds(millisecondAgo) }];
      const staleWarningMessage = this.translationService.translate(
        "yasr.plugin_control.response_chip.timestamp.warning.tooltip",
        params
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

export interface YasrToolbarPlugin {
  createElement(yasr: Yasr): HTMLElement;

  updateElement(element: HTMLElement, yasr: Yasr): HTMLElement;

  getOrder(): number;

  destroy(element: HTMLElement, yasr: Yasr): HTMLElement;
}

class YasrToolbarPluginManager {
  element: HTMLElement | undefined;

  constructor(private plugin: YasrToolbarPlugin) {}

  createElement(yasr: Yasr): HTMLElement {
    this.element = this.plugin.createElement(yasr);
    this.updateElement(yasr);
    return this.element;
  }

  updateElement(yasr: Yasr): void {
    if (!this.element) {
      return;
    }
    this.plugin.updateElement(this.element, yasr);
  }

  getOrder(): number {
    return this.plugin.getOrder();
  }

  destroy(yasr: Yasr): void {
    if (this.element && typeof this.plugin.destroy === "function") {
      this.plugin.destroy(this.element, yasr);
    }
  }
}
