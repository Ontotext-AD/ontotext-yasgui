import {Configurator} from './configurator';
import {YasguiConfiguration} from '../../../models/yasgui-configuration';
import {YasguiConfigurator} from './yasgui-configurator';
import {YasqeConfigurator} from './yasqe-configurator';
import {YasrConfigurator} from './yasr-configurator';
import {OntotextYasguiConfigurator} from './ontotext-yasgui-configurator';
import deepmerge from 'deepmerge';

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
   * @param externalConfiguration - custom configuration passed by the component client.
   */
  build(externalConfiguration: YasguiConfiguration): YasguiConfiguration {
    // @ts-ignore
    let filledYasguiConfig: YasguiConfiguration = {};
    this.configurators.forEach(configurator => {
      filledYasguiConfig = deepmerge.all([filledYasguiConfig, configurator.config(externalConfiguration)]) as YasguiConfiguration;
    })
    return filledYasguiConfig;
  }

  private initConfigurators() {
    this.configurators = [
      OntotextYasguiConfigurator,
      YasguiConfigurator,
      YasqeConfigurator,
      YasrConfigurator
    ]
  }
}

export const YasguiConfigurationBuilder = new YasguiConfigurationBuilderDefinition();
