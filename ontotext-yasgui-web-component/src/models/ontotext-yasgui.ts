import {Yasgui} from '../../../Yasgui/packages/yasgui'
import {YasguiConfiguration} from './yasgui-configuration';
import {TabQueryModel} from "./external-yasgui-configuration";

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
    // @ts-ignore
    this.yasgui.getTab().yasqe.on(eventName, (...args) => {
      callback(args);
    });
  }

  setQuery(query: string): void {
    this.yasgui.getTab().getYasqe().setValue(query);
  }

  getQuery(): string {
    return this.yasgui.getTab().getYasqe().getValue();
  }

  getQueryMode(): string {
    return this.yasgui.getTab().getYasqe().getQueryMode();
  }

  getQueryType(): string {
    return this.yasgui.getTab().getYasqe().getQueryType();
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

  getTabName(): string {
    return this.getInstance().getTab().getName();
  }

  // TODO: What's the difference between getQuery() and this method?
  getTabQuery(): string {
    return this.getInstance().getTab().getQuery();
  }

  openTab(queryModel: TabQueryModel): void {
    const existingTab = this.getInstance().tabNameTaken(queryModel.queryName);
    const config = existingTab?.getPersistedJson();
    // We can't get the query directly from the tab because if the tab hasn't been opened before
    // then the yasqe won't be initialized. That's why we get the query from the tab's persistence.
    const isSameQuery = config?.yasqe?.value === queryModel.query;
    if (existingTab && isSameQuery) {
      this.getInstance().selectTabId(existingTab.getId());
    } else {
      this.createNewTab(queryModel.queryName, queryModel.query);
    }
  }

  createNewTab(queryName: string, query: string): void {
    const tabInstance = this.getInstance().addTab(true, {
      name: queryName
    });
    tabInstance.setQuery(query);
  }

  destroy() {
    if (this.yasgui) {
      this.yasgui.destroy();
      this.yasgui = null;
      localStorage.removeItem('yasqe__query');
    }
  }
}
