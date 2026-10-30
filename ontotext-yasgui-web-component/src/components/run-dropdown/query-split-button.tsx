import {Component, Element, Listen, Prop, State, h} from '@stencil/core';
import {TranslationService} from '../../services/translation.service';
import {EventService} from '../../services/event-service';
import {
    InternalRunDropdownValueSelectedEvent
} from '../../models/internal-events/internal-run-dropdown-value-selected-event';

interface RunAction {
    labelKey: string;
    value: string;
    shortcut?: string;
}

@Component({
    tag: 'query-split-button',
    styleUrl: 'query-split-button.scss',
    shadow: false,
})
export class QuerySplitButton {
    @Element() hostElement: HTMLElement;

    @Prop() yasqe: any;
    @Prop() translationService: TranslationService;
    @Prop() eventService: EventService;

    @State() querySplitOpen = false;

    private toggleButton: HTMLButtonElement;
    /**
     * The option to focus once the menu is rendered open: 'first', 'last' or none.
     */
    private optionToFocusOnOpen: 'first' | 'last' | undefined;

    private runActions: RunAction[] = [
        {labelKey: 'yasqe.dropdown.run_query.option.explain_query_plan', value: 'explain_plan'},
        {labelKey: 'yasqe.dropdown.run_query.option.llm_explain_all', value: 'explain_all'},
        {labelKey: 'yasqe.dropdown.run_query.option.llm_explain_query', value: 'explain_query'},
        {labelKey: 'yasqe.dropdown.run_query.option.llm_explain_results', value: 'explain_results'},
    ];

    @Listen('click', {target: 'window', capture: true})
    onWindowClick(e: MouseEvent) {
        if (this.querySplitOpen && this.hostElement && !this.hostElement.contains(e.target as Node)) {
            this.closeQuerySplitMenu();
        }
    }

    @Listen('scroll', {target: 'window', capture: true, passive: true})
    onWindowScroll() {
        if (this.querySplitOpen) {
            this.closeQuerySplitMenu();
        }
    }

    @Listen('keydown', {target: 'window'})
    onKeyDown(e: KeyboardEvent) {
        if (e.key === 'Escape' && this.querySplitOpen) {
            this.closeQuerySplitMenu();
        }
    }

    componentDidRender(): void {
        const options = this.getMenuOptions();
        if (this.optionToFocusOnOpen && options.length) {
            // The menu is positioned after it renders, so focusing must not scroll the page, which closes the menu.
            options[this.optionToFocusOnOpen === 'first' ? 0 : options.length - 1].focus({preventScroll: true});
            this.optionToFocusOnOpen = undefined;
        }
    }

    @Listen('resize', {target: 'window', passive: true})
    onWindowResize() {
        if (this.querySplitOpen) {
            this.closeQuerySplitMenu();
        }
    }

    private positionDropdownMenu(): void {
       const splitButtonTopMargin = window.getComputedStyle(document.querySelector('.yasqe_queryButton')).marginTop;
       const splitButtonTopMarginValue = parseFloat(splitButtonTopMargin) || 0;
       const fullscreenButtonDropdownGap = 2; // Gap between the top of the button and dropdown in fullscreen mode
       const distanceFromEditorRightEdge = 33; // Distance from the right edge of the editor to the dropdown right edge
        // Using setTimeout to ensure the dropdown is re-rendered after calculating its position
        setTimeout(() => {
            const button = this.hostElement.querySelector('.yasqe_querySplitWrapper') as HTMLElement;
            const dropdown = this.hostElement.querySelector('.ontotext-run-dropdown-menu.open') as HTMLElement;

            if (button && dropdown) {
              const host = this.hostElement.closest('.yasgui-host-element') as HTMLElement | null;
              const isModeYasgui =
                !!host &&
                host.classList.contains('orientation-horizontal') &&
                host.classList.contains('mode-yasgui');
                const buttonRect = this.hostElement.getBoundingClientRect();
                const isFullscreen = this.yasqe.classList.contains('yasqe-fullscreen');
                const buttonGroup = window.getComputedStyle(document.querySelector('.yasqe_buttons'));
                // Convert the string value (like "10 px") to a number and default to 0 if not a number
                const buttonGroupRight = buttonGroup.right !== 'auto' ? parseFloat(buttonGroup.right) || 0 : 0;

                dropdown.style.position = 'fixed';
                if (!isModeYasgui) {
                  const baseRight = (parseFloat(dropdown.style.right) || 0) + buttonGroupRight + distanceFromEditorRightEdge;
                  dropdown.style.right = `${baseRight}px`;
                } else {
                  dropdown.style.removeProperty('right');
                }
                const dropdownRect = dropdown.getBoundingClientRect();
                const dropdownHeight = dropdownRect.height;

                if (isFullscreen) {
                  dropdown.style.top = `${buttonRect.top - dropdownHeight + splitButtonTopMarginValue}px`;
                    dropdown.style.right = `${window.innerWidth - buttonRect.right}px`;
                } else {
                    dropdown.style.top = `${buttonRect.bottom + fullscreenButtonDropdownGap}px`;
                }
            }
        });
    }

