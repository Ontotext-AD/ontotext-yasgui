import {Orientation, RenderingMode} from '../../models/yasgui-configuration';
import {HtmlElementsUtil} from './html-elements-util';

export class VisualisationUtils {

  /**
   * Calculates the maximum height which the yasqe could have given the resolution and accounting the
   * space taken by some interface components around it. The calculated height is then set as a css
   * style property only if the rendering mode is yasqe or orientation is horizontal. In both cases
   * yasqe needs to span the entire possible height. If the mode and orientation is different by
   * these described above, then the height css is removed to allow the yasqe size itself based on
   * the minimum configured height allowing the yasr to go below.
   *
   * Both operations described above are executed in a timeout in order to ensure that the yasqe is
   * actually rendered before trying out to find it.
   * @param mode
   * @param orientation
   * @param editorHeight if the mode is YASGUI, this height will be set for the yasqe. Default is 300px.
   */
  static setYasqeFullHeight(mode: RenderingMode, orientation: Orientation, editorHeight = 300): void {
    const selectActiveEditor = () => document.querySelector('.yasgui .tabPanel.active .CodeMirror');
    if (mode === RenderingMode.YASQE || orientation === Orientation.HORIZONTAL) {
      setTimeout(() => {
        const codemirrorEl = selectActiveEditor() as HTMLElement;
        if (codemirrorEl) {
          const visibleWindowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0;
          let newHeight = visibleWindowHeight - (selectActiveEditor().getBoundingClientRect().top);
          // TODO: this 40px which are contracted by the height are taken from the workbench and
          // probably are related with the workbench footer height.
          newHeight -= 40;
          codemirrorEl.style.setProperty('height', newHeight + 'px');
        }
      });
    } else {
      setTimeout(() => {
        const codemirrorEl = selectActiveEditor() as HTMLElement;
        if (codemirrorEl) {
          codemirrorEl.style.setProperty('height', editorHeight + 'px');
        }
      });
    }
  }

  /**
   * Changes the rendering mode of the yasgui component.
   * @param hostElement
   * @param newMode
   * @param isVerticalOrientation
   * @param editorHeight
   */
  static changeRenderMode(hostElement: HTMLElement, newMode: RenderingMode, isVerticalOrientation: boolean, editorHeight?: number): void {
    VisualisationUtils.unselectAllToolbarButtons(hostElement);
    const button = HtmlElementsUtil.getRenderModeButton(hostElement, newMode);

    /** The button can be undefined if the render buttons are hidden and the {@see OntotextYasguiWebComponent#changeRenderMode} method is called.*/
    if (button) {
      button.classList.add('btn-selected');
    }

    const modes: string[] = Object.values(RenderingMode);
    hostElement.classList.remove(...modes);
    hostElement.classList.add(newMode);
    this.setYasqeFullHeight(newMode, this.resolveOrientation(isVerticalOrientation), editorHeight);
  }

  static toggleLayoutOrientationButton(hostElement: HTMLElement, newOrientation: Orientation): void {
    const buttonOrientation = HtmlElementsUtil.getOrientationButton(hostElement);
    if (Orientation.HORIZONTAL === newOrientation) {
      buttonOrientation.classList.add('icon-rotate-quarter');
    } else {
      buttonOrientation.classList.remove('icon-rotate-quarter');
    }
  }

  static toggleLayoutOrientation(hostElement: HTMLElement, isVerticalOrientation: boolean, mode: RenderingMode, editorHeight?: number): void {
    const newOrientation = this.resolveOrientation(isVerticalOrientation);
    const orientations: string[] = Object.values(Orientation);
    hostElement.classList.remove(...orientations);
    hostElement.classList.add(newOrientation);
    this.setYasqeFullHeight(mode, newOrientation, editorHeight);
    VisualisationUtils.toggleLayoutOrientationButton(hostElement, newOrientation);
  }

  static resolveOrientation(isVerticalOrientation: boolean): Orientation {
    return isVerticalOrientation ? Orientation.VERTICAL : Orientation.HORIZONTAL;
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
