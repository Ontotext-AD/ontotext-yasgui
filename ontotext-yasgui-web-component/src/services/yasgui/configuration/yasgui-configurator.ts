import {Configurator} from './configurator';
import {
  Orientation,
  RenderingMode,
  YasguiConfiguration
} from '../../../models/yasgui-configuration';
import deepmerge from 'deepmerge';

/**
 * Manages all top configuration of yasgui.
 */
class YasguiConfiguratorDefinition implements Configurator {

  public static readonly defaultYasguiConfig: YasguiConfiguration = {
    yasguiConfig: {
      render: RenderingMode.YASGUI,
      orientation: Orientation.VERTICAL,
      copyEndpointOnNewTab: true,
      // @ts-ignore
      requestConfig: {
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
    }
  }

  config(config: YasguiConfiguration): YasguiConfiguration {
    return deepmerge.all([{} , YasguiConfiguratorDefinition.defaultYasguiConfig, config || {}]) as YasguiConfiguration;
  }
}

export const YasguiConfigurator = new YasguiConfiguratorDefinition();
