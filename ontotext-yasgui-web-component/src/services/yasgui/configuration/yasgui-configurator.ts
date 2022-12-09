import {Configurator} from './configurator';
import {YasguiConfiguration} from '../../../models/yasgui-configuration';
import {Config} from '../../../../../Yasgui/packages/yasgui'

/**
 * Manages all top configuration of yasgui.
 *
 */
class YasguiConfiguratorDefinition implements Configurator {

  private defaultYasguiConfig = {
    copyEndpointOnNewTab: true,
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

  config(config: Config, yasguiConfig: YasguiConfiguration): Config {
    return {... config, ... this.defaultYasguiConfig, ... yasguiConfig.yasguiConfig};
  }
}

export const YasguiConfigurator = new YasguiConfiguratorDefinition();
