import {Configurator} from './configurator';
import {YasguiConfiguration} from '../../../models/yasgui-configuration';
import {Config} from '../../../../../Yasgui/packages/yasgui'

class YasqeConfiguratorDefinition implements Configurator {

  config(el: HTMLElement, config: Config, yasguiConfig: YasguiConfiguration): Config {

    if (this.haveToHiddeEditorTabs(yasguiConfig)) {
      el.classList.add('hidden-editor-tabs');
    } else {
      el.classList.remove('hidden-editor-tabs');
    }

    // @ts-ignore
    if (yasguiConfig.query && window.Yasgui) {
      // @ts-ignore
      window.Yasgui.Yasqe.defaults.value = yasguiConfig.query;
    }
    return config;
  }

  private haveToHiddeEditorTabs(yasguiConfig: YasguiConfiguration) {
    if (yasguiConfig.showEditorTabs === undefined || yasguiConfig.showEditorTabs === null) {
      return false;
    }
    return !yasguiConfig.showEditorTabs;
  }
}

export const YasqeConfigurator = new YasqeConfiguratorDefinition();
