import {Component, Event, EventEmitter, h, Host, Listen, Prop} from '@stencil/core';
import {TranslationService} from '../../services/translation.service';
import {DialogConfig} from '../ontotext-dialog-web-component/ontotext-dialog-web-component';
import {KeyboardShortcutItem} from '../../models/keyboard-shortcut-description';

@Component({
  tag: 'keyboard-shortcuts-dialog',
  styleUrl: 'keyboard-shortcuts-dialog.scss',
  shadow: false,
})
export class KeyboardShortcutsDialog {
  @Prop() open: boolean;

  @Prop() items: KeyboardShortcutItem[] = [];

  @Prop() translationService: TranslationService;

  @Event() shortcutsOpen: EventEmitter<boolean>;

  private groupedItems: { [section: string]: KeyboardShortcutItem[] };

  componentWillLoad() {
    this.groupShortcutsBySection();
  }

  /**
   * Handles the Escape key keydown event and closes the dialog.
   * @param ev The keyboard event.
   */
  @Listen('keydown', {target: "window"})
  keydownListener(ev: KeyboardEvent) {
    if (ev.key === 'Escape') {
      this.shortcutsOpen.emit(false);
    }
  }

  private groupShortcutsBySection() {
    this.groupedItems = this.items.reduce((acc, item) => {
      const section = item.section;
      if (section) {
        if (!acc[section]) {
          acc[section] = [];
        }
        acc[section].push(item);
      }
      return acc;
    }, {});
  }

  private closeDialog(evt) {
    const target = evt.target as HTMLElement;
    evt.stopPropagation();
    if (target.classList.contains('close-button') || target.classList.contains('dialog-overlay')) {
      this.shortcutsOpen.emit(false);
    }
  }

  private buildDialogConfig(): DialogConfig {
    return {
      dialogTitle: this.translationService.translate('yasqe.keyboard_shortcuts.dialog.title'),
      onClose: this.closeDialog.bind(this),
      position: 'bottom',
      isModal: true,
      hideScroll: false,
    }
  }

  private translateLabel(keyboardShortcutName: string) {
    return this.translate(`yasqe.keyboard_shortcuts.dialog.item.${keyboardShortcutName}.label`);
  }

  private translateDescription(keyboardShortcutName: string) {
    return this.translate(`yasqe.keyboard_shortcuts.dialog.item.${keyboardShortcutName}.description`);
  }

  private translateSectionLabel(sectionKey: string) {
    return this.translate(`yasqe.keyboard_shortcuts.dialog.section.${sectionKey}`);
  }

  private translate(labelKey: string): string {
    if (this.translationService) {
      return this.translationService.translate(labelKey);
    }
    return labelKey;
  }

  private parseShortcutLabel(shortcutLabel: string): string[] {
    return shortcutLabel
      .split('-')
      .map(part => part.trim())
      .filter(part => part.length > 0);
  }

  private mapKeyToDisplay(key: string): any {
    switch (key.toLowerCase()) {
      case 'up':
        return <i class="fa-solid fa-arrow-up"></i>;
      case 'down':
        return <i class="fa-solid fa-arrow-down"></i>;
      case 'left':
        return <i class="fa-solid fa-arrow-left"></i>;
      case 'right':
        return <i class="fa-solid fa-arrow-right"></i>;
      default:
        return key;
    }
  }

  render() {
    return (
      <Host class='keyboard-shortcuts-dialog-wrapper'>
        {this.open &&
          <ontotext-dialog-web-component config={this.buildDialogConfig()}>
            <div slot="body" class="keyboard-shortcuts-content">
              {Object.entries(this.groupedItems).map(([section, sectionItems]) => (
                <div class='keyboard-shortcut-section'>
                  <div class='section-title-group'>
                    <div class='keyboard-shortcut-section-title'>
                      {this.translateSectionLabel(section)}
                    </div>
                    {sectionItems[0] && (
                      <div class='keyboard-shortcut-description-item'>
                        <div class='keyboard-shortcut-keys'>
                          {this.parseShortcutLabel(this.translateLabel(sectionItems[0].name))
                            .map(key => (
                              <kbd class='key'>{this.mapKeyToDisplay(key)}</kbd>
                            ))}
                        </div>
                        <div class='keyboard-shortcut-description-item-description'>
                          {this.translateDescription(sectionItems[0].name)}
                        </div>
                      </div>
                    )}
                  </div>
                  {sectionItems.slice(1).map((item: { name: string; }) => (
                    <div class='keyboard-shortcut-description-item'>
                      <div class='keyboard-shortcut-keys'>
                        {this.parseShortcutLabel(this.translateLabel(item.name))
                          .map(key => (
                            <kbd class='key'>{this.mapKeyToDisplay(key)}</kbd>
                          ))}
                      </div>
                      <div class='keyboard-shortcut-description-item-description'>
                        {this.translateDescription(item.name)}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </ontotext-dialog-web-component>
        }
      </Host>
    )
  }
}
