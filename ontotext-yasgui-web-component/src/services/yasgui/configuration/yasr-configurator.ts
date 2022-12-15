import {Configurator} from './configurator';
import {YasguiConfiguration} from '../../../models/yasgui-configuration';
import {Config} from '../../../../../Yasgui/packages/yasgui'

class YasrConfiguratorDefinition implements Configurator {

  config(el: HTMLElement, config: Config, yasguiConfig: YasguiConfiguration): Config {
    if (this.haveToHiddeResultTabs(yasguiConfig)) {
      el.classList.add('hidden-result-tabs');
    } else {
      el.classList.remove('hidden-result-tabs');
    }
    return config;
  }

  private haveToHiddeResultTabs(yasguiConfig: YasguiConfiguration) {
    if (yasguiConfig.showResultTabs === undefined || yasguiConfig.showResultTabs === null) {
      return false;
    }
    return !yasguiConfig.showResultTabs;
  }
}

export const YasrConfigurator = new YasrConfiguratorDefinition();
