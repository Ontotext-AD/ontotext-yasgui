import {Yasgui} from '../../../Yasgui/packages/yasgui'
import {YasguiConfiguration} from './yasgui-configuration';

export class OntotextYasgui {
  private yasgui: Yasgui

  constructor(yasgui: Yasgui, config: YasguiConfiguration) {
    this.yasgui = yasgui;
    this.init(config);
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
   * @param config
   * @private
   */
  private init(config): void {
    if (config.initialQuery) {
      this.setQuery(config.initialQuery);
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

  getInstance(): Yasgui {
    return this.yasgui;
  }
}
