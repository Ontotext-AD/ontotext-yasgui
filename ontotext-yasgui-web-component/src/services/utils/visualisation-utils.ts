import {Orientation, RenderingMode} from '../../models/yasgui-configuration';
import {HtmlElementsUtil} from './html-elements-util';

export class VisualisationUtils {

  static setRenderMode(hostElement: HTMLElement, newMode: RenderingMode): void {
    const modes: string[] = Object.values(RenderingMode);
    const yasgui = HtmlElementsUtil.getOntotextYasgui(hostElement);
    yasgui.classList.remove(...modes);
    yasgui.classList.add(newMode);
  }

  static changeRenderMode(hostElement: HTMLElement, neMode: RenderingMode): void {
    VisualisationUtils.unselectAllHeaderButtons(hostElement);
    let button;
    switch (neMode) {
      case RenderingMode.YASQE:
        button = HtmlElementsUtil.getYasqeButton(hostElement);
        VisualisationUtils.setRenderMode(hostElement, RenderingMode.YASQE);
        break;
      case RenderingMode.YASR:
        button = HtmlElementsUtil.getYasrButton(hostElement);
        VisualisationUtils.setRenderMode(hostElement, RenderingMode.YASR);
        break;
      default:
        button = HtmlElementsUtil.getYasguiButton(hostElement);
        VisualisationUtils.setRenderMode(hostElement, RenderingMode.YASGUI);

    }
    button.classList.add('btn-selected');
  }

  static setOrientation(hostElement: HTMLElement, newOrientation: Orientation): void {
    const orientations: string[] = Object.values(Orientation);
    const ontotextYasgui = HtmlElementsUtil.getOntotextYasgui(hostElement);
    ontotextYasgui.classList.remove(...orientations);
    ontotextYasgui.classList.add(newOrientation);
  }

  static  changeOrientation(hostElement: HTMLElement, newOrientation: Orientation): void {
    const buttonOrientation = hostElement.querySelector('.btn-orientation');
    if (Orientation.HORIZONTAL === newOrientation) {
      buttonOrientation.classList.add('icon-rotate-90');
    } else {
      buttonOrientation.classList.remove('icon-rotate-90');
    }
  }

  static toggleOrientation(hostElement: HTMLElement): void {
    const yasgui: HTMLElement = HtmlElementsUtil.getOntotextYasgui(hostElement);
    let orientation = Orientation.VERTICAL;
    if (yasgui.classList.contains(Orientation.VERTICAL)) {
      orientation = Orientation.HORIZONTAL;
    }
    VisualisationUtils.setOrientation(hostElement, orientation);
    VisualisationUtils.changeOrientation(hostElement, orientation);
  }

  static isOrientationVertical(hostElement: HTMLElement) {
    return HtmlElementsUtil.getOntotextYasgui(hostElement).classList.contains(Orientation.VERTICAL);
  }

  /**
   * Removes selection class from all buttons.
   * @param hostElement - the host element of "ontotext-yasgui-web-component".
   * @private
   */
  private static unselectAllHeaderButtons(hostElement: HTMLElement): void {
    hostElement.querySelectorAll('button').forEach(button => {
      button.classList.remove('btn-selected');
    });
  }
}
