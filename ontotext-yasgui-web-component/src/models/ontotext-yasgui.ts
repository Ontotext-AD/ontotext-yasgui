import {Yasqe} from './yasgui/yasqe';
import {YasguiConfiguration} from './yasgui-configuration';
import {TabQueryModel} from "./external-yasgui-configuration";
import {Yasgui} from './yasgui/yasgui';
import {Tab} from './yasgui/tab';
import {OngoingRequestsInfo} from './ongoing-requests-info';

/**
 * An adapter around the actual yasgui instance.
 */
export class OntotextYasgui {
  /**
   * The yasgui instance.
   */
  private yasgui: Yasgui

  /**
   * The yasgui configuration.
   */
  private config: YasguiConfiguration;

  constructor(yasgui: Yasgui, config: YasguiConfiguration) {
    this.yasgui = yasgui;
    this.config = config;
    this.init();
  }

  refresh(): void {
    this.yasgui.getTab().show();
  }

  /**
   * Initializes the adapter.
   */
  private init(): void {
    if (this.config.yasqeConfig.initialQuery) {
      this.setQuery(this.config.yasqeConfig.initialQuery);
    }
  }

  registerYasqeEventListener(eventName, callback): void {
    this.yasgui.getTab().yasqe.on(eventName, (...args) => {
      callback(args);
    });
  }

  getYasqe(): Yasqe {
    return this.yasgui?.getTab().getYasqe();
  }

  leaveFullScreen(): void {
    this.getYasqe()?.leaveFullScreen();
  }

  /**
   * Sets a query value in the editor by preserving the cursor position.
   * @param query The query value to be set.
   */
  setQuery(query: string): void {
    const cursor = this.yasgui.getTab().getYasqe().getDoc().getCursor();
    this.yasgui.getTab().getYasqe().setValue(query);
    this.yasgui.getTab().getYasqe().getDoc().setCursor(cursor);
  }

  query(): Promise<any> {
    return this.yasgui.getTab().getYasqe().query();
  }

  getOngoingRequestsInfo(): OngoingRequestsInfo {
    return this.getInstance().getOngoingRequestsInfo();
  }

  abortQuery(): void {
    this.yasgui.getTab().getYasqe().abortQuery();
  }

  abortAllRequests(): void {
    Object.values(this.yasgui._tabs).forEach((tab: any) => {
      const yasqe = tab.getYasqe();
      if (yasqe) {
        yasqe.abortQuery();
      }
    });
  }

  /**
   * Removes the sparql results from the in-memory persistence json object. Then it emits a tab change event to apply
   * the changes in the storage.
   * @param resetCurrentTab - controls if the current tab has to be reset. If true, the results of the current tab will be reset as well.
   * Default is true.
   */
  resetResults(resetCurrentTab = true): void {
    this.yasgui.resetResults(resetCurrentTab);
  }

  getQuery(): string {
    return this.yasgui.getTab().getYasqe().getValue();
  }

  saveQuery(): void {
    this.getInstance().getTab().getYasqe().emit('blur');
  }

  isQueryDirty(): boolean {
    return !this.getYasqe().getDoc().isClean();
  }

  isQueryValid(): boolean {
    return this.yasgui.getTab().getYasqe().queryValid;
  }

  getQueryMode(): string {
    return this.yasgui.getTab().getYasqe().getQueryMode();
  }

  getQueryType(): string {
    return this.yasgui.getTab().getYasqe().getQueryType();
  }

  getEmbeddedResultAsJson(): string {
    return this.yasgui.getTab().getYasr().results.getAsJson();
  }

  getEmbeddedResultAsCSV(): string {
    return this.yasgui.getTab().getYasr().results.asCsv();
  }

  getConfig() {
    return this.config;
  }

  setConfig(yasguiConfiguration: YasguiConfiguration) {
    this.config = yasguiConfiguration;
  }

  getInstance(): Yasgui {
    return this.yasgui;
  }

  setInstance(yasgui: Yasgui): void {
    this.yasgui = yasgui;
  }

  getTab(tabId?: string) {
    return this.getInstance().getTab(tabId);
  }

  getTabId(): string {
    return this.getInstance().getTab().getId();
  }

  getTabName(): string {
    return this.getInstance().getTab().getName();
  }

  // TODO: What's the difference between getQuery() and this method?
  getTabQuery(): string {
    return this.getInstance().getTab().getQuery();
  }

  openTab(queryModel: TabQueryModel): Tab {
    const existingTab = this.getInstance().getTabByNameAndQuery(queryModel?.queryName, queryModel?.query);
    if (existingTab) {
      this.getInstance().selectTabId(existingTab.getId());
      return existingTab;
    } else {
      return this.createNewTab(queryModel?.queryName, queryModel?.query);
    }
  }

  createNewTab(queryName: string, query: string): Tab {
    const tabInstance = this.getInstance().addTab(true, {
      name: queryName
    });
    if (query) {
      tabInstance.setQuery(query);
    }
    return tabInstance;
  }

  destroy() {
    if (this.yasgui) {
      this.yasgui.destroy();
      this.yasgui = null;
      localStorage.removeItem('yasqe__query');
    }
  }
}
