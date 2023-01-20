import {Component, Element, Event, EventEmitter, h, Prop} from '@stencil/core';
import {DialogConfig} from "../ontotext-dialog-web-component/ontotext-dialog-web-component";
import {ServiceFactory} from "../../services/service-factory";
import {TranslationService} from "../../services/translation.service";

export type ShareSavedQueryDialogConfig = {
  dialogTitle: string;
  shareQueryLink: string;
}

@Component({
  tag: 'share-saved-query-dialog',
  styleUrl: 'share-saved-query-dialog.scss',
  shadow: false,
})
export class ShareSavedQueryDialog {

  private translationService: TranslationService;

  @Element() hostElement: HTMLElement;

  @Prop() config: ShareSavedQueryDialogConfig;

  @Prop() serviceFactory: ServiceFactory

  /**
   * Event fired when the dialog is closed by triggering one of the close controls, e.g. close or
   * cancel button as well as clicking outside of the dialog.
   */
  @Event() internalShareSavedQueryDialogClosedEvent: EventEmitter;

  /**
   * Internal event fired when saved query share link is copied in the clipboard.
   */
  @Event() internalSavedQueryShareLinkCopiedEvent: EventEmitter;

  buildDialogConfig(): DialogConfig {
    return {
      dialogTitle: this.config.dialogTitle,
      onClose: this.onClose.bind(this)
    }
  }

  onCopy(evt: MouseEvent): void {
    evt.stopPropagation();
    this.copyToClipboard().then(() => {
      this.internalSavedQueryShareLinkCopiedEvent.emit();
    });
  }

  onClose(evt: MouseEvent): void {
    const target = evt.target as HTMLElement;
    evt.stopPropagation();
    const isOverlay = target.classList.contains('dialog-overlay');
    const isCloseButton = target.classList.contains('close-button');
    const isCancelButton = target.classList.contains('cancel-button');
    if (isOverlay || isCloseButton || isCancelButton) {
      this.internalShareSavedQueryDialogClosedEvent.emit();
    }
  }

  componentWillLoad(): void {
    this.translationService = this.serviceFactory.get(TranslationService);
  }

  componentDidRender(): void {
    const inputField: HTMLInputElement = document.querySelector('#shareLink');
    inputField.focus();
    // FIXME: For some reason this works only the first time dialog is opened
    inputField.select();
  }

  private static fallbackCopyTextToClipboard(text: string): void {
    const textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Unable to copy', err);
    }

    document.body.removeChild(textArea);
  }

  private copyToClipboard(): Promise<void> {
    if (!navigator.clipboard) {
      ShareSavedQueryDialog.fallbackCopyTextToClipboard(this.config.shareQueryLink);
      return Promise.resolve();
    }
    return navigator.clipboard.writeText(this.config.shareQueryLink).then(() => {
      console.log('Async: Copying to clipboard was successful!');
    }, (err) => {
      console.error('Async: Could not copy text: ', err);
    });
  }

  render() {
    return (
      <ontotext-dialog-web-component class="share-saved-query-dialog"
                                     config={this.buildDialogConfig()}>
        <div slot="body">
          <div class="share-query-form">
            <div class="form-field share-link-field">
              <input type="text" name="shareLink" id="shareLink" autofocus
                     value={this.config.shareQueryLink}/>
            </div>
          </div>
        </div>
        <div slot="footer">
          <button class="primary-button copy-button"
                  onClick={(evt) => this.onCopy(evt)}>{this.translationService.translate('yasqe.share.saved_query.dialog.copy.btn.label')}</button>
          <button class="secondary-button cancel-button"
                  onClick={(evt) => this.onClose(evt)}>{this.translationService.translate('confirmation.btn.cancel.label')}</button>
        </div>
      </ontotext-dialog-web-component>
    );
  }

}
