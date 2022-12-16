import {
  Orientation,
  RenderingMode,
  YasguiConfiguration
} from '../../../models/yasgui-configuration';
import {ExternalYasguiConfiguration} from "../../../models/external-yasgui-configuration";
import {TranslationService} from '../../translation.service';

/**
 * Builder for yasgui configuration.
 */
class YasguiConfigurationBuilderDefinition {

  private defaultOntotextYasguiConfig: Record<string, any> = {
    render: RenderingMode.YASGUI,
    orientation: Orientation.VERTICAL,
    showEditorTabs: true,
    showResultTabs: true,
    showToolbar:true
  }

  private defaultYasguiConfig: Record<string, any> = {
    translate: (key, parameters) => TranslationService.translate(key, parameters),
    copyEndpointOnNewTab: true,
    endpoint: '',
    method: 'POST',
    headers: () => {
      return {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/sparql-results+json',
        'X-GraphDB-Local-Consistency': 'updating'
      };
    }
  }

  private defaultYasqeConfig: Record<string, any> = {
    query: '',
    initialQuery: ''
  }

  /**
   * Builds a yasgui configuration.
   *
   * @param externalConfiguration - custom configuration passed by the component client.
   */
  build(externalConfiguration: ExternalYasguiConfiguration): YasguiConfiguration {
    // @ts-ignore
    const config: YasguiConfiguration = {};
    // prepare the adapter config
    config.render = externalConfiguration.render || this.defaultOntotextYasguiConfig.render;
    config.orientation = externalConfiguration.orientation || this.defaultOntotextYasguiConfig.orientation;
    config.showEditorTabs = externalConfiguration.showEditorTabs !== undefined ? externalConfiguration.showEditorTabs : this.defaultOntotextYasguiConfig.showEditorTabs;
    config.showResultTabs = externalConfiguration.showResultTabs !== undefined ? externalConfiguration.showResultTabs : this.defaultOntotextYasguiConfig.showResultTabs;
    config.showToolbar = externalConfiguration.showToolbar !== undefined ? externalConfiguration.showToolbar : this.defaultOntotextYasguiConfig.showToolbar;
    config.i18n = externalConfiguration.i18n;

    // prepare the yasgui config
    config.yasguiConfig = {
      translate: this.defaultYasguiConfig.translate,
      requestConfig: {}
    };
    config.yasguiConfig.requestConfig.endpoint = externalConfiguration.endpoint || this.defaultYasguiConfig.endpoint;
    config.yasguiConfig.requestConfig.method = externalConfiguration.method || this.defaultYasguiConfig.method;
    config.yasguiConfig.requestConfig.headers = externalConfiguration.headers || this.defaultYasguiConfig.headers;
    config.yasguiConfig.copyEndpointOnNewTab = externalConfiguration.copyEndpointOnNewTab !== undefined ? externalConfiguration.copyEndpointOnNewTab : this.defaultYasguiConfig.copyEndpointOnNewTab;

    // prepare the yasqe config
    config.yasqeConfig = {};
    config.yasqeConfig.query = externalConfiguration.query || this.defaultYasqeConfig.query;
    config.yasqeConfig.initialQuery = externalConfiguration.initialQuery || this.defaultYasqeConfig.initialQuery;

    // prepare the yasr config

    return config;
  }
}

export const YasguiConfigurationBuilder = new YasguiConfigurationBuilderDefinition();
