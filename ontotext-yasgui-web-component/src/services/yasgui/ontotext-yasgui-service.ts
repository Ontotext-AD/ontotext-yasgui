import {YasguiConfiguration} from '../../models/yasgui-configuration';
import {VisualisationUtils} from '../utils/visualisation-utils';
import {HtmlElementsUtil} from '../utils/html-elements-util';
import {TranslationService} from '../translation.service';

class OntotextYasguiServiceDefinition {

  private static translationService: typeof TranslationService;

  constructor() {
    OntotextYasguiServiceDefinition.translationService = TranslationService;
  }

  postConstruct(hostElement: HTMLElement, config: YasguiConfiguration): void {

    OntotextYasguiServiceDefinition.initEditorTabs(hostElement, config);
    OntotextYasguiServiceDefinition.initResultTabs(hostElement, config);
    OntotextYasguiServiceDefinition.initButtonsStyling(hostElement, config);
    OntotextYasguiServiceDefinition.updateTranslation(config);
  }

  private static updateTranslation(config: YasguiConfiguration): void {
    if (config.i18n) {
      OntotextYasguiServiceDefinition.translationService.addTranslations(config.i18n);
    }
  }

  private static initEditorTabs(hostElement: HTMLElement, config: YasguiConfiguration): void {
    const ontotextYasgui = HtmlElementsUtil.getOntotextYasgui(hostElement);
    if (config.showEditorTabs) {
      ontotextYasgui.classList.remove('hidden-editor-tabs');
    } else {
      ontotextYasgui.classList.add('hidden-editor-tabs');
    }
  }

  private static initResultTabs(hostElement: HTMLElement, config: YasguiConfiguration): void {
    const ontotextYasgui = HtmlElementsUtil.getOntotextYasgui(hostElement);
    if (config.showResultTabs) {
      ontotextYasgui.classList.remove('hidden-result-tabs');
    } else {
      ontotextYasgui.classList.add('hidden-result-tabs');
    }
  }

  private static initButtonsStyling(hostElement: HTMLElement, config: YasguiConfiguration): void {
    // Initialize render buttons styling.
    VisualisationUtils.changeRenderMode(hostElement, config.render);

    // Initialize orientation button styling.
    const orientation = config.orientation;
    VisualisationUtils.changeOrientation(hostElement, orientation);
    if (config.showToolbar) {
      HtmlElementsUtil.getToolbar(hostElement).classList.remove('hidden');
    } else {
      HtmlElementsUtil.getToolbar(hostElement).classList.add('hidden');
    }
  }
}

export const OntotextYasguiService = new OntotextYasguiServiceDefinition();
