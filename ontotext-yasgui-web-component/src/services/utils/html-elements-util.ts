import {RenderingMode} from "../../models/yasgui-configuration";

export class HtmlElementsUtil {

  /**
   * Fetches the yasgui html element.
   * @param hostElement - the host element of "ontotext-yasgui-web-component".
   */
  static getOntotextYasgui(hostElement: HTMLElement): HTMLElement {
    return hostElement.querySelector('.ontotext-yasgui');
  }

  static getRenderModeButton(hostElement: HTMLElement, mode: RenderingMode): HTMLElement {
    return hostElement.querySelector(`.btn-${mode}`);
  }

  /**
   * Fetches the orientation button.
   * @param hostElement - the host element of "ontotext-yasgui-web-component".
   */
  static getOrientationButton(hostElement: HTMLElement): HTMLElement {
    return hostElement.querySelector('.btn-orientation');
  }

  /**
   * Fetches the toolbar element.
   * @param hostElement - the host element of "ontotext-yasgui-web-component".
   */
  static getToolbar(hostElement: HTMLElement): HTMLElement {
    return hostElement.querySelector('.yasgui-toolbar');
  }

  /**
   * Fetches the toolbar element.
   * @param hostElement - the host element of "ontotext-yasgui-web-component".
   */
  static getControlBar(hostElement: HTMLElement): HTMLElement {
    return hostElement.querySelector('.yasgui .controlbar');
  }

  static toggleHiddenByCondition(hostElement: HTMLElement, elementSelectors: string[], haveToExist: () => boolean) {
    HtmlElementsUtil.toggleClassByCondition(hostElement, elementSelectors, 'hidden', haveToExist);
  }

  static toggleClassByCondition(hostElement: HTMLElement, elementSelectors: string[], className: string, haveToExist: () => boolean): void {
    elementSelectors.forEach((elementSelector) => {
      const element = hostElement.querySelector(elementSelector);
      if (element) {
        element.classList.toggle(className, haveToExist());
      }
    });
  }

  static createAutocompleteHintElement(text: string): HTMLElement {
    let hint =  document.createElement('span');
    hint.innerHTML = text;
    hint.style.fontSize = '12px';
    hint.style.color = "gray";
    hint.style.backgroundColor = 'white';
    hint.style.position = 'absolute';
    hint.style.zIndex = '3';
    hint.style.paddingLeft = 12 + 'px';
    return hint;
  }
}
