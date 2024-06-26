import { EventEmitter } from "events";
import { merge, find, isEqual } from "lodash-es";
import initializeDefaults from "./defaults";
import PersistentConfig from "./PersistentConfig";
import { default as Tab, PersistedJson as PersistedTabJson } from "./Tab";

import { EndpointSelectConfig, CatalogueItem } from "./endpointSelect";
import * as shareLink from "./linkUtils";
import ExtendedTabElements from "./extended-TabElements";
import { default as Yasqe, PartialConfig as YasqeConfig, RequestConfig } from "@triply/yasqe";
import { default as Yasr, Config as YasrConfig } from "@triply/yasr";
import {
  addClass,
  EventService,
  NotificationMessageService,
  OngoingRequestsInfo,
  removeClass,
  TimeFormattingService,
  TranslationParameter,
} from "@triply/yasgui-utils";
import { TranslationService } from "@triply/yasgui-utils";
import { CloseTabConfirmation } from "./closeTabConfirmation";
import { YasguiConfiguration } from "../../utils/src/yasgui-configuration"
import {YasguiResetFlags} from "../../utils/src/yasgui-reset-flags";
require("./index.scss");
require("@triply/yasr/src/scss/global.scss");
if (window) {
  //We're storing yasqe and yasr as a member of Yasgui, but _also_ in the window
  //That way, we dont have to tweak e.g. pro plugins to register themselves to both
  //Yasgui.Yasr _and_ Yasr.
  if (Yasqe) (window as any).Yasqe = Yasqe;
  if (Yasr) (window as any).Yasr = Yasr;
}
export type YasguiRequestConfig = Omit<RequestConfig<Yasgui>, "adjustQueryBeforeRequest"> & {
  adjustQueryBeforeRequest: RequestConfig<Yasqe>["adjustQueryBeforeRequest"];
};
export interface Config<EndpointObject extends CatalogueItem = CatalogueItem> {
  /**
   * Autofocus yasqe on load or tab switch
   */
  autofocus: boolean;
  endpointInfo: ((tab?: Tab) => Element) | undefined;
  copyEndpointOnNewTab: boolean;
  defaultTabNameLabelKey: string;
  clearState: boolean;
  corsProxy: string | undefined;
  endpointCatalogueOptions: EndpointSelectConfig<EndpointObject>;
  //The function allows us to modify the config before we pass it on to a tab
  populateFromUrl: boolean | ((configFromUrl: PersistedTabJson) => PersistedTabJson);
  autoAddOnInit: boolean;
  persistenceId: ((yasr: Yasgui) => string) | string | null;
  persistenceLabelConfig: string;
  persistenceLabelResponse: string;
  persistencyExpire: number;
  yasqe: Partial<YasqeConfig>;
  yasr: YasrConfig;
  requestConfig: YasguiRequestConfig;
  contextMenuContainer: HTMLElement | undefined;
  nonSslDomain?: string;
  translationService: TranslationService;
  timeFormattingService: TimeFormattingService;
  notificationMessageService: NotificationMessageService;
  eventService: EventService;
  paginationOn?: boolean;
  pageSize?: number;
  pageNumber: number;
}
export type PartialConfig = {
  [P in keyof Config]?: Config[P] extends object ? Partial<Config[P]> : Config[P];
};

export type TabJson = PersistedTabJson;

export interface Yasgui {
  on(event: string | symbol, listener: (...args: any[]) => void): this;