    private toggleQuerySplitMenu = () => {
        this.querySplitOpen ? this.closeQuerySplitMenu() : this.openQuerySplitMenu();
    };

    private openQuerySplitMenu(optionToFocus: 'first' | 'last' = 'first') {
        this.optionToFocusOnOpen = optionToFocus;
        this.querySplitOpen = true;
        this.positionDropdownMenu();
    }

    private onToggleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            this.openQuerySplitMenu(e.key === 'ArrowDown' ? 'first' : 'last');
        } else if (e.key === 'Escape' && this.querySplitOpen) {
            this.closeQuerySplitMenu();
        }
    };

    /**
     * Moves the focus between the options with the arrow, Home and End keys, runs the focused option with Enter or
     * Space, closes the menu on Escape, returning the focus to the toggle, and closes it when Tab moves the focus out.
     * Escape is handled here as well as on the window, because a host page may stop it before it reaches the window.
     *
     * @param e The keyboard event.
     * @param action The value of the focused option.
     */
    private onOptionKeyDown(e: KeyboardEvent, action: string): void {
        const options = this.getMenuOptions();
        const index = options.indexOf(e.target as HTMLElement);
        const focusOption = (optionIndex: number) => {
            e.preventDefault();
            options[(optionIndex + options.length) % options.length].focus();
        };
        switch (e.key) {
            case 'ArrowDown':
                focusOption(index + 1);
                break;
            case 'ArrowUp':
                focusOption(index - 1);
                break;
            case 'Home':
                focusOption(0);
                break;
            case 'End':
                focusOption(options.length - 1);
                break;
            case 'Enter':
            case ' ':
                e.preventDefault();
                this.selectAction(action);
                break;
            case 'Escape':
                this.closeQuerySplitMenu();
                this.toggleButton.focus();
                break;
            case 'Tab':
                this.closeQuerySplitMenu();
                break;
        }
    }

    private selectAction(action: string): void {
        this.handleDropdownAction(action);
        this.closeQuerySplitMenu();
        this.toggleButton.focus();
    }

    private getMenuOptions(): HTMLElement[] {
        return Array.from(this.hostElement.querySelectorAll('.ontotext-run-dropdown-menu-item'));
    }

    private closeQuerySplitMenu() {
        this.querySplitOpen = false;
    }

    private handleDropdownAction(action: string): void {
        this.eventService.emit(new InternalRunDropdownValueSelectedEvent(action));
    }

    // DEV NOTE: Leaving the shortcut implementation here for use when the new icon library is chosen.
    private parseShortcutLabel(shortcutLabel: string): string[] {
        return shortcutLabel
            .split('-')
            .map((part) => part.trim())
            .filter((part) => part.length > 0);
    }

    render() {
        const caretClass = this.querySplitOpen ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line';

        return (
            <div class="yasqe_querySplitWrapper">
                <button
                    type="button"
                    class={`yasqe_querySplitToggle ${caretClass}`}
                    aria-label={this.translationService.translate('yasqe.action.run_query.split.toggle.aria')}
                    aria-haspopup="menu"
                    aria-expanded={this.querySplitOpen ? 'true' : 'false'}
                    ref={(el) => (this.toggleButton = el)}
                    onClick={this.toggleQuerySplitMenu}
                    onKeyDown={this.onToggleKeyDown}
                />
                {this.querySplitOpen && (
                    <div class="yasqe-inline-dropdown ontotext-run-dropdown open">
                        <div class="ontotext-run-dropdown-menu open" role="menu">
                            {this.runActions.map((item) => (
                                    <div
                                        class="ontotext-run-dropdown-menu-item"
                                        role="menuitem"
                                        tabindex="-1"
                                        onClick={(ev) => {
                                            ev.preventDefault();
                                            this.selectAction(item.value);
                                        }}
                                        onKeyDown={(ev) => this.onOptionKeyDown(ev, item.value)}
                                    >
                  <span class="ontotext-run-dropdown-menu-item__label">
                    {this.translationService.translate(item.labelKey)}
                  </span>
                                        {item.shortcut && (
                                            <span class="ontotext-run-dropdown-menu-item__shortcut">
                      {this.parseShortcutLabel(this.translationService.translate(item.shortcut)).map((keyPart) => (
                          <kbd class="key">{keyPart}</kbd>
                      ))}
                    </span>
                                        )}
                                    </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }
}
