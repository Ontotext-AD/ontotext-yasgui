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

  /**
   * Fetches the query result info element.
   * @param hostElement - the host element of "ontotext-yasgui-web-component".
   */
  static getQueryResultInfo(hostElement: HTMLElement): HTMLElement {
    return hostElement.querySelector('.tabPanel.active .yasr_response_chip');
  }
}
