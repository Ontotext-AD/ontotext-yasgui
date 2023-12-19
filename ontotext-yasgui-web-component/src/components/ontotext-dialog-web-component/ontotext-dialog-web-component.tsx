import {Component, h, Host, Prop, Listen, Element} from '@stencil/core';
import {HtmlUtil} from '../../services/utils/html-util';

export type DialogConfig = {
  dialogTitle: string;
  onClose: (evt: MouseEvent | KeyboardEvent) => void;
  firstFocusedElement?: () => HTMLElement,
  lastFocusedElement?: () => HTMLElement,
}

@Component({
  tag: 'ontotext-dialog-web-component',
  styleUrl: 'ontotext-dialog-web-component.scss',
  shadow: false,
})
export class OntotextDialogWebComponent {

  private documentOverflow: string
  private closeButton: HTMLButtonElement;

  @Element() hostElement: HTMLElement;

  @Prop() config: DialogConfig;

  /**
   * Handles the Escape and Tab keys:
   * <ol>
   *   <li> Escape - Calls the close action</li>
   *   <li> Tab - Controls the focused elements to be only the dialog elements.</li>
   *
   * @param ev The keyboard event.
   */
  @Listen('keydown', {target: "document"})
  keydownListener(ev: KeyboardEvent) {
    if (ev.key === 'Escape') {
      this.closeButton.click();
    }

    // Handle Tab key press to manage focus within the dialog
    if (ev.key === 'Tab') {
      const activeElement = document.activeElement;
      const lastFocusedElement = this.getLastFocusedElement();

      // If we reach the last focused element then next is close button.
      if (!lastFocusedElement || lastFocusedElement === activeElement) {
        this.closeButton.focus();
        ev.preventDefault();
      }

      // Check if the active element is outside the dialog, then set close button active.
      if (!this.hostElement.contains(activeElement)) {
        this.closeButton.focus();
        ev.preventDefault();
      }

    }
  }

  componentDidLoad(): void {
    this.documentOverflow = HtmlUtil.hideDocumentBodyOverflow();
    const firstFocusedElement = this.config.firstFocusedElement && this.config.firstFocusedElement();
    if (firstFocusedElement) {
      firstFocusedElement.focus();
    } else {
      this.closeButton.focus();
    }
  }

  disconnectedCallback() {
    HtmlUtil.setDocumentBodyOverflow(this.documentOverflow);
  }

  private getLastFocusedElement(): HTMLElement | undefined {
    return this.config.lastFocusedElement && this.config.lastFocusedElement();
  }

  render() {
    return (
      <Host tabindex='-1'>
        <div class="dialog-overlay" onClick={(evt) => this.config.onClose(evt)}>
          <div class="dialog">
            <div class="dialog-header">
              <h3 class="dialog-title">{this.config.dialogTitle}</h3>
              <button class="close-button icon-close"
                      onClick={(evt) => this.config.onClose(evt)}
                      ref={(el) => (this.closeButton = el)}></button>
            </div>
            <div class="dialog-body">
              <slot name="body" />
            </div>
            <div class="dialog-footer">
              <slot name="footer" />
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
