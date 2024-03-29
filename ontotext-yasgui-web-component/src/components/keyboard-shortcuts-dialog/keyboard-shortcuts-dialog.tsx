import {Component, h, Host, Listen, Prop, State} from '@stencil/core';
import {TranslationService} from '../../services/translation.service';
import {DialogConfig} from '../ontotext-dialog-web-component/ontotext-dialog-web-component';

@Component({
  tag: 'keyboard-shortcuts-dialog',
  styleUrl: 'keyboard-shortcuts-dialog.scss',
  shadow: false,
})
export class KeyboardShortcutsDialog {

  @State() open: boolean;

  @Prop() items: string[] = [];

  @Prop() translationService: TranslationService;

  /**
   * Handles the Escape key keydown event and closes the dialog.
   * @param ev The keyboard event.
   */
  @Listen('keydown', {target: "window"})
  keydownListener(ev: KeyboardEvent) {
    if (ev.key === 'Escape') {
      this.open = false;
    }
  }

  private openDialog() {
    this.open = true;
  }

  private closeDialog(evt) {
    const target = evt.target as HTMLElement;
    evt.stopPropagation();
    if (target.classList.contains('close-button') || target.classList.contains('dialog-overlay')) {
      this.open = false;
    }
  }

  private buildDialogConfig(): DialogConfig {
    return {
      dialogTitle: this.translationService.translate('yasqe.keyboard_shortcuts.dialog.title'),
      onClose: this.closeDialog.bind(this)
    }
  }

  private translateLabel(keyboardShortcutName: string) {
    return this.translate(`yasqe.keyboard_shortcuts.dialog.item.${keyboardShortcutName}.label`);
  }

  private translateDescription(keyboardShortcutName: string) {
    return this.translate(`yasqe.keyboard_shortcuts.dialog.item.${keyboardShortcutName}.description`);
  }

  private translate(labelKey: string): string {
    if (this.translationService) {
      return this.translationService.translate(labelKey);
    }
    return labelKey;
  }

  render() {
    return (
      <Host class='keyboard-shortcuts-dialog-wrapper'>
        {this.open &&
          <ontotext-dialog-web-component config={this.buildDialogConfig()}>
            <div slot="body">
              {
                this.items.map(keyboardShortcutDescriptionLabelKey =>
                  <div class='keyboard-shortcut-description-item'>
                    <kbd class='keyboard-shortcut-description-item-label'>
                      <span>{this.translateLabel(keyboardShortcutDescriptionLabelKey)}</span>
                    </kbd>
                    <div class='keyboard-shortcut-description-item-description'>
                      {this.translateDescription(keyboardShortcutDescriptionLabelKey)}
                    </div>
                  </div>
                )
              }
            </div>
          </ontotext-dialog-web-component>
        }
        {
          !this.open && <button class='keyboard-shortcuts-dialog-button'
                                onClick={() => this.openDialog()}>{this.translate('yasqe.keyboard_shortcuts.btn.label')}</button>
        }
      </Host>
    )
  }
}
