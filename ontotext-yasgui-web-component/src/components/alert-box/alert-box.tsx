import {Component, h, Host, Prop, State} from '@stencil/core';

export type AlertBoxType = 'info' | 'warning' | 'help' | 'danger' | 'success';

/**
 * Implementation of dismissible alert box component which can be configured.
 */
@Component({
  tag: 'alert-box',
  styleUrl: 'alert-box.scss',
  shadow: false,
})
export class AlertBox {
  /**
   * Defines the alert type which is represented by different color, background and icon.
   * Default is <code>"info"</code>.
   */
  @Prop() type: AlertBoxType = 'info';

  /**
   * The message which should be displayed in the alert. If the message is not provided, then the
   * alert is not displayed.
   */
  @Prop() message: string;

  /**
   * Configures if the icon in the alert should be displayed or not.
   * Default is <code>true</code>
   */
  @Prop() noIcon = true;

/**
   * Configures if the close button in the alert should be displayed or not.
   * Default is <code>false</code>
   */
  @Prop() noButton = false;

  /**
   * Controls the visibility of the alert.
   * Default is <code>true</code>
   */
  @State() isVisible = true;

  onClose(evt: MouseEvent): void {
    evt.stopPropagation();
    this.isVisible = !this.isVisible;
  }

  render() {
    const classList = `alert-box alert alert-${this.type} ${this.noIcon && 'no-icon'}`;
    return (
      <Host>
        {this.isVisible && <div class={classList}>
          {!this.noButton && <a class="close-button" onClick={(evt) => this.onClose(evt)}>&times;</a>}
          <div class="message">{this.message}</div>
        </div>}
      </Host>);
  }
}
