import {
  defaultOntotextYasguiConfig,
  defaultYasguiConfig,
  defaultYasqeConfig,
  YasguiConfiguration
} from '../../../models/yasgui-configuration';
import {ExternalYasguiConfiguration} from "../../../models/external-yasgui-configuration";

/**
 * Builder for yasgui configuration.
 */
class YasguiConfigurationBuilderDefinition {

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

    // prepare the yasr config

    return config;
  }
}

export const YasguiConfigurationBuilder = new YasguiConfigurationBuilderDefinition();
