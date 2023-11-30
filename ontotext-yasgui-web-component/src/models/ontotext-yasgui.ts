import {Yasgui} from '../../../Yasgui/packages/yasgui'
import {Yasqe} from '../models/yasqe';
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

  getYasqe(): Yasqe {
    return this.yasgui.getTab().getYasqe();
  }

  setQuery(query: string): void {
    this.yasgui.getTab().getYasqe().setValue(query);
  }

  query(): Promise<any> {
    return this.yasgui.getTab().getYasqe().query();
  }

  abortQuery(): void {
    this.yasgui.getTab().getYasqe().abortQuery();
  }

  getQuery(): string {
    return this.yasgui.getTab().getYasqe().getValue();
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

  // @ts-ignore
  getEmbeddedResultAsJson(): Parser.SparqlResults {
    return this.yasgui.getTab().getYasr().results.getAsJson();
  }

  // @ts-ignore
  getEmbeddedResultAsCSV(): Parser.SparqlResults {
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

  openTab(queryModel: TabQueryModel): void {
    const existingTab = this.getInstance().getTabByNameAndQuery(queryModel?.queryName, queryModel?.query);
    if (existingTab) {
      this.getInstance().selectTabId(existingTab.getId());
    } else {
      this.createNewTab(queryModel?.queryName, queryModel?.query);
    }
  }

  createNewTab(queryName: string, query: string): void {
    const tabInstance = this.getInstance().addTab(true, {
      name: queryName
    });
    if (query) {
      tabInstance.setQuery(query);
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
