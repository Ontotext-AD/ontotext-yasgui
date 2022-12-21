import {YasguiConfiguration} from '../../models/yasgui-configuration';
import {YasguiConfigurationBuilder} from './configuration/yasgui-configuration-builder';
import {OntotextYasgui} from '../../models/ontotext-yasgui';
import {HtmlElementsUtil} from '../utils/html-elements-util';

/**
 * A builder for yasgui instance.
 * It configures, creates an instance of yasgui and applies patches to created instance.
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
   *
   * @param hostElement - parent element of yasgui instance.
   * @param externalConfiguration - configuration passed from the component client. This config will
   * override the default values of yasgui component.
   */
  build(hostElement: HTMLElement, externalConfiguration: YasguiConfiguration): OntotextYasgui {
    const yasguiConfiguration = this.yasguiConfigurationBuilder.build(externalConfiguration);

    // @ts-ignore
    const yasgui = new Yasgui(HtmlElementsUtil.getOntotextYasgui(hostElement), yasguiConfiguration.defaultYasguiConfiguration);

    // monkey patches have to be applied before return yasgui.
    return new OntotextYasgui(yasgui, yasguiConfiguration);
  }
}

export const YasguiBuilder = new YasguiBuilderDefinition();
