import {Configurator} from './configurator';
import {YasguiConfiguration} from '../../../models/yasgui-configuration';
import deepmerge from 'deepmerge';

class YasqeConfiguratorDefinition implements Configurator {

  config(config: YasguiConfiguration): YasguiConfiguration {

    // @ts-ignore
    if (config.query && window.Yasgui) {
      // @ts-ignore
      window.Yasgui.Yasqe.defaults.value = config.query;
    }
    return deepmerge.all([{}, config]) as YasguiConfiguration;
  }
}

export const YasqeConfigurator = new YasqeConfiguratorDefinition();
