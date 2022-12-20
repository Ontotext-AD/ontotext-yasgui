import {Component, Element, h, Host, Prop, Watch} from '@stencil/core';
import tippy, {Instance, Placement} from 'tippy.js';

@Component({
  tag: 'yasgui-tooltip',
  styleUrl: 'ontotext-tooltip-web-component.scss',
  shadow: false,
})
export class OntotextTooltipWebComponent {

  @Element() el: HTMLElement;

  @Prop() dataTooltip: string;

  @Prop() placement: string;

  @Prop() showOnClick: false;

  @Watch('dataTooltip')
  configurationChanged() {
    this.update();
  }

  private tooltip: Instance;

  private showFunction;
  private hideFunction;

  componentDidLoad() {
    this.init();
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

  private update() {
    this.tooltip.setContent(this.dataTooltip);
  }

  private init() {
    const options = {
      content: this.dataTooltip,
      trigger: 'manual',
      placement: this.placement as Placement,
      allowHTML: true,
    };
    this.tooltip = tippy(this.el, options);

    this.showFunction = this.createShowFunction(this.tooltip);
    this.hideFunction = this.createHideFunction(this.tooltip);

    this.el.addEventListener('mouseover', this.showFunction);

    if (this.showOnClick) {
      this.el.addEventListener('click', this.showFunction);
    }

    this.el.addEventListener('mouseleave', this.hideFunction);
  }

  private createShowFunction(tooltip: Instance) {
    return () => tooltip.show();
  }

  private createHideFunction(tooltip: Instance) {
    return () => tooltip.hide();
  }

  private destroy() {
    this.el.removeEventListener('mouseover', this.showFunction);
    this.el.removeEventListener('click', this.showFunction);
    this.el.removeEventListener('mouseleave', this.hideFunction);
  }
}