  on(event: "tabSelect", listener: (instance: Yasgui, newTabId: string) => void): this;
  emit(event: "tabSelect", instance: Yasgui, newTabId: string): boolean;
  on(event: "tabClose", listener: (instance: Yasgui, tab: Tab) => void): this;
  emit(event: "tabClose", instance: Yasgui, tab: Tab): boolean;
  on(event: "query", listener: (instance: Yasgui, tab: Tab) => void): this;
  emit(event: "query", instance: Yasgui, tab: Tab): boolean;
  on(event: "queryAbort", listener: (instance: Yasgui, tab: Tab) => void): this;
  emit(event: "queryAbort", instance: Yasgui, tab: Tab): boolean;
  on(event: "queryResponse", listener: (instance: Yasgui, tab: Tab) => void): this;
  emit(event: "queryResponse", instance: Yasgui, tab: Tab): boolean;
  on(event: "tabChange", listener: (instance: Yasgui, tab: Tab) => void): this;
  emit(event: "tabChange", instance: Yasgui, tab: Tab): boolean;
  on(event: "tabAdd", listener: (instance: Yasgui, newTabId: string) => void): this;
  emit(event: "tabAdd", instance: Yasgui, newTabId: string): boolean;
  on(event: "tabOrderChanged", listener: (instance: Yasgui, tabList: string[]) => void): this;
  emit(event: "tabOrderChanged", instance: Yasgui, tabList: string[]): boolean;
  on(event: "fullscreen-enter", listener: (instance: Yasgui) => void): this;
  emit(event: "fullscreen-enter", instance: Yasgui): boolean;
  on(event: "fullscreen-leave", listener: (instance: Yasgui) => void): this;
  emit(event: "fullscreen-leave", instance: Yasgui): boolean;
  on(event: "endpointHistoryChange", listener: (instance: Yasgui, history: string[]) => void): this;
  emit(event: "endpointHistoryChange", instance: Yasgui, history: string[]): boolean;
  on(event: "autocompletionShown", listener: (instance: Yasgui, tab: Tab, widget: any) => void): this;
  emit(event: "autocompletionShown", instance: Yasgui, tab: Tab, widget: any): boolean;
  on(event: "autocompletionClose", listener: (instance: Yasgui, tab: Tab) => void): this;
  emit(event: "autocompletionClose", instance: Yasgui, tab: Tab): boolean;
  emit(event: "yasqeReady", tab: Tab, yasqe: Yasqe | undefined): boolean;
  emit(event: "queryStatus", tab: Tab, data: any): void;
}
export class Yasgui extends EventEmitter {
  public rootEl: HTMLDivElement;
  public tabElements: ExtendedTabElements;
  public _tabs: { [tabId: string]: Tab } = {};
  public tabPanelsEl: HTMLDivElement;
  public config: Config;
  public persistentConfig: PersistentConfig;
  public static Tab = Tab;

  public readonly translationService: TranslationService;
  public readonly notificationMessageService: NotificationMessageService;
  public readonly eventService: EventService;
  constructor(parent: HTMLElement, config: PartialConfig) {
    super();
    this.rootEl = document.createElement("div");
    addClass(this.rootEl, "yasgui");
    parent.appendChild(this.rootEl);

    this.config = merge({}, Yasgui.defaults, config);

    if (config.yasqe?.extraKeys) {
      // We don't want to merge both shortcut configurations. If shortcuts are passed, we will use them.
      this.config.yasqe.extraKeys = config.yasqe.extraKeys;
    }

    this.translationService = this.config.translationService;
    this.notificationMessageService = this.config.notificationMessageService;
    this.eventService = this.config.eventService;
    this.persistentConfig = new PersistentConfig(this);

    this.tabElements = new ExtendedTabElements(this);
    this.tabPanelsEl = document.createElement("div");

    this.rootEl.appendChild(this.tabElements.drawTabsList());
    this.rootEl.appendChild(this.tabPanelsEl);
    let executeIdAfterInit: string | undefined;
    let optionsFromUrl: PersistedTabJson | undefined;
    if (this.config.populateFromUrl) {
      optionsFromUrl = shareLink.getConfigFromUrl(Tab.getDefaults(this));
      if (optionsFromUrl) {
        const tabId = this.findTabIdForConfig(optionsFromUrl);
        if (tabId) {
          // when a config is already present,
          const persistentYasr = this.persistentConfig.getTab(tabId).yasr;
          this.persistentConfig.getTab(tabId).yasr = {
            // Override the settings
            settings: optionsFromUrl.yasr.settings,
            // Keep the old response to save data/time
            response: persistentYasr.response,
          };
          this.persistentConfig.setActive(tabId);
          if (!persistentYasr.response) {
            //we did have a tab already open for this link, but there wasnt a response
            //probably, it's too large to put in local storage
            //so, lets make sure we execute the query
            executeIdAfterInit = tabId;
          }
        } else {
          this.persistentConfig.setTab(
            optionsFromUrl.id,
            typeof this.config.populateFromUrl === "function"
              ? this.config.populateFromUrl(optionsFromUrl)
              : optionsFromUrl
          );
          executeIdAfterInit = optionsFromUrl.id;
        }
      }
    }
    const tabs = this.persistentConfig.getTabs();
    if (!tabs.length && this.config.autoAddOnInit) {
      const newTab = this.addTab(true);
      if (newTab) {
        this.persistentConfig.setActive(newTab.getId());
        this.emit("tabChange", this, newTab);
        this.emit("yasqeReady", newTab, newTab.getYasqe());
      }
    } else {
      for (const tabId of tabs) {
        this._tabs[tabId] = new Tab(this, this.persistentConfig.getTab(tabId));
        this._registerTabListeners(this._tabs[tabId]);
        // this.tabs[tabId].on("close", tab => this.closeTabId(tab.getId()));
        this.tabElements.drawTab(tabId);
      }
      const activeTabId = this.persistentConfig.getActiveId();
      if (activeTabId) {
        this.markTabSelected(activeTabId);
        if (executeIdAfterInit && executeIdAfterInit === activeTabId) {
          (this.getTab(activeTabId) as Tab).query().catch(() => {});
        }
      }
    }
  }

