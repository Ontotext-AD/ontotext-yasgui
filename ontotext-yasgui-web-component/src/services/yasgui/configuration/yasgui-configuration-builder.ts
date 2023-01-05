import {
  defaultOntotextYasguiConfig,
  defaultYasguiConfig,
  defaultYasqeConfig,
  YasguiConfiguration
} from '../../../models/yasgui-configuration';
import {
  ExternalYasguiConfiguration,
  PluginButtonDefinition
} from "../../../models/external-yasgui-configuration";
import {EventService} from "../../event-service";
import {YasqeService} from "../../yasqe/yasqe-service";

/**
 * Builder for yasgui configuration.
 */
export class YasguiConfigurationBuilderDefinition {
  private static _instance: YasguiConfigurationBuilderDefinition;

  private _eventService: EventService;
  private _yasqeService: YasqeService;

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
    config.yasguiConfig.requestConfig.headers = externalConfiguration.headers || defaultYasguiConfig.headers;
    config.yasguiConfig.copyEndpointOnNewTab = externalConfiguration.copyEndpointOnNewTab !== undefined ? externalConfiguration.copyEndpointOnNewTab : defaultYasguiConfig.copyEndpointOnNewTab;
    config.yasguiConfig.yasqe.value = externalConfiguration.query || defaultYasqeConfig.query;

    // prepare the yasqe config
    config.yasqeConfig = {};
    config.yasqeConfig.initialQuery = externalConfiguration.initialQuery || defaultYasqeConfig.initialQuery;
    config.yasguiConfig.yasqe.pluginButtons = () => {
      return this.getYasqePluginButtons(externalConfiguration, defaultYasqeConfig);
    }

    // prepare the yasr config

    return config;
  }

  getYasqePluginButtons(externalConfiguration: ExternalYasguiConfiguration, defaultYasqeConfig: Record<string, any>): HTMLElement[] {
    const buttonsMap: Map<string, HTMLElement> = new Map<string, HTMLElement>();
    defaultYasqeConfig.yasqePluginButtons
      .filter((buttonDefinition: PluginButtonDefinition) => buttonDefinition.visible)
      .forEach((buttonDefinition: PluginButtonDefinition) => {
        buttonsMap.set(buttonDefinition.name, this.yasqeService.getButtonInstance(buttonDefinition));
      });

    if (externalConfiguration.yasqePluginButtons && externalConfiguration.yasqePluginButtons.length) {
      externalConfiguration.yasqePluginButtons.forEach((buttonDefinition) => {
        if (buttonDefinition.visible) {
          buttonsMap.set(buttonDefinition.name, this.yasqeService.getButtonInstance(buttonDefinition));
        } else {
          buttonsMap.delete(buttonDefinition.name);
        }
      });
    }
    return Array.from(buttonsMap.values());
  }

  get eventService(): EventService {
    return this._eventService;
  }

  set eventService(value: EventService) {
    this._eventService = value;
  }

  get yasqeService(): YasqeService {
    return this._yasqeService;
  }

  set yasqeService(value: YasqeService) {
    this._yasqeService = value;
  }
}
