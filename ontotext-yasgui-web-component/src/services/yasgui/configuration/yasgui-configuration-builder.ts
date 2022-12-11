import {Configurator} from './configurator';
import {YasguiConfiguration} from '../../../models/yasgui-configuration';
import {YasguiConfigurator} from './yasgui-configurator';
import {Config} from '../../../../../Yasgui/packages/yasgui'

/**
 * Builder for yasgui configuration.
 */
class YasguiConfigurationBuilderDefinition {

  private configurators: Configurator[];

  constructor() {
    this.initConfigurators();
  }

  /**
   * Builds a yasgui configuration.
   * @param config - custom configuration passed by client of component.
   */
  build(config: YasguiConfiguration): Config {
    return this.configurators
      .reduce((result, configurator) => configurator.config(result, config), {} as Config);
  }

  private initConfigurators() {
    this.configurators = [
      YasguiConfigurator
    ]
  }
}

export const YasguiConfigurationBuilder = new YasguiConfigurationBuilderDefinition();
