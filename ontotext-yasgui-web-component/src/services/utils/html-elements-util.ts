export class HtmlElementsUtil {

  /**
   * Fetches the yasgui html element.
   * @param hostElement - the host element of "ontotext-yasgui-web-component".
   */
  static getOntotextYasgui(hostElement: HTMLElement): HTMLElement {
    return hostElement.querySelector('.ontotext-yasgui');
  }

  /**
   * Fetches the yasqe mode button.
   * @param hostElement - the host element of "ontotext-yasgui-web-component".
   */
  static getYasqeButton(hostElement: HTMLElement): HTMLElement {
    return hostElement.querySelector('.btn-mode-yasqe');
  }

  /**
   * Fetches the yasr mode button.
   * @param hostElement - the host element of "ontotext-yasgui-web-component".
   */
  static getYasrButton(hostElement: HTMLElement): HTMLElement {
    return hostElement.querySelector('.btn-mode-yasr');
  }

  /**
   * Fetches the yasr mode button.
   * @param hostElement - the host element of "ontotext-yasgui-web-component".
   */
  static getYasguiButton(hostElement: HTMLElement): HTMLElement {
    return hostElement.querySelector('.btn-mode-yasgui');
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
}
