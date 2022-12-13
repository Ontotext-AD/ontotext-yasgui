import {Configurator} from './configurator';
import {YasguiConfiguration} from '../../../models/yasgui-configuration';
import {Config} from '../../../../../Yasgui/packages/yasgui'

class YasrConfiguratorDefinition implements Configurator {

  config(el: HTMLElement, config: Config, yasguiConfig: YasguiConfiguration): Config {
    if (yasguiConfig.hasOwnProperty('showResultTabs') && !yasguiConfig.showResultTabs) {
      el.classList.add('hidden-result-tabs');
    } else {
      el.classList.remove('hidden-result-tabs');
    }
    return config;
  }
}

export const YasrConfigurator = new YasrConfiguratorDefinition();
