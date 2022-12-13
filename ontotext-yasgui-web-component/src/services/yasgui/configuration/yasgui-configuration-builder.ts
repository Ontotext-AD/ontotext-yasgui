import {Configurator} from './configurator';
import {YasguiConfiguration} from '../../../models/yasgui-configuration';
import {YasguiConfigurator} from './yasgui-configurator';
import {Config} from '../../../../../Yasgui/packages/yasgui'
import {YasqeConfigurator} from './yasqe-configurator';
import {YasrConfigurator} from './yasr-configurator';

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
   * @param el - hte ontotext-yasgui element.
   * @param config - custom configuration passed by client of component.
   */
  build(el: HTMLElement, config: YasguiConfiguration): Config {
    return this.configurators
      .reduce((result, configurator) => configurator.config(el, result, config), {} as Config);
  }

  private initConfigurators() {
    this.configurators = [
      YasguiConfigurator,
      YasqeConfigurator,
      YasrConfigurator
    ]
  }
}

export const YasguiConfigurationBuilder = new YasguiConfigurationBuilderDefinition();
