/**
 * An interface for elements that can be plugged into yasr toolbar.
 * These elements will be sorted depends on {@link YasrToolbarPlugin#getOrder};
 */
export interface YasrToolbarPlugin {

  /**
   * This method is called when the yasr toolbar is created.
   *
   * @param yasr - the parent yasr of toolbar.
   */
  //@ts-ignore
  createElement(yasr: Yasr): HTMLElement;

  /**
   * This method is called when draw method of yasr is called.
   *
   * @param element - the element created in {@link YasrToolbarPlugin#createElement}.
   * @param yasr - the parent yasr of toolbar.
   */
  //@ts-ignore
  updateElement(element: HTMLElement, yasr: Yasr): void;

  /**
   * Returned value will be used for toolbar element ordering.
   *
   * @return - the order number.
   */
  getOrder(): number

  /**
   * This method is called when yasr is destroyed.
   *
   * @param element - the element created in {@link YasrToolbarPlugin#createElement}.
   * @param yasr - the parent yasr of toolbar.
   */
  //@ts-ignore
  destroy(element: HTMLElement, yasr: Yasr): void;
}
