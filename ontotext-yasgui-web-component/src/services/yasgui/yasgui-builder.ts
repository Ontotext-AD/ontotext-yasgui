import {YasguiConfiguration} from '../../models/yasgui-configuration';
import {OntotextYasgui} from '../../models/ontotext-yasgui';
import {HtmlElementsUtil} from '../utils/html-elements-util';

/**
 * A builder for Yasgui and its wrapper OntotextYasgui instance. It creates an instance of yasgui
 * and applies patches to created instance. Then the instance is wrapped in a OntotextYasgui adapter
 * instance.
 */
export class YasguiBuilder {
  /**
   * Builds an instance of Yasgui and wraps it in an OntotextYasgui adapter instance.
   *
   * @param hostElement - parent element of yasgui instance.
   * @param yasguiConfiguration - the yasgui configuration merged with the external one.
   */
  build(hostElement: HTMLElement, yasguiConfiguration: YasguiConfiguration): OntotextYasgui {
    const yasgui = this.createYasguiInstance(hostElement, yasguiConfiguration);
    // monkey patches have to be applied before return yasgui.
    return new OntotextYasgui(yasgui, yasguiConfiguration);
  }

  rebuild(hostElement: HTMLElement, yasguiConfiguration: YasguiConfiguration, ontotextYasgui: OntotextYasgui): void {
    const yasgui = this.createYasguiInstance(hostElement, yasguiConfiguration);
    ontotextYasgui.setInstance(yasgui);
    ontotextYasgui.setConfig(yasguiConfiguration);
  }

  private createYasguiInstance(hostElement: HTMLElement, yasguiConfiguration: YasguiConfiguration): any {
    // @ts-ignore
    return new Yasgui(HtmlElementsUtil.getOntotextYasgui(hostElement), yasguiConfiguration.yasguiConfig);
  }
}
