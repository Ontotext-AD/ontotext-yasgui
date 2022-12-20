import {YasguiConfiguration} from '../../models/yasgui-configuration';
import {YasguiConfigurationBuilder} from './configuration/yasgui-configuration-builder';
import {OntotextYasgui} from '../../models/ontotext-yasgui';
import {HtmlElementsUtil} from '../utils/html-elements-util';

/**
 * Builder yasgui instance.
 * It configures, creates an instance of yasgui and apply patches to created instance.
 */
class YasguiBuilderDefinition {

  private yasguiConfigurationBuilder: typeof YasguiConfigurationBuilder;

  constructor() {
    this.yasguiConfigurationBuilder = YasguiConfigurationBuilder;
  }

  /**
   * Builds an instance of yasgui. The building of instances is a two-step process.
   * A yasgui configuration is created on first step.
   * The created instance is patched on second step.
   * @param hostElement - parent element of yasgui instance.
   * @param config - configuration passed from client of component. It overrides default values of yasgui component.
   */
  build(hostElement: HTMLElement, config: YasguiConfiguration): OntotextYasgui {
    const filledConfiguration = this.yasguiConfigurationBuilder.build(config);
    // @ts-ignore
    const yasgui = new Yasgui(HtmlElementsUtil.getOntotextYasgui(hostElement), filledConfiguration.yasguiConfig);

    // monkey patches have to be applied before return yasgui.
    return new OntotextYasgui(yasgui, filledConfiguration);
  }
}

export const YasguiBuilder = new YasguiBuilderDefinition();
