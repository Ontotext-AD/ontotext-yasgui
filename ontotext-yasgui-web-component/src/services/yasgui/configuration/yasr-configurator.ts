import {Configurator} from './configurator';
import {YasguiConfiguration} from '../../../models/yasgui-configuration';
import deepmerge from 'deepmerge';

class YasrConfiguratorDefinition implements Configurator {

  config(externalConfiguration: YasguiConfiguration): YasguiConfiguration {
    return deepmerge.all([{}, externalConfiguration]) as YasguiConfiguration;
  }
}

export const YasrConfigurator = new YasrConfiguratorDefinition();