  public getHandleLocalStorageQuotaFull(): (e: any) => void {
    return () => {
      this.reInitYasgui({resetCurrentTab: false, resetInferResults: false, resetSameAs: false, resetYasr: true});
    };
  }

    /**
     * Reinitializes the YASGUI component with default values from the config.
     * @param {YasguiResetFlags} resetFlags object defining the flags for what to reset
     * @param {YasguiConfiguration} config the YasguiConfiguration used to get the default values
     */
  public reInitYasgui(resetFlags: YasguiResetFlags, config: YasguiConfiguration = {}) {
    const currentId = this.persistentConfig.currentId();
    const refreshYasqe = this.hasFlagsForRefreshYasqe(resetFlags.resetInferResults, config?.yasguiConfig?.infer);
    Object.values(this.persistentConfig.getTabConfig()).forEach((tab: any) => {
      if (resetFlags.resetCurrentTab || currentId !== tab.id) {
        if (resetFlags.resetYasr) {
          tab.yasr.response = null;
        }
      }
      if (refreshYasqe) {
          tab.yasqe.infer = config.yasguiConfig?.infer;
          tab.yasqe.sameAs = config.yasguiConfig?.sameAs || config.yasguiConfig?.infer;
      }
    });
    Object.values(this._tabs).forEach((tab: Tab) => {
      if (resetFlags.resetCurrentTab || currentId !== tab.getId()) {
        this.emitTabChange(tab);
        tab.reInitYasr();
      }
      if (refreshYasqe) {
        tab.getYasqe()?.refresh();
      }
    });
  }

  private hasFlagsForRefreshYasqe(resetInfer: boolean | undefined, configInfer: boolean | undefined) {
      return resetInfer && configInfer !== undefined;
  }

  public hasFullscreen(fullscreen: boolean) {
    if (fullscreen) {
      this.emit("fullscreen-enter", this);
      addClass(this.rootEl, "hasFullscreen");
    } else {
      this.emit("fullscreen-leave", this);
      removeClass(this.rootEl, "hasFullscreen");
    }
  }
  public getStorageId(label: string, getter?: Config["persistenceId"]): string | undefined {
    const persistenceId = getter || this.config.persistenceId;
    if (!persistenceId) return undefined;
    if (typeof persistenceId === "string") return persistenceId + "_" + label;
    return persistenceId(this) + "_" + label;
  }
  public createTabName(name?: string, i: number = 0) {
    if (!name) name = this.translationService.translate(this.config.defaultTabNameLabelKey);
    var fullName = name + (i > 0 ? " " + i : "");
    if (this.tabNameTaken(fullName)) fullName = this.createTabName(name, i + 1);
    return fullName;
  }
  public tabNameTaken(name: string) {
    return find(this._tabs, (tab) => tab.getName() === name);
  }

