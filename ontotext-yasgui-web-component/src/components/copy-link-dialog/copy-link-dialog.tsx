import {Component, Element, h, Prop} from '@stencil/core';
import {DialogConfig} from "../ontotext-dialog-web-component/ontotext-dialog-web-component";
import {ServiceFactory} from "../../services/service-factory";
import {TranslationService} from "../../services/translation.service";

export type CopyLinkDialogConfig = {
  dialogTitle?: string;
  copyLink: string;
}

export interface CopyLinkObserver {
  onDialogClosed: () => void;

  onLinkCopied: () => void;
}

@Component({
  tag: 'copy-link-dialog',
  styleUrl: 'copy-link-dialog.scss',
  shadow: false,
})
export class CopyLinkDialog {

  private shareLink: HTMLInputElement;
  private translationService: TranslationService;

  @Element() hostElement: HTMLElement;

  @Prop() config: CopyLinkDialogConfig;

  @Prop() serviceFactory: ServiceFactory

  @Prop() copyLinkEventsObserver: CopyLinkObserver;

  @Prop() classes: string

  buildDialogConfig(): DialogConfig {
    return {
      dialogTitle: this.config.dialogTitle || this.translationService.translate('yasqe.share.copy_link.dialog.title'),
      onClose: this.onClose.bind(this)
    }
  }

  onCopy(evt: MouseEvent): void {
    evt.stopPropagation();
    this.copyToClipboard().then(() => {
      if (this.copyLinkEventsObserver) {
        this.copyLinkEventsObserver.onLinkCopied();
      }
    });
  }

  onClose(evt: MouseEvent): void {
    const target = evt.target as HTMLElement;
    evt.stopPropagation();
    const isOverlay = target.classList.contains('dialog-overlay');
    const isCloseButton = target.classList.contains('close-button');
    const isCancelButton = target.classList.contains('cancel-button');
    if (isOverlay || isCloseButton || isCancelButton) {
      if (this.copyLinkEventsObserver) {
        this.copyLinkEventsObserver.onDialogClosed();
      }
    }
  }

  componentWillLoad(): void {
    this.translationService = this.serviceFactory.get(TranslationService);
  }

  componentDidLoad(): void {
    // If not placed inside a setTimeout, the shareLink input is not selected for some reason.
    setTimeout(() => {
      this.shareLink.select();
    });
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
      CopyLinkDialog.fallbackCopyTextToClipboard(this.config.copyLink);
      return Promise.resolve();
    }
    return navigator.clipboard.writeText(this.config.copyLink).then(() => {
      // do nothing
    }, (err) => {
      console.error('Could not copy share link: ', err);
    });
  }

  render() {
    const classList = `copy-link-dialog ${this.classes}`;
    return (
      <ontotext-dialog-web-component class={classList}
                                     config={this.buildDialogConfig()}>
        <div slot="body">
          <div class="copy-link-form">
            <div class="form-field copy-link-field">
              <input type="text" name="shareLink" readonly
                     ref={(el) => (this.shareLink = el)}
                     value={this.config.copyLink}/>
            </div>
          </div>
        </div>
        <div slot="footer">
          <button class="secondary-button cancel-button"
                  onClick={(evt) => this.onClose(evt)}>{this.translationService.translate('confirmation.btn.cancel.label')}</button>
          <button class="primary-button copy-button"
                  onClick={(evt) => this.onCopy(evt)}>{this.translationService.translate('yasqe.share.copy_link.dialog.copy.btn.label')}</button>
        </div>
      </ontotext-dialog-web-component>
    );
  }
}
