import {YasguiConfiguration} from '../../../models/yasgui-configuration';
import {Config} from '../../../../../Yasgui/packages/yasgui'

/**
 * The configuration of the yasgui component is divided into many configurators for easy maintenance and extension of yasgui.
 * Every configurator have to implement {@see Configurator} interface.
 */
export interface Configurator {

  /**
   * Apply configuration to <code>yasguiConfig</code> from <code>clientYasguiConfig</code>
   * @param config - configuration which is passing to yasgui constructor.
   * @param yasguiConfig - configuration passed by client.
   */
  config(config: Config, yasguiConfig: YasguiConfiguration);
}
