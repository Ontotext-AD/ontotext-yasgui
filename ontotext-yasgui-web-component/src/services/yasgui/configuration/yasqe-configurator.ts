import {Configurator} from './configurator';
import {YasguiConfiguration} from '../../../models/yasgui-configuration';
import {Config} from '../../../../../Yasgui/packages/yasgui'
import {HtmlElementsUtil} from '../../utils/html-elements-util';

class YasqeConfiguratorDefinition implements Configurator {

  config(hostElement: HTMLElement, config: Config, yasguiConfig: YasguiConfiguration): Config {

    const ontotextYasgui = HtmlElementsUtil.getOntotextYasgui(hostElement);
    if (this.haveToHiddeEditorTabs(yasguiConfig)) {
      ontotextYasgui.classList.add('hidden-editor-tabs');
    } else {
      ontotextYasgui.classList.remove('hidden-editor-tabs');
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