  public getTabByNameAndQuery(name: string, query: string) {
    // first try to find a tab with the provided name and then find one which has the same query
    const tabsWithSameName = Object.values(this._tabs).filter((tab) => tab.getName() === name);
    let foundTabWithSameQuery: Tab | undefined = tabsWithSameName.find((tab) => {
      return tab.getPersistedJson()?.yasqe?.value === query;
    });
    // if no tab with the exact name and query is found, then search for a tab having only the same query
    if (!name && !foundTabWithSameQuery) {
      foundTabWithSameQuery = Object.values(this._tabs).find((tab) => {
        return tab.getPersistedJson()?.yasqe?.value === query;
      });
    }
    return foundTabWithSameQuery;
  }

  public getTab(tabId?: string): Tab | undefined {
    if (tabId) {
      return this._tabs[tabId];
    }
    const currentTabId = this.persistentConfig.currentId();
    if (currentTabId) return this._tabs[currentTabId];
  }

  //only handle UI interaction, don't emit or store anything
  private markTabSelected(tabId: string): boolean {
    if (!this.persistentConfig.getTab(tabId)) {
      //there is no tab config for this id. We _probably_ deleted a tab by pressing 'x', which fires the 'selectTab'
      //event after. I.e., nothing to select anymore, and we should just ignore this
      return false;
    }
    //mark tab active
    this.tabElements.selectTab(tabId);

    //draw tab content
    if (!this._tabs[tabId]) {
      this._tabs[tabId] = new Tab(this, Tab.getDefaults(this));
    }
    this._tabs[tabId].show();
    this.emit("yasqeReady", this._tabs[tabId], this._tabs[tabId].getYasqe());
    for (const otherTabId in this._tabs) {
      if (otherTabId !== tabId) this._tabs[otherTabId].hide();
    }
    return true;
  }
  public selectTabId(tabId: string) {
    const tab = this.getTab();
    if (tab && tab.getId() !== tabId) {
      if (this.markTabSelected(tabId)) {
        //emit
        this.emit("tabSelect", this, tabId);
        this.persistentConfig.setActive(tabId);
      }
    }
    return tab;
  }
  public closeOtherTabs(skipTabId: string): void {
    const closeOtherTabs = () => {
      for (const tabId of Object.keys(this._tabs)) {
        if (tabId !== skipTabId) {
          this.getTab(tabId)?.close(false);
        }
      }
    };
    new CloseTabConfirmation(
      this.translationService,
      this.translationService.translate("yasgui.tab_list.close_tab.confirmation.title"),
      this.getCloseTabsWarningMessage(this.getOngoingRequestsInfo(skipTabId)),
      closeOtherTabs
    ).open();
  }

  private getCloseTabsWarningMessage(ongoingRequestsInfo: OngoingRequestsInfo): string {
    let closeTabsWarningMessageLabelKey = "yasgui.tab_list.close_other_tabs.confirmation.";

    if (!ongoingRequestsInfo || ongoingRequestsInfo.queriesCount < 1) {
      closeTabsWarningMessageLabelKey += "none_queries_";
    } else if (ongoingRequestsInfo.queriesCount === 1) {
      closeTabsWarningMessageLabelKey += "one_query_";
    } else {
      closeTabsWarningMessageLabelKey += "queries_";
    }

    if (!ongoingRequestsInfo.updatesCount || ongoingRequestsInfo.updatesCount === 0) {
      closeTabsWarningMessageLabelKey += "non_updates";
    } else if (ongoingRequestsInfo.updatesCount === 1) {
      closeTabsWarningMessageLabelKey += "one_update";
    } else {
      closeTabsWarningMessageLabelKey += "updates";
    }

    closeTabsWarningMessageLabelKey += ".message";
    const params: TranslationParameter[] = [
      {
        key: "queriesCount",
        value: `${ongoingRequestsInfo.queriesCount}`,
      },
      {
        key: "updatesCount",
        value: `${ongoingRequestsInfo.updatesCount}`,
      },
    ];
    return this.translationService.translate(closeTabsWarningMessageLabelKey, params);
  }
  public getOngoingRequestsInfo(skipTabId?: string): OngoingRequestsInfo {
    return Object.values(this._tabs).reduce(
      (counts, tab) => {
        if (!!skipTabId && skipTabId === tab.getId()) {
          return counts;
        }

        const yasqe = tab.getYasqe();
        if (yasqe && yasqe.hasOngoingRequest()) {
          const queryMode = yasqe.getQueryMode();
          counts[queryMode === "query" ? "queriesCount" : "updatesCount"] += 1;
        }
        return counts;
      },
      { queriesCount: 0, updatesCount: 0 }
    );
  }

