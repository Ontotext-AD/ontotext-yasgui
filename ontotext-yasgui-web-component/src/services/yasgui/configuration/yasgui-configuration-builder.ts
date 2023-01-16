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
import {ServiceFactory} from '../../service-factory';
import {TranslationService} from '../../translation.service';

/**
 * Builder for yasgui configuration.
 */
export class YasguiConfigurationBuilder {

  private yasqeService: YasqeService;
  private serviceFactory: ServiceFactory;

  constructor(serviceFactory: ServiceFactory) {
    this.serviceFactory = serviceFactory;
    this.yasqeService = serviceFactory.get(YasqeService);
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
      translate: (key, parameters) => this.serviceFactory.get(TranslationService).translate(key, parameters),
      requestConfig: {},
      yasqe: {}
    };
    config.yasguiConfig.requestConfig.endpoint = externalConfiguration.endpoint || defaultYasguiConfig.endpoint;
    config.yasguiConfig.requestConfig.method = externalConfiguration.method || defaultYasguiConfig.method;
    config.yasguiConfig.tabName = externalConfiguration.defaultTabName ||  this.serviceFactory.get(TranslationService).translate('yasgui.tab_list.tab.default.name');
    config.yasguiConfig.requestConfig.headers = externalConfiguration.headers || defaultYasguiConfig.headers;
    config.yasguiConfig.copyEndpointOnNewTab = externalConfiguration.copyEndpointOnNewTab !== undefined ? externalConfiguration.copyEndpointOnNewTab : defaultYasguiConfig.copyEndpointOnNewTab;
    config.yasguiConfig.persistenceLabelConfig = externalConfiguration.componentId || defaultYasguiConfig.persistenceLabelConfig;
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
    const visibleDefaultButtonDefinitions: YasqeActionButtonDefinition[] = defaultYasqeConfig.yasqeActionButtons
      .filter((buttonDefinition: YasqeActionButtonDefinition) => buttonDefinition.visible);

    if (externalConfiguration.yasqeActionButtons && externalConfiguration.yasqeActionButtons.length) {
      externalConfiguration.yasqeActionButtons.forEach((buttonDefinition) => {
        const buttonIndex = visibleDefaultButtonDefinitions.findIndex(
          (defaultButtonDefinition) => defaultButtonDefinition.name === buttonDefinition.name
        );
        if (buttonDefinition.visible) {
          // add new or replace existing definition
          if (buttonIndex == -1) {
            visibleDefaultButtonDefinitions.push(buttonDefinition);
          } else {
            visibleDefaultButtonDefinitions.splice(buttonIndex, 1, buttonDefinition);
          }
        } else {
          visibleDefaultButtonDefinitions.splice(buttonIndex, 1);
        }
      });
    }

    return visibleDefaultButtonDefinitions.map(
      (buttonDefinition) => (this.yasqeService.getButtonInstance(buttonDefinition))
    );
  }
}
