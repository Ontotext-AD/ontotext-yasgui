import {Orientation, RenderingMode} from '../../models/yasgui-configuration';
import {HtmlElementsUtil} from './html-elements-util';

export class VisualisationUtils {

  static changeRenderMode(hostElement: HTMLElement, newMode: RenderingMode): void {
    VisualisationUtils.unselectAllToolbarButtons(hostElement);
    let button;
    if (RenderingMode.YASQE === newMode) {
      button = HtmlElementsUtil.getYasqeButton(hostElement);
    } else if (RenderingMode.YASR === newMode) {
      button = HtmlElementsUtil.getYasrButton(hostElement);
    } else {
      button = HtmlElementsUtil.getYasguiButton(hostElement);
    }
    button.classList.add('btn-selected');

    const modes: string[] = Object.values(RenderingMode);
    const yasgui = HtmlElementsUtil.getOntotextYasgui(hostElement);
    yasgui.classList.remove(...modes);
    yasgui.classList.add(newMode);
  }

  static  changeOrientation(hostElement: HTMLElement, newOrientation: Orientation): void {
    const buttonOrientation = HtmlElementsUtil.getOrientationButton(hostElement);
    if (Orientation.HORIZONTAL === newOrientation) {
      buttonOrientation.classList.add('icon-rotate-90');
    } else {
      buttonOrientation.classList.remove('icon-rotate-90');
    }

    const orientations: string[] = Object.values(Orientation);
    const ontotextYasgui = HtmlElementsUtil.getOntotextYasgui(hostElement);
    ontotextYasgui.classList.remove(...orientations);
    ontotextYasgui.classList.add(newOrientation);
  }

  static toggleOrientation(hostElement: HTMLElement): void {
    const yasgui: HTMLElement = HtmlElementsUtil.getOntotextYasgui(hostElement);
    let orientation = Orientation.VERTICAL;
    if (yasgui.classList.contains(Orientation.VERTICAL)) {
      orientation = Orientation.HORIZONTAL;
    }
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
  private static unselectAllToolbarButtons(hostElement: HTMLElement): void {
    hostElement.querySelectorAll('.yasgui-btn').forEach(button => {
      button.classList.remove('btn-selected');
    });
  }
}
