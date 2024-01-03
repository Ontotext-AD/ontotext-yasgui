import {Component, h, Host, Prop, Listen, Element} from '@stencil/core';
import {HtmlUtil} from '../../services/utils/html-util';
import {DialogUtil} from '../../services/utils/dialog-util';

export type DialogConfig = {
  dialogTitle: string;
  onClose: (evt: MouseEvent | KeyboardEvent) => void;
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
   * Handles the Escape key keydown event and closes the dialog.
   * @param ev The keyboard event.
   */
  @Listen('keydown', {target: "document"})
  keydownListener(ev: KeyboardEvent) {
    if (ev.key === 'Escape') {
      this.closeButton.click();
    }
  }

  componentDidLoad(): void {
    this.documentOverflow = HtmlUtil.hideDocumentBodyOverflow();
    this.hostElement.addEventListener('keydown', this.preventLeavingDialog.bind(this));
    this.closeButton.focus();
  }

  disconnectedCallback() {
    this.hostElement.removeEventListener('keydown', this.preventLeavingDialog.bind(this));
    HtmlUtil.setDocumentBodyOverflow(this.documentOverflow);
  }

  private preventLeavingDialog(ev: KeyboardEvent) {
    DialogUtil.preventLeavingDialog(this.hostElement, ev);
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