  /**
   * Checks if two persistent tab configuration are the same based.
   * It isnt a strict equality, as falsy values (e.g. a header that isnt set in one tabjson) isnt taken into consideration
   * Things like the yasr response are also not taken into consideration
   * @param tab1 Base comparable object
   * @param tab2 Second comparable object
   */
  private tabConfigEquals(tab1: PersistedTabJson, tab2: PersistedTabJson): boolean {
    let sameRequest = true;

    /**
     * Check request config
     */
    let key: keyof RequestConfig<Yasgui>;
    for (key in tab1.requestConfig) {
      if (!tab1.requestConfig[key]) continue;
      if (!isEqual(tab2.requestConfig[key], tab1.requestConfig[key])) {
        sameRequest = false;
      }
    }
    /**
     * Check yasqe settings
     */
    if (sameRequest) {
      sameRequest = (<Array<keyof PersistedTabJson["yasqe"]>>["endpoint", "value"]).every(
        (key) => tab1.yasqe[key] === tab2.yasqe[key]
      );
    }

    /**
     * Check yasr settings
     */
    if (sameRequest) {
      sameRequest =
        tab1.yasr.settings.selectedPlugin === tab2.yasr.settings.selectedPlugin &&
        isEqual(
          tab1.yasr.settings.pluginsConfig?.[tab1.yasr.settings?.selectedPlugin || ""],
          tab2.yasr.settings.pluginsConfig?.[tab2.yasr.settings?.selectedPlugin || ""]
        );
    }

    return sameRequest && tab1.name === tab2.name;
  }
  private findTabIdForConfig(tabConfig: PersistedTabJson) {
    return this.persistentConfig.getTabs().find((tabId) => {
      const tab = this.persistentConfig.getTab(tabId);
      return this.tabConfigEquals(tab, tabConfig);
    });
  }

  private _registerTabListeners(tab: Tab) {
    tab.on("change", (tab) => {
      this.emit("tabChange", this, tab);
      this.emit("yasqeReady", tab, tab.getYasqe());
    });
    tab.on("yasqeReady", (tab, yasqe) => this.emit("yasqeReady", tab, yasqe));
    tab.on("openNewTab", (tab) => this.addTab(true));
    tab.on("openNextTab", (tab: Tab) => this.openNextTab(tab));
    tab.on("openPreviousTab", (tab: Tab) => this.openPreviousTab(tab));
    tab.on("closeOtherTabs", (tab) => this.closeOtherTabs(tab.getId()));
    tab.on("query", (tab) => this.emit("query", this, tab));
    tab.on("queryAbort", (tab) => this.emit("queryAbort", this, tab));
    tab.on("queryResponse", (tab) => this.emit("queryResponse", this, tab));
    tab.on("autocompletionShown", (tab, widget) => this.emit("autocompletionShown", this, tab, widget));
    tab.on("autocompletionClose", (tab) => this.emit("autocompletionClose", this, tab));
    tab.on("queryStatus", (tab, data) => this.emit("queryStatus", tab, data));
  }

  public openNextTab(tab: Tab) {
    const nextTabId = this.getNextTabId(tab);
    if (nextTabId) {
      this.selectTabId(nextTabId);
    }
  }

  public openPreviousTab(tab: Tab) {
    const nextTabId = this.getPreviousTabId(tab);
    if (nextTabId) {
      this.selectTabId(nextTabId);
    }
  }

