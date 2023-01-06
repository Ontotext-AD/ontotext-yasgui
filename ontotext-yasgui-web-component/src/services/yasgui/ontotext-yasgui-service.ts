import {YasguiConfiguration} from '../../models/yasgui-configuration';
import {VisualisationUtils} from '../utils/visualisation-utils';
import {HtmlElementsUtil} from '../utils/html-elements-util';
import {TranslationService} from '../translation.service';

class OntotextYasguiServiceDefinition {

  private static translationService: TranslationService;

  constructor() {
    OntotextYasguiServiceDefinition.translationService = TranslationService.Instance;
  }

  postConstruct(hostElement: HTMLElement, config: YasguiConfiguration): void {

    OntotextYasguiServiceDefinition.initEditorTabs(hostElement, config);
    OntotextYasguiServiceDefinition.initControlBar(hostElement, config);
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
    if (config.showEditorTabs) {
      hostElement.classList.remove('hidden-editor-tabs');
    } else {
      hostElement.classList.add('hidden-editor-tabs');
    }
  }

  private static initControlBar(hostElement: HTMLElement, config: YasguiConfiguration): void {
    const controlBar = HtmlElementsUtil.getControlBar(hostElement);
    if (config.showControlBar) {
      controlBar.classList.remove('hidden');
    } else {
      controlBar.classList.add('hidden');
    }
  }

  private static initResultTabs(hostElement: HTMLElement, config: YasguiConfiguration): void {
    if (config.showResultTabs) {
      hostElement.classList.remove('hidden-result-tabs');
    } else {
      hostElement.classList.add('hidden-result-tabs');
    }
  }

  private static initButtonsStyling(hostElement: HTMLElement, config: YasguiConfiguration): void {
    // Initialize render buttons styling.
    VisualisationUtils.changeRenderMode(hostElement, config.render);

    // Initialize orientation button styling.
    const orientation = config.orientation;
    VisualisationUtils.toggleLayoutOrientationButton(hostElement, orientation);
    if (config.showToolbar) {
      HtmlElementsUtil.getToolbar(hostElement).classList.remove('hidden');
    } else {
      HtmlElementsUtil.getToolbar(hostElement).classList.add('hidden');
    }
  }
}

export const OntotextYasguiService = new OntotextYasguiServiceDefinition();
