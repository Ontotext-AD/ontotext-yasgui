import {Configurator} from './configurator';
import {YasguiConfiguration} from '../../../models/yasgui-configuration';
import deepmerge from 'deepmerge';

class YasrConfiguratorDefinition implements Configurator {

  config(config: YasguiConfiguration): YasguiConfiguration {
    return deepmerge.all([{}, config]) as YasguiConfiguration;
  }
}

export const YasrConfigurator = new YasrConfiguratorDefinition();