  public getNextTabId(tab: Tab): string | undefined {
    const allTabsIds = Object.keys(this._tabs);
    const nextIndex = allTabsIds.indexOf(tab.getId()) + 1;
    return allTabsIds[nextIndex];
  }

  public getPreviousTabId(tab: Tab): string | undefined {
    const allTabsIds = Object.keys(this._tabs);
    const nextIndex = allTabsIds.indexOf(tab.getId()) - 1;
    return allTabsIds[nextIndex];
  }

  public _setPanel(panelId: string, panel: HTMLDivElement) {
    for (const id in this._tabs) {
      if (id !== panelId) this._tabs[id].hide();
    }
    this.tabPanelsEl.appendChild(panel);
  }
  public _removePanel(panel: HTMLDivElement | undefined) {
    if (panel) this.tabPanelsEl.removeChild(panel);
  }

  public emitInternalEvent(type: string, payload?: any): CustomEvent | undefined {
    return this.eventService.emitEvent(this.rootEl, type, payload);
  }

  isQueryRunning() {
    let queryRunning = false;
    if (this._tabs) {
      Object.values(this._tabs).forEach((tab) => {
        if (tab.getYasqe()?.isQueryRunning()) {
          queryRunning = true;
        }
      });
    }
    return queryRunning;
  }
  /**
   * Adds a tab to yasgui
   * @param setActive if the tab should become active when added
   * @param [partialTabConfig]  config to add to the Tab
   * @param [opts] extra options, atIndex, at which position the tab should be added, avoidDuplicateTabs: if the config already exists make that tab active
   *
   * @returns tab
   */
  public addTab(
    setActive: boolean,
    partialTabConfig?: Partial<PersistedTabJson>,
    opts: { atIndex?: number; avoidDuplicateTabs?: boolean } = {}
  ): Tab | undefined {
    const tabConfig = merge({}, Tab.getDefaults(this), partialTabConfig);
    if (tabConfig.id && this.getTab(tabConfig.id)) {
      throw new Error("Duplicate tab ID");
    }
    // Check if we should copy the endpoint in the new tab and only copy if the tabConfig doesn't contain an endpoint
    if (this.config.copyEndpointOnNewTab && !partialTabConfig?.requestConfig?.endpoint) {
      const currentTab = this.getTab();
      if (currentTab) {
        tabConfig.requestConfig.endpoint = currentTab.getEndpoint();
      }
    }
    if (opts.avoidDuplicateTabs) {
      const foundTabId = this.findTabIdForConfig(tabConfig);
      if (foundTabId) {
        return this.selectTabId(foundTabId) as Tab;
      }
    }
    const tabId = tabConfig.id;
    const index = opts.atIndex;
    this.persistentConfig.addToTabList(tabId, index);
    this.emit("tabAdd", this, tabId);
    this._tabs[tabId] = new Tab(this, tabConfig);
    this.emit("tabChange", this, this._tabs[tabId]); //do emit, so the default config is persisted

    this.tabElements.addTab(tabId, index);
    this._registerTabListeners(this._tabs[tabId]);
    if (setActive) {
      this.persistentConfig.setActive(tabId);
      this._tabs[tabId].show();
      this.emit("yasqeReady", this._tabs[tabId], this._tabs[tabId].getYasqe());
    }
    return this._tabs[tabId];
  }

  public emitTabChange(tab: Tab) {
    this.emit("tabChange", this, tab);
  }

  public restoreLastTab() {
    const config = this.persistentConfig.retrieveLastClosedTab();
    if (config) {
      this.addTab(true, config.tab, { atIndex: config.index });
    }
  }
  public destroy() {
    this.removeAllListeners();
    this.tabElements.destroy();
    for (const tabId in this._tabs) {
      const tab = this._tabs[tabId];
      tab.destroy();
    }
    this._tabs = {};

    while (this.rootEl.firstChild) this.rootEl.firstChild.remove();
  }
  public static linkUtils = shareLink;
  public static Yasr = Yasr;
  public static Yasqe = Yasqe;
  public static defaults = initializeDefaults();
  public static corsEnabled: { [endpoint: string]: boolean } = {};
}

export function getRandomId() {
  return Math.random().toString(36).substring(7);
}

export default Yasgui;
