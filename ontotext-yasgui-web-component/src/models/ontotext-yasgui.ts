import {Yasgui} from '../../../Yasgui/packages/yasgui'
import {YasguiConfiguration} from './yasgui-configuration';

export class OntotextYasgui {
  private yasgui: Yasgui
  private readonly config: YasguiConfiguration;

  constructor(yasgui: Yasgui, config: YasguiConfiguration) {
    this.yasgui = yasgui;
    this.config = config;
    this.init();
  }

  setQuery(query: string): void {
    this.yasgui.getTab().getYasqe().setValue(query);
  }

  getQuery(): string {
    return this.yasgui.getTab().getYasqe().getValue();
  }

  /**
   * Initializes ontotext-yasgui component.
   *
   * @private
   */
  private init(): void {
    if (this.config.initialQuery) {
      this.setQuery(this.config.initialQuery);
    }
  }

  addYasqeListener(eventName, callback): void {
    // @ts-ignore
    this.yasgui.getTab().yasqe.on(eventName, (...args) => {
      callback(args);
    });
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

  getConfig() {
    return this.config;
  }

  getInstance(): Yasgui {
    return this.yasgui;
  }
}
