import {YasguiConfiguration} from '../../models/yasgui-configuration';
import {OntotextYasgui} from '../../models/ontotext-yasgui';
import {HtmlElementsUtil} from '../utils/html-elements-util';

/**
 * A builder for Yasgui and its wrapper OntotextYasgui instance. It creates an instance of yasgui
 * and applies patches to created instance. Then the instance is wrapped in a OntotextYasgui adapter
 * instance.
 */
class YasguiBuilderDefinition {
  /**
   * Builds an instance of Yasgui and wraps it in an OntotextYasgui adapter instance.
   *
   * @param hostElement - parent element of yasgui instance.
   * @param yasguiConfiguration - the yasgui configuration merged with the external one.
   */
  build(hostElement: HTMLElement, yasguiConfiguration: YasguiConfiguration): OntotextYasgui {
    // @ts-ignore
    const yasgui = new Yasgui(HtmlElementsUtil.getOntotextYasgui(hostElement), yasguiConfiguration.yasguiConfig);

    // @ts-ignore
    if (yasguiConfiguration.yasqeConfig.query && window.Yasgui) {
      // @ts-ignore
      window.Yasgui.Yasqe.defaults.value = yasguiConfiguration.yasqeConfig.query;
    }

    // monkey patches have to be applied before return yasgui.
    return new OntotextYasgui(yasgui, yasguiConfiguration);
  }
}

export const YasguiBuilder = new YasguiBuilderDefinition();
