import {Configurator} from './configurator';
import {YasguiConfiguration} from '../../../models/yasgui-configuration';
import {Config} from '../../../../../Yasgui/packages/yasgui'

class YasqeConfiguratorDefinition implements Configurator {

  config(el: HTMLElement, config: Config, yasguiConfig: YasguiConfiguration): Config {
    if (yasguiConfig.hasOwnProperty('showEditorTabs') && !yasguiConfig.showEditorTabs) {
      el.classList.add('hidde-editor-tabs');
    } else {
      el.classList.remove('hidde-editor-tabs');
    }

    // @ts-ignore
    if (yasguiConfig.query && window.Yasgui) {
      // @ts-ignore
      window.Yasgui.Yasqe.defaults.value = yasguiConfig.query;
    }
    return config;
  }
}

export const YasqeConfigurator = new YasqeConfiguratorDefinition();
