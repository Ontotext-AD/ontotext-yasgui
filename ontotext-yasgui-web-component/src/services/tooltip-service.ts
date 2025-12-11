export class TooltipService {

  /**
   * Wrap <code>element</code> with {@see OntotextTooltipWebComponent} and sets tooltip attributes <code>tooltip</code>, <code>placement</code> and <code>showOnclick</code>.
   * If element has a parent it will be detached of it and created tooltip wrapper element will be attached to the element parent.
   * @param element - the element that will be wrapped with {@see OntotextTooltipWebComponent}.
   * @param tooltip - the tooltip.
   * @param placement - placement of tooltip.
   * @param showOnclick - if tooltip have to be shown on click event.
   */
  static addTooltip(element: HTMLElement, tooltip?: string, placement?: string, showOnclick = true): HTMLElement {
    const tooltipElement = document.createElement('yasgui-tooltip');
    const parentElement = element.parentElement;
    if (parentElement) {
      parentElement.replaceChild(tooltipElement, element);
    }
    tooltipElement.appendChild(element);
    TooltipService.updateTooltipData(tooltipElement, tooltip);
    TooltipService.updatePlacement(tooltipElement, placement);
    tooltipElement.setAttribute("show-on-click", `${showOnclick}`);

    return tooltipElement;
  }

  static updateTooltip(element: HTMLElement, tooltip?: string, placement?: string): void {
    const parentElement = element?.parentElement;
    if (parentElement && 'yasgui-tooltip' === parentElement.tagName.toLowerCase()) {
      TooltipService.updateTooltipData(parentElement, tooltip);
      TooltipService.updatePlacement(parentElement, placement);
    }
  }

  private static updateTooltipData(element: HTMLElement, tooltip?: string): void {
    if (tooltip) {
      element.setAttribute('yasgui-data-tooltip', tooltip);
      element.setAttribute("aria-label", tooltip);
    }
  }

  private static updatePlacement(element: HTMLElement, placement?: string): void {
    if (placement) {
      element.setAttribute('placement', placement);
    }
  }
}
