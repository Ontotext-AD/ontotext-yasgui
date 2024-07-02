import Yasr, { Config } from "@triply/yasr";
import { addClass, removeClass, TranslationParameter } from "@triply/yasgui-utils";
import Yasqe from "@triply/yasqe";

export class ExtendedYasr extends Yasr {
  static readonly ONE_HOUR_IN_MILLISECONDS = 3600000;

  // TODO remove it
  externalPluginsConfigurations: Map<string, any> | undefined;

  private yasrToolbarManagers: YasrToolbarPluginManager[] | undefined;
  private readonly persistentJson: any;

  constructor(yasqe: Yasqe, parent: HTMLElement, conf: Partial<Config> = {}, persistentJson?: any) {
    super(yasqe, parent, conf, persistentJson?.yasr.response);
    this.persistentJson = persistentJson;
    this.externalPluginsConfigurations = conf.externalPluginsConfigurations;
    if (yasqe.config.paginationOn) {
      this.yasqe.on("queryResponse", this.updatePaginationRelatedElements.bind(this));
      this.yasqe.on("totalElementsPersisted", this.updatePaginationRelatedElements.bind(this));
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
    let message = this.translationService.translate("loader.message.query.editor.render.results");
    // If the query is running, show the loader with proper message.
    if (this.yasqe.isQueryRunning()) {
      message = this.yasqe.isUpdateQuery()
        ? this.translationService.translate("loader.message.query.editor.executing.update")
        : this.translationService.translate("loader.message.query.editor.evaluating.query");
        this.showLoader(message, true);
    } else {
      this.showLoader(message);
    }
    // The rendering of YASR is synchronous and can take time, especially when populating numerous results.
    // Setting a timeout resolves the visualization of other components without waiting for YASR to finish drawing.
    setTimeout(() => {
      this.updatePluginElementVisibility();
      super.draw();
    }, 100);
  }

  updatePluginSelectorNames() {
    super.updatePluginSelectorNames();
    this.yasrToolbarManagers?.forEach((manager) => manager.updateElement(this));
  }

  private updatePaginationRelatedElements(): void {
    this.updatePluginElementVisibility();
    this.updateResponseInfo();
    this.updatePluginSelectorNames();
  }

  private updatePluginElementVisibility(): void {
    if (this.yasqe.isUpdateQuery() || this.yasqe.isAskQuery() || this.results?.hasError()) {
      this.hidePluginElementVisibility();
    } else {
      this.showPluginElementVisibility();
    }
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
    return false;
  }

  getTabId(): string | undefined {
    return this.config.tabId;
  }

  public destroy() {
    super.destroy();
    this.yasrToolbarManagers?.forEach((manager) => manager.destroy(this));
  }

  private getUpdateTypeQueryResponseInfo(): string {
    const customResultMessage = this.results?.getCustomResultMessage();
    if (customResultMessage) {
      if (customResultMessage.message) {
        return customResultMessage.message;
      }
      const messageLabelKey = customResultMessage.messageLabelKey;
      if (messageLabelKey) {
        return this.translationService.translate(messageLabelKey, customResultMessage.parameters);
      }
    }

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
    const totalElements = this.persistentJson?.yasr.response?.totalElements || this.results?.getTotalElements();
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

    if (!this.config.showResultInfo || this.results?.hasError()) {
      addClass(responseInfoElement, "hidden");
      return;
    }

    removeClass(responseInfoElement, "hidden");

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
    responseInfoElement.innerHTML = `<span class="response-info-message">${warningIcon} ${resultInfo} ${resultTimeInfo}</span>`;
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
        value: this.timeFormattingService?.getHumanReadableSeconds(responseTime, true),
      },
      {
        key: "timestamp",
        value: this.timeFormattingService?.getHumanReadableTimestamp(queryFinishedTime),
      },
    ] as TranslationParameter[];
    return ` ${this.translationService.translate("yasr.plugin_control.response_chip.message.result_time", params)}`;
  }

  private getStaleWarningMessage(queryFinishedTime: number): string {
    const millisecondAgo = Date.now() - queryFinishedTime;
    if (millisecondAgo >= ExtendedYasr.ONE_HOUR_IN_MILLISECONDS) {
      const params = [
        {
          key: "timeAgo",
          value: this.timeFormattingService?.getHumanReadableSeconds(millisecondAgo),
        } as TranslationParameter,
      ];
      const staleWarningMessage = this.translationService.translate(
        "yasr.plugin_control.response_chip.timestamp.warning.tooltip",
        params
      );
      return `<yasgui-tooltip data-tooltip="${staleWarningMessage}" placement="top"><span class="icon-warning icon-lg" style="padding: 5px"></span></yasgui-tooltip>`;
    }
    return "";
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
