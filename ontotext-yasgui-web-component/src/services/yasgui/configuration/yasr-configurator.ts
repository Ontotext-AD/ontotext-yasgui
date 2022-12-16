import {Configurator} from './configurator';
import {YasguiConfiguration} from '../../../models/yasgui-configuration';
import {Config} from '../../../../../Yasgui/packages/yasgui'
import {HtmlElementsUtil} from '../../utils/html-elements-util';

class YasrConfiguratorDefinition implements Configurator {

  config(hostElement: HTMLElement, config: Config, yasguiConfig: YasguiConfiguration): Config {
    const ontotextYasgui = HtmlElementsUtil.getOntotextYasgui(hostElement);
    if (this.haveToHiddeResultTabs(yasguiConfig)) {
      ontotextYasgui.classList.add('hidden-result-tabs');
    } else {
      ontotextYasgui.classList.remove('hidden-result-tabs');
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
