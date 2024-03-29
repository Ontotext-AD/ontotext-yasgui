import {Component, Event, EventEmitter, h, Host, Listen, Prop, Element} from '@stencil/core';
import {TranslationService} from "../../services/translation.service";
import {HtmlUtil} from '../../services/utils/html-util';

export type ConfirmationDialogConfig = {
  title: string;
  message: string;
}

@Component({
  tag: 'confirmation-dialog',
  styleUrl: 'confirmation-dialog.scss',
  shadow: false,
})
export class ConfirmationDialog {

  private documentOverflow: string
  private cancelButton: HTMLButtonElement;

  @Element() hostElement: HTMLElement;

  @Prop() translationService: TranslationService;

  @Prop() config: ConfirmationDialogConfig = {
    title: 'Confirmation',
    message: 'Confirming?'
  }

  /**
   * Event fired when confirmation is rejected and the dialog should be closed.
   */
  @Event() internalConfirmationRejectedEvent: EventEmitter;

  /**
   * Event fired when confirmation is rejected and the dialog should be closed.
   */
  @Event() internalConfirmationApprovedEvent: EventEmitter;

  /**
   * Handles the Escape key keydown event and closes the dialog.
   * @param ev The keyboard event.
   */
  @Listen('keydown', {target: "window"})
  keydownListener(ev: KeyboardEvent) {
    if (ev.key === 'Escape') {
      this.internalConfirmationRejectedEvent.emit();
    }
  }

  private preventLeavingDialog(ev: KeyboardEvent) {
    HtmlUtil.preventLeavingDialog(this.hostElement, ev);
  }

  onClose(evt: MouseEvent): void {
    const target = evt.target as HTMLElement;
    evt.stopPropagation();
    const isOverlay = target.classList.contains('dialog-overlay');
    const isCloseButton = target.classList.contains('close-button');
    const isCancelButton = target.classList.contains('cancel-button');
    if (isOverlay || isCloseButton || isCancelButton) {
      this.internalConfirmationRejectedEvent.emit();
    }
  }

  onConfirm(evt: MouseEvent): void {
    evt.stopPropagation();
    this.internalConfirmationApprovedEvent.emit();
  }

  componentDidLoad(): void {
    this.hostElement.addEventListener('keydown', this.preventLeavingDialog.bind(this));
    this.documentOverflow = HtmlUtil.hideDocumentBodyOverflow();
    this.cancelButton.focus();
  }

  disconnectedCallback() {
    this.hostElement.removeEventListener('keydown', this.preventLeavingDialog.bind(this));
    HtmlUtil.setDocumentBodyOverflow(this.documentOverflow);
  }

  render() {
    return (
      <Host tabindex='-1'>
        <div class="dialog-overlay" onClick={(evt) => this.onClose(evt)}>
          <div class="dialog confirmation-dialog">
            <div class="dialog-header">
              <h3 class="dialog-title">{this.config.title}</h3>
              <button class="close-button icon-close"
                      onClick={(evt) => this.onClose(evt)}></button>
            </div>
            <div class="dialog-body" innerHTML={this.config.message}/>
            <div class="dialog-footer">
              <button class="cancel-button"
                      onClick={(evt) => this.onClose(evt)}
                      ref={(el) => (this.cancelButton = el)}>{this.translationService.translate('confirmation.btn.cancel.label')}</button>
              <button class="confirm-button"
                      onClick={(evt) => this.onConfirm(evt)}>{this.translationService.translate('confirmation.btn.confirm.label')}</button>
            </div>
          </div>
        </div>
      </Host>
    );
  }

}
