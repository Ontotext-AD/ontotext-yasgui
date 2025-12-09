import {Component, Element, h, Host, Prop, Watch} from '@stencil/core';
import {autoUpdate, computePosition, flip, offset, shift, arrow, type Placement as FloatingPlacement} from '@floating-ui/dom';

const TOOLTIP_CLASS_NAME = 'ontotext-yasgui-tooltip';

@Component({
  tag: 'yasgui-tooltip',
  styleUrl: 'ontotext-tooltip-web-component.scss',
  shadow: false,
})
export class OntotextTooltipWebComponent {
  @Element() el: HTMLElement;

  @Prop() yasguiDataTooltip: string;
  @Prop() placement: string;
  @Prop() showOnClick: false;

  @Watch('yasguiDataTooltip')
  configurationChanged() {
    // Only update content if tooltip exists
    if (this.boxEl) {
      this.boxEl.innerHTML = this.yasguiDataTooltip || '';
    }
  }

  private popperEl: HTMLElement | null = null;
  private boxEl: HTMLElement | null = null;
  private arrowEl: HTMLElement | null = null;
  private cleanupAutoUpdate: (() => void) | null = null;

  private onMouseOver: ((e: MouseEvent) => void) | null = null;
  private onMouseLeave: ((e: MouseEvent) => void) | null = null;
  private onDocClick: ((e: MouseEvent) => void) | null = null;

  private unsubscriptions: Array<() => void> = [];

  private show = () => {
    if (!this.yasguiDataTooltip) {
      return;
    }
    this.ensurePopperCreated();
    if (!this.popperEl) {
      return;
    }

    this.popperEl.style.visibility = 'visible';
    this.popperEl.style.pointerEvents = 'none';

    this.updatePosition();
    this.startAutoUpdate();

    if (this.showOnClick && !this.onDocClick) {
      const handler: (e: MouseEvent) => void = (e) => {
        const target = e.target as Node | null;
        const insideHost = !!(target && this.el.contains(target));
        const insidePopper = !!(target && this.popperEl && this.popperEl.contains(target));
        if (!insideHost && !insidePopper) {
          this.hide();
        }
      };
      this.onDocClick = handler;
      document.addEventListener('click', handler, true);

      this.unsubscriptions.push(() => {
        document.removeEventListener('click', handler, true);
        if (this.onDocClick === handler) this.onDocClick = null;
      });
    }
  };

  private hide = () => {
    if (!this.popperEl) {
      return;
    }

    this.stopAutoUpdate();

    if (this.popperEl.parentNode) {
      this.popperEl.parentNode.removeChild(this.popperEl);
    }

    this.popperEl = null;
    this.boxEl = null;
    this.arrowEl = null;
  };

  componentDidLoad() {
    this.onMouseOver = (e: MouseEvent) => {
      const from = e.relatedTarget as Node | null;
      if (!from || !this.el.contains(from)) {
        this.show();
      }
    };
    this.onMouseLeave = (e: MouseEvent) => {
      const to = e.relatedTarget as Node | null;
      if (!to || !this.el.contains(to)) {
        this.hide();
      }
    };

    this.el.addEventListener('mouseover', this.onMouseOver);
    this.unsubscriptions.push(() => {
      this.el.removeEventListener('mouseover', this.onMouseOver);
      this.onMouseOver = null;
    });

    this.el.addEventListener('mouseleave', this.onMouseLeave);
    this.unsubscriptions.push(() => {
      this.el.removeEventListener('mouseleave', this.onMouseLeave);
      this.onMouseLeave = null;
    });

    if (this.showOnClick) {
      this.el.addEventListener('click', this.show);
      this.unsubscriptions.push(() => this.el.removeEventListener('click', this.show));
    }
  }

  disconnectedCallback() {
    this.destroy();
  }

  render() {
    return (
      <Host class="yasgui-tooltip">
        <slot />
      </Host>
    );
  }

  private ensurePopperCreated() {
    if (this.popperEl) {
      return;
    }

    const popper = document.createElement('div');
    popper.className = TOOLTIP_CLASS_NAME;
    popper.style.position = 'fixed';
    popper.style.zIndex = '9999';
    popper.style.pointerEvents = 'none';
    popper.style.visibility = 'hidden';

    const box = document.createElement('div');
    box.className = 'tooltip-box';
    box.innerHTML = this.yasguiDataTooltip || '';

    const arrowEl = document.createElement('div');
    arrowEl.className = 'tooltip-arrow';

    popper.appendChild(box);
    popper.appendChild(arrowEl);
    document.body.appendChild(popper);

    this.popperEl = popper;
    this.boxEl = box;
    this.arrowEl = arrowEl;

    this.popperEl.addEventListener('mouseleave', this.hide);
    this.unsubscriptions.push(() => {
        this.popperEl.removeEventListener('mouseleave', this.hide);
    });
  }

  private updatePosition = () => {
    if (!this.popperEl || !this.arrowEl) {
      return;
    }

    const placement = (this.placement as FloatingPlacement) || 'top';

    computePosition(this.el, this.popperEl, {
      placement,
      strategy: 'fixed',
      middleware: [offset(8), flip(), shift({padding: 8}), arrow({element: this.arrowEl})],
    }).then(({x, y, placement: finalPlacement, middlewareData}) => {
      if (!this.popperEl || !this.arrowEl) {
        return;
      }

      this.popperEl.style.left = `${x}px`;
      this.popperEl.style.top = `${y}px`;
      this.popperEl.setAttribute('data-placement', finalPlacement);

      const ax = middlewareData.arrow?.x;
      const ay = middlewareData.arrow?.y;

      this.arrowEl.style.left = ax != null ? `${ax}px` : '';
      this.arrowEl.style.top = ay != null ? `${ay}px` : '';

      const base = finalPlacement.split('-')[0] as 'top' | 'right' | 'bottom' | 'left';
      const staticSide = {top: 'bottom', right: 'left', bottom: 'top', left: 'right'}[base];
      this.arrowEl.style.right = '';
      this.arrowEl.style.bottom = '';
      (this.arrowEl.style as Partial<CSSStyleDeclaration>)[staticSide] = '0';
    });
  };

  private startAutoUpdate() {
    if (this.cleanupAutoUpdate) {
      return;
    }
    if (this.popperEl === null) {
      return;
    }

    // Update only on ancestor scroll/resize
    this.cleanupAutoUpdate = autoUpdate(
        this.el,
        this.popperEl,
        this.updatePosition,
        {
          animationFrame: false,
          ancestorScroll: true,
          ancestorResize: true,
          elementResize: false
        }
    );

    this.unsubscriptions.push(() => {
      if (this.cleanupAutoUpdate) {
        this.cleanupAutoUpdate();
        this.cleanupAutoUpdate = null;
      }
    });
  }

  private stopAutoUpdate() {
    if (this.cleanupAutoUpdate) {
      this.cleanupAutoUpdate();
      this.cleanupAutoUpdate = null;
    }
  }

  private destroy() {
    this.unsubscriptions.forEach(unsub => {
      try {
        unsub();
      } catch (e) {
        // eslint-disable-next-line no-empty
        /* no-op to ensure teardown continues */
      }
    });
    this.unsubscriptions = [];
    this.onDocClick = null;

    this.hide();
  }
}
