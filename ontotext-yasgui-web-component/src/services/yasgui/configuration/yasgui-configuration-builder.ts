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
import {YasrService} from '../../yasr/yasr-service';

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
      infer: externalConfiguration.infer !== undefined ? externalConfiguration.infer : defaultYasguiConfig.infer,
      sameAs: externalConfiguration.sameAs !== undefined ? externalConfiguration.sameAs : defaultYasguiConfig.sameAs,
      requestConfig: {},
      yasqe: {},
      yasr: {
        prefixes: {},
        defaultPlugin: '',
        pluginOrder: [],
        externalPluginsConfigurations: YasrService.getPluginsConfigurations()
      }
    };
    config.yasguiConfig.requestConfig.endpoint = externalConfiguration.endpoint || defaultYasguiConfig.endpoint;
    config.yasguiConfig.requestConfig.method = externalConfiguration.method || defaultYasguiConfig.method;
    config.yasguiConfig.requestConfig.args = () => {
      return [
        {name: 'infer', value: config.yasguiConfig.infer + ''},
        {name: 'sameAs', value: config.yasguiConfig.sameAs + ''}
      ];
    }
    config.yasguiConfig.tabName = externalConfiguration.defaultTabName ||  this.serviceFactory.get(TranslationService).translate('yasgui.tab_list.tab.default.name');
    config.yasguiConfig.requestConfig.headers = externalConfiguration.headers || defaultYasguiConfig.headers;
    config.yasguiConfig.copyEndpointOnNewTab = externalConfiguration.copyEndpointOnNewTab !== undefined ? externalConfiguration.copyEndpointOnNewTab : defaultYasguiConfig.copyEndpointOnNewTab;
    config.yasguiConfig.persistenceLabelConfig = externalConfiguration.componentId || defaultYasguiConfig.persistenceLabelConfig;
    config.yasguiConfig.populateFromUrl = externalConfiguration.populateFromUrl || defaultYasguiConfig.populateFromUrl;
    config.yasguiConfig.yasr.prefixes = externalConfiguration.prefixes || defaultYasguiConfig.prefixes;
    config.yasguiConfig.yasr.defaultPlugin = externalConfiguration.defaultPlugin || defaultYasguiConfig.defaultPlugin;
    config.yasguiConfig.yasr.pluginOrder = externalConfiguration.pluginOrder || defaultYasguiConfig.pluginOrder;

    // prepare the yasqe config
    config.yasguiConfig.yasqe.value = externalConfiguration.query || defaultYasqeConfig.query;
    config.yasqeConfig = {};
    config.yasqeConfig.initialQuery = externalConfiguration.initialQuery || defaultYasqeConfig.initialQuery;
    config.yasguiConfig.yasqe.createShareableLink = externalConfiguration.createShareableLink || defaultYasqeConfig.createShareableLink;

    config.yasguiConfig.yasqe.yasqeActionButtons =
      externalConfiguration.yasqeActionButtons !== undefined && externalConfiguration.yasqeActionButtons.length ?
        externalConfiguration.yasqeActionButtons : defaultYasqeConfig.yasqeActionButtons;

    config.yasguiConfig.yasqe.pluginButtons = () => {
      return this.getYasqeActionButtons(config, defaultYasqeConfig);
    };
    config.yasguiConfig.yasqe.showQueryButton = true;

    YasrService.disablePlugin('table');

    // prepare the yasr config

    return config;
  }

  getYasqeActionButtons(yasguiConfiguration: YasguiConfiguration, defaultYasqeConfig: Record<string, any>): HTMLElement[] {
    const visibleDefaultButtonDefinitions: YasqeActionButtonDefinition[] = defaultYasqeConfig.yasqeActionButtons
      .filter((buttonDefinition: YasqeActionButtonDefinition) => buttonDefinition.visible);

    if (yasguiConfiguration.yasguiConfig.yasqe.yasqeActionButtons && yasguiConfiguration.yasguiConfig.yasqe.yasqeActionButtons.length) {
      yasguiConfiguration.yasguiConfig.yasqe.yasqeActionButtons.forEach((buttonDefinition) => {
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
      (buttonDefinition) => (this.yasqeService.getButtonInstance(buttonDefinition, yasguiConfiguration))
    );
  }
}
