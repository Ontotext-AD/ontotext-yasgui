import { Storage as YStorage } from "@triply/yasgui-utils";
import Yasgui from "./";
import * as Tab from "./Tab";
export var storageNamespace = "triply";
export interface PersistedJson {
  endpointHistory: string[];
  tabs: string[];
  active: string | undefined;
  tabConfig: { [tabId: string]: Tab.PersistedJson };
  lastClosedTab: { index: number; tab: Tab.PersistedJson } | undefined;
}
function getDefaults(): PersistedJson {
  return {
    endpointHistory: [],
    tabs: [],
    active: undefined,
    tabConfig: {},
    lastClosedTab: undefined,
  };
}

export default class PersistentConfig {
  private storageId: string | undefined;
  private yasgui: Yasgui;
  private storage: YStorage;

  private activeTabId: string | undefined;
  private endpointHistory: string[];
  private lastClosedTab: boolean;

  constructor(yasgui: Yasgui) {
    this.yasgui = yasgui;
    this.storageId = this.yasgui.getStorageId(this.yasgui.config.persistenceLabelConfig);
    this.storage = new YStorage(storageNamespace);
    const persistence = this.getPersistedJson();
    this.endpointHistory = persistence.endpointHistory || [];
    this.activeTabId = persistence.active;
    this.lastClosedTab = !!persistence.lastClosedTab;
    // this.fromStorage();
    this.registerListeners();
  }

  private getPersistedJson(): PersistedJson {
    return this.storage.get<PersistedJson>(this.storageId) || getDefaults();
  }

  public setActive(id: string) {
    const persistedJson = this.getPersistedJson();
    persistedJson.active = id;
    this.activeTabId = id;
    this.toStorage(persistedJson);
  }
  public getActiveId(): string | undefined {
    return this.activeTabId;
  }
  public addToTabList(tabId: string, index?: number) {
    const persistedJson = this.getPersistedJson();
    if (index !== undefined && persistedJson.tabs.length > index) {
      persistedJson.tabs.splice(index, 0, tabId);
    } else {
      persistedJson.tabs.push(tabId);
    }

    this.toStorage(persistedJson);
  }
  public setTabOrder(tabs: string[]) {
    const persistedJson = this.getPersistedJson();
    persistedJson.tabs = tabs;
    this.toStorage(persistedJson);
  }
  public getEndpointHistory() {
    return this.endpointHistory || [];
  }
  public retrieveLastClosedTab() {
    this.lastClosedTab = false;
    const persistedJson = this.getPersistedJson();
    const tabCopy = persistedJson.lastClosedTab;
    if (tabCopy === undefined) return tabCopy;
    persistedJson.lastClosedTab = undefined;
    return tabCopy;
  }
  public hasLastClosedTab() {
    return this.lastClosedTab;
  }
  public deleteTab(tabId: string) {
    const persistedJson = this.getPersistedJson();
    const i = persistedJson.tabs.indexOf(tabId);
    if (i > -1) {
      persistedJson.tabs.splice(i, 1);
    }
    if (this.tabIsActive(tabId)) {
      persistedJson.active = undefined;
      this.activeTabId = persistedJson.active;
    }
    persistedJson.lastClosedTab = { index: i, tab: persistedJson.tabConfig[tabId] };
    this.lastClosedTab = true;
    delete persistedJson.tabConfig[tabId];
    this.toStorage(persistedJson);
  }

  private registerListeners() {
    this.yasgui.on("tabChange", (_yasgui, tab) => {
      const persistedJson = this.getPersistedJson();
      persistedJson.tabConfig[tab.getId()] = tab.getPersistedJson();
      this.toStorage(persistedJson);
    });
    this.yasgui.on("endpointHistoryChange", (_yasgui, history) => {
      const persistedJson = this.getPersistedJson();
      persistedJson.endpointHistory = history;
      this.endpointHistory = persistedJson.endpointHistory;
      this.toStorage(persistedJson);
    });
  }

  public toStorage(persistedJson: PersistedJson) {
    const onQuotaExceeded = this.yasgui.getHandleLocalStorageQuotaFull
      ? this.yasgui.getHandleLocalStorageQuotaFull()
      : this.handleLocalStorageQuotaFull;
    this.storage.set(this.storageId, persistedJson, this.yasgui.config.persistencyExpire, onQuotaExceeded);
  }

  private handleLocalStorageQuotaFull(_e: any) {
    console.warn("Localstorage quota exceeded. Clearing all YASGUI configurations");
    PersistentConfig.clear();
  }

  public getTabs() {
    return this.getPersistedJson().tabs;
  }
  public getTab(tabId: string) {
    return this.getPersistedJson().tabConfig[tabId];
  }

  /**
   * We shouldnt normally need this (as this object simply listens to tab change events)
   * Only exception is when we're loading a tab config from the url
   * Then we'd like to forward that config to this object, so we can simply keep initializing from this persistence class
   */
  public setTab(tabId: string, tabConfig: Tab.PersistedJson) {
    // this.persistedJson.tabs.push(tabId);
    // this.persistedJson.tabConfig[tabId] = tabConfig;
    // this.persistedJson.active = tabId;
  }
  public tabIsActive(tabId: string) {
    return tabId === this.activeTabId;
  }
  public currentId() {
    return this.activeTabId;
  }

  public getTabConfig() {
    return this.getPersistedJson().tabConfig;
  }
  public static clear() {
    const storage = new YStorage(storageNamespace);
    storage.removeNamespace();
  }
}
