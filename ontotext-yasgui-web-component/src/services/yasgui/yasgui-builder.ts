import {YasguiConfiguration} from '../../models/yasgui-configuration';
import {OntotextYasgui} from '../../models/ontotext-yasgui';
import {HtmlElementsUtil} from '../utils/html-elements-util';

/**
 * A builder for Yasgui and its wrapper OntotextYasgui instance. It creates an instance of yasgui
 * and applies patches to created instance. Then the instance is wrapped in a OntotextYasgui adapter
 * instance.
 */
export class YasguiBuilder {
  private instance: OntotextYasgui;

  /**
   * Builds an instance of Yasgui and wraps it in an OntotextYasgui adapter instance.
   *
   * @param hostElement - parent element of yasgui instance.
   * @param yasguiConfiguration - the yasgui configuration merged with the external one.
   */
  build(hostElement: HTMLElement, yasguiConfiguration: YasguiConfiguration): OntotextYasgui {
    const yasgui = this.createYasguiInstance(hostElement, yasguiConfiguration);
    // patches have to be applied before returning yasgui instance.
    this.instance = new OntotextYasgui(yasgui, yasguiConfiguration);
    return this.instance;
  }

  /**
   * Returns the OntotextYasgui instance if created or undefined otherwise.
   */
  getInstance(): OntotextYasgui | undefined {
    return this.instance;
  }

  private createYasguiInstance(hostElement: HTMLElement, yasguiConfiguration: YasguiConfiguration): any {
    // @ts-ignore
    return new Yasgui(HtmlElementsUtil.getOntotextYasgui(hostElement), yasguiConfiguration.yasguiConfig);
  }
}
