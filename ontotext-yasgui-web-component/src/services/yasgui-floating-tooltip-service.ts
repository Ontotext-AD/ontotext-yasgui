import { arrow, autoUpdate, computePosition, flip, offset, shift, Placement } from '@floating-ui/dom';

/**
* Provides functionality for displaying and positioning tooltips using Floating UI.
*
* The tooltip is rendered in the document body and automatically updates its
* position when the reference element moves, resizes, or the viewport changes.
*/
export class YasguiFloatingTooltipService {
  private cleanupAutoUpdate?: () => void;
  private tooltipElement?: HTMLDivElement;
  private arrowElement?: HTMLDivElement;

  /**
   * Displays a tooltip attached to the specified target element.
   *
   * Any previously displayed tooltip is removed before the new one is shown.
   *
   * @param target The element to which the tooltip should be attached.
   * @param text The text content of the tooltip.
   * @param placement The preferred placement of the tooltip relative to the target element.
   */
  show(target: HTMLElement, text: string, placement: Placement): void {
    this.hide();

    this.tooltipElement = this.createTooltipElement(text);
    this.arrowElement = this.createArrowElement();
    this.tooltipElement.appendChild(this.arrowElement);
    document.body.appendChild(this.tooltipElement);

    this.cleanupAutoUpdate = autoUpdate(target, this.tooltipElement, async () => {
      if (!this.tooltipElement || !this.arrowElement) {
        return;
      }

      const { x, y, placement: finalPlacement, middlewareData } = await computePosition(target, this.tooltipElement, {
        placement,
        strategy: 'fixed',
        middleware: [
          offset(8),
          flip(),
          shift({ padding: 8 }),
          arrow({ element: this.arrowElement }),
        ],
      });

      if (!this.tooltipElement || !this.arrowElement) {
        return;
      }

      Object.assign(this.tooltipElement.style, {
        left: `${x}px`,
        top: `${y}px`,
      });

      const { x: arrowX, y: arrowY } = middlewareData.arrow ?? {};
      const staticSide = {
        top: 'bottom',
        right: 'left',
        bottom: 'top',
        left: 'right',
      }[finalPlacement.split('-')[0]];

      Object.assign(this.arrowElement.style, {
        left: arrowX != null ? `${arrowX}px` : '',
        top: arrowY != null ? `${arrowY}px` : '',
        right: '',
        bottom: '',
        [staticSide]: '-4px',
      });
    });
  }

  /**
   * Hides the currently displayed tooltip and removes all associated listeners.
   */
  hide(): void {
    this.cleanupAutoUpdate?.();
    this.cleanupAutoUpdate = undefined;

    this.tooltipElement?.remove();
    this.tooltipElement = undefined;
    this.arrowElement = undefined;
  }

  /**
   * Creates a tooltip element with the provided text content.
   *
   * @param text The text content of the tooltip.
   * @returns The created tooltip element.
   */
  private createTooltipElement(text: string): HTMLDivElement {
    const tooltipElement = document.createElement('div');
    tooltipElement.className = 'yasgui-floating-tooltip';
    tooltipElement.setAttribute('role', 'tooltip');
    tooltipElement.textContent = text;
    return tooltipElement;
  }

  /**
   * Creates an arrow element used to visually connect the tooltip to its target.
   *
   * @returns The created tooltip arrow element.
   */
  private createArrowElement(): HTMLDivElement {
    const arrowElement = document.createElement('div');
    arrowElement.className = 'yasgui-floating-tooltip-arrow';
    return arrowElement;
  }
}
