import {
  defaultOntotextYasguiConfig,
  defaultYasguiConfig,
  defaultYasqeConfig,
  YasguiConfiguration
} from '../../../models/yasgui-configuration';
import {
  ExternalYasguiConfiguration,
  YasqeActionButtonDefinition
} from "../../../models/external-yasgui-configuration";
import {YasqeService} from "../../yasqe/yasqe-service";

/**
 * Builder for yasgui configuration.
 */
export class YasguiConfigurationBuilderDefinition {
  private static _instance: YasguiConfigurationBuilderDefinition;

  private yasqeService: YasqeService;

  constructor() {
    this.yasqeService = YasqeService.Instance;
  }


  static get Instance(): YasguiConfigurationBuilderDefinition {
    if (!this._instance) {
      this._instance = new YasguiConfigurationBuilderDefinition();
    }
    return this._instance;
  }

  /**
   * Builds a yasgui configuration.
   *
   * @param externalConfiguration - custom configuration passed by the component client.
   */
  build(externalConfiguration: ExternalYasguiConfiguration): YasguiConfiguration {
    const config: YasguiConfiguration = {};
    // prepare the adapter config
    config.render = externalConfiguration.render || defaultOntotextYasguiConfig.render;
    config.orientation = externalConfiguration.orientation || defaultOntotextYasguiConfig.orientation;
    config.showEditorTabs = externalConfiguration.showEditorTabs !== undefined ? externalConfiguration.showEditorTabs : defaultOntotextYasguiConfig.showEditorTabs;
    config.showControlBar = externalConfiguration.showControlBar !== undefined ? externalConfiguration.showControlBar : defaultOntotextYasguiConfig.showControlBar;
    config.showResultTabs = externalConfiguration.showResultTabs !== undefined ? externalConfiguration.showResultTabs : defaultOntotextYasguiConfig.showResultTabs;
    config.showToolbar = externalConfiguration.showToolbar !== undefined ? externalConfiguration.showToolbar : defaultOntotextYasguiConfig.showToolbar;
    config.i18n = externalConfiguration.i18n;

    // prepare the yasgui config
    config.yasguiConfig = {
      translate: defaultYasguiConfig.translate,
      requestConfig: {},
      yasqe: {}
    };
    config.yasguiConfig.requestConfig.endpoint = externalConfiguration.endpoint || defaultYasguiConfig.endpoint;
    config.yasguiConfig.requestConfig.method = externalConfiguration.method || defaultYasguiConfig.method;
    config.yasguiConfig.tabName = externalConfiguration.defaultTabName || defaultYasguiConfig.defaultTabName;
    config.yasguiConfig.requestConfig.headers = externalConfiguration.headers || defaultYasguiConfig.headers;
    config.yasguiConfig.copyEndpointOnNewTab = externalConfiguration.copyEndpointOnNewTab !== undefined ? externalConfiguration.copyEndpointOnNewTab : defaultYasguiConfig.copyEndpointOnNewTab;
    config.yasguiConfig.yasqe.value = externalConfiguration.query || defaultYasqeConfig.query;

    // prepare the yasqe config
    config.yasqeConfig = {};
    config.yasqeConfig.initialQuery = externalConfiguration.initialQuery || defaultYasqeConfig.initialQuery;
    config.yasguiConfig.yasqe.pluginButtons = () => {
      return this.getYasqeActionButtons(externalConfiguration, defaultYasqeConfig);
    }

    // prepare the yasr config

    return config;
  }

  getYasqeActionButtons(externalConfiguration: ExternalYasguiConfiguration, defaultYasqeConfig: Record<string, any>): HTMLElement[] {
    const buttonsMap: Map<string, HTMLElement> = new Map<string, HTMLElement>();
    defaultYasqeConfig.yasqeActionButtons
      .filter((buttonDefinition: YasqeActionButtonDefinition) => buttonDefinition.visible)
      .forEach((buttonDefinition: YasqeActionButtonDefinition) => {
        buttonsMap.set(buttonDefinition.name, this.yasqeService.getButtonInstance(buttonDefinition));
      });

    if (externalConfiguration.yasqeActionButtons && externalConfiguration.yasqeActionButtons.length) {
      externalConfiguration.yasqeActionButtons.forEach((buttonDefinition) => {
        if (buttonDefinition.visible) {
          buttonsMap.set(buttonDefinition.name, this.yasqeService.getButtonInstance(buttonDefinition));
        } else {
          buttonsMap.delete(buttonDefinition.name);
        }
      });
    }
    return Array.from(buttonsMap.values());
  }
}
