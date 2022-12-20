import {YasguiConfiguration} from '../../../models/yasgui-configuration';

/**
 * The configuration of the yasgui component is divided into many configurators for easy maintenance and extension of yasgui.
 * Every configurator have to implement {@see Configurator} interface.
 */
export interface Configurator {

  /**
   * Apply configuration to <code>yasguiConfig</code> from <code>clientYasguiConfig</code>
   * @param config - configuration passed by client.
   * @return configuration - populated with default values of concrete configuration.
   */
  config(config: YasguiConfiguration): YasguiConfiguration;
}
