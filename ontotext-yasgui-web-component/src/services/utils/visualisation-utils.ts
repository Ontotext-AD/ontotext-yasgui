import {Orientation, RenderingMode} from '../../models/yasgui-configuration';
import {HtmlElementsUtil} from './html-elements-util';

export class VisualisationUtils {

  static changeRenderMode(hostElement: HTMLElement, newMode: RenderingMode): void {
    VisualisationUtils.unselectAllToolbarButtons(hostElement);
    const button = HtmlElementsUtil.getRenderModeButton(hostElement, newMode);

    /** The button can be undefined if the render buttons are hidden and the {@see OntotextYasguiWebComponent#changeRenderMode} method is called.*/
    if (button) {
      button.classList.add('btn-selected');
    }

    const modes: string[] = Object.values(RenderingMode);
    hostElement.classList.remove(...modes);
    hostElement.classList.add(newMode);
  }

  static toggleLayoutOrientationButton(hostElement: HTMLElement, newOrientation: Orientation): void {
    const buttonOrientation = HtmlElementsUtil.getOrientationButton(hostElement);
    if (Orientation.HORIZONTAL === newOrientation) {
      buttonOrientation.classList.add('icon-rotate-quarter');
    } else {
      buttonOrientation.classList.remove('icon-rotate-quarter');
    }
  }

  static toggleLayoutOrientation(hostElement: HTMLElement, isVerticalOrientation: boolean): void {
    const newOrientation = isVerticalOrientation ? Orientation.VERTICAL : Orientation.HORIZONTAL;
    const orientations: string[] = Object.values(Orientation);
    hostElement.classList.remove(...orientations);
    hostElement.classList.add(newOrientation);

    VisualisationUtils.toggleLayoutOrientationButton(hostElement, newOrientation);
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
