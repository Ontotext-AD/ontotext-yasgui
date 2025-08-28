import {Yasqe} from './yasgui/yasqe';
import {YasguiConfiguration} from './yasgui-configuration';
import {TabQueryModel} from "./external-yasgui-configuration";
import {Yasgui} from './yasgui/yasgui';
import {Tab} from './yasgui/tab';
import {OngoingRequestsInfo} from './ongoing-requests-info';
import {YasguiResetFlags} from "./yasgui/yasgui-reset-flags";
import {EXPLAIN_PLAN_TYPE} from './keyboard-shortcut-description';

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
    const yasqe = this.yasgui.getTab().getYasqe();
    const cursor = yasqe.getDoc().getCursor();
    const lastLine = yasqe.getDoc().lastLine();
    const lastLineLength = yasqe.getDoc().getLine(lastLine).length;
    yasqe.getDoc().replaceRange(query, {line: 0, ch: 0}, {line: lastLine, ch: lastLineLength});
    yasqe.getDoc().setCursor(cursor);
  }

  query(config?: any, explainType?: EXPLAIN_PLAN_TYPE | undefined): Promise<any> {
    return this.yasgui.getTab().getYasqe().query(config, explainType);
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
   * Reinitializes the Yasgui component by resetting the defined flags to those in the configuration.
   * Clears the results of the query.
   * @param resetFlags - the flags object used when resetting the Yasgui component
   */
  reInitYasgui(resetFlags: YasguiResetFlags): void {
    this.yasgui.reInitYasgui(resetFlags, this.config);
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

  /**
   * Searches the local store for the given tab ID and returns the height for the yasqe editor. If no height can be found,
   * the default 300 is returned.
   * @param tabId
   */
  getEditorHeight(tabId: string): number {
    const heightString = this.getInstance().getTab(tabId).persistentJson.yasqe.editorHeight;
    if (heightString) {
      return parseInt(heightString.replace("px", ""), 10);
    } else {
      return 300;
    }
  }

  destroy() {
    if (this.yasgui) {
      this.yasgui.destroy();
      this.yasgui = null;
      localStorage.removeItem('yasqe__query');
    }
  }
}
