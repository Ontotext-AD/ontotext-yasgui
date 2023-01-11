import {Yasgui} from '../../../Yasgui/packages/yasgui'
import {YasguiConfiguration} from './yasgui-configuration';

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
  private readonly config: YasguiConfiguration;

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

  getConfig() {
    return this.config;
  }

  getInstance(): Yasgui {
    return this.yasgui;
  }

  getTabName(): string {
    return this.getInstance().getTab().getName();
  }

  // TODO: What's the difference between getQuery() and this method?
  getTabQuery(): string {
    return this.getInstance().getTab().getQuery();
  }

  destroy() {
    if (this.yasgui) {
      Object.keys(this.yasgui._tabs).forEach((tabId) => {
        const tab = this.yasgui._tabs[tabId];
        tab.getYasr() && tab.getYasr().destroy();
      });
      this.yasgui.destroy();
      // this.yasguiElement = null;
      this.yasgui = null;
      localStorage.removeItem('yasqe__query');
    }
  }
}
