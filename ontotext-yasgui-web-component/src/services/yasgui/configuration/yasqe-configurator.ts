import {Configurator} from './configurator';
import {YasguiConfiguration} from '../../../models/yasgui-configuration';
import deepmerge from 'deepmerge';

class YasqeConfiguratorDefinition implements Configurator {

  config(externalConfiguration: YasguiConfiguration): YasguiConfiguration {

    // @ts-ignore
    if (externalConfiguration.query && window.Yasgui) {
      // @ts-ignore
      window.Yasgui.Yasqe.defaults.value = externalConfiguration.query;
    }
    return deepmerge.all([{}, externalConfiguration]) as YasguiConfiguration;
  }
}

export const YasqeConfigurator = new YasqeConfiguratorDefinition();
