import { Component, Element, Listen, Prop, State } from '@stencil/core';
import { TranslationService } from '../../services/translation.service';
import { EventService } from '../../services/event-service';
import {InternalEventType} from '../../models/internal-events/internal-event-types';

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

  private querySplitToggleBtn: HTMLButtonElement;
  private splitWrapper: HTMLDivElement;
  private activeDropdownHost?: HTMLElement;

  /**
   * Handles clicks outside the dropdown to close it
   */
  @Listen('click', { target: 'window', capture: true })
  onWindowClick(e: MouseEvent) {
    if (this.querySplitOpen && this.querySplitToggleBtn && !this.querySplitToggleBtn.contains(e.target as Node)) {
      this.closeQuerySplitMenu();
    }
  }

  /**
   * Handles scroll events to close the dropdown
   */
  @Listen('scroll', { target: 'window', capture: true, passive: true })
  onWindowScroll() {
    if (this.querySplitOpen) {
      this.closeQuerySplitMenu();
    }
  }

  /**
   * Handles the Escape key to close the dropdown
   */
  @Listen('keydown', { target: 'window' })
  onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape' && this.querySplitOpen) {
      this.closeQuerySplitMenu();
    }
  }

  componentDidLoad() {
    console.log(this.hostElement.tagName);
    this.createSplitButton();
    this.attachEventListeners();
  }

  disconnectedCallback() {
    this.destroyComponent();
  }

  private createSplitButton(): void {
    this.splitWrapper = document.createElement("div");
    this.addClass(this.splitWrapper, "yasqe_querySplitWrapper");

    this.querySplitToggleBtn = document.createElement("button");
    this.addClass(this.querySplitToggleBtn, "yasqe_querySplitToggle", "icon-caret-down-after");
    this.querySplitToggleBtn.type = "button";
    this.querySplitToggleBtn.setAttribute(
      "aria-label",
      this.translationService.translate("yasqe.action.run_query.split.toggle.aria")
    );

    this.splitWrapper.appendChild(this.querySplitToggleBtn);
    this.hostElement.appendChild(this.splitWrapper);
  }

  private attachEventListeners(): void {
    this.querySplitToggleBtn.addEventListener('click', () => this.toggleQuerySplitMenu());
    this.querySplitToggleBtn.addEventListener('internalYasqeDropdownActionSelected', ((event: CustomEvent) => {
      this.handleDropdownAction(event.detail.action);
    }) as EventListener);
  }

  private handleDropdownAction(action: string): void {
    this.eventService.emitEvent(undefined, InternalEventType.INTERNAL_YASQE_DROPDOWN_ACTION_SELECTED_EVENT, action);
  }

  private addClass(el: Element | null | undefined, ...classNames: string[]): void {
    if (!el) return;
    el.classList.add(...classNames);
  }

  private removeClass(el: Element | null | undefined, className: string): void {
    el?.classList?.remove(className);
  }

  public toggleQuerySplitMenu(): void {
    if (this.querySplitOpen) {
      this.closeQuerySplitMenu();
    } else {
      this.openQuerySplitMenu();
    }
  }

  public openQuerySplitMenu(): void {
    this.querySplitOpen = true;
    this.removeClass(this.querySplitToggleBtn, "icon-caret-down-after");
    this.addClass(this.querySplitToggleBtn, "icon-caret-up-after");

    this.showDropdown(this.querySplitToggleBtn, true);
  }

  public closeQuerySplitMenu(): void {
    this.querySplitOpen = false;
    this.removeClass(this.querySplitToggleBtn, "icon-caret-up-after");
    this.addClass(this.querySplitToggleBtn, "icon-caret-down-after");

    this.hideDropdown();
  }

  private showDropdown(triggerBtn: HTMLElement, isOpen: boolean): void {
    if (!isOpen) {
      this.hideDropdown();
      return;
    }
    this.hideDropdown();

    const runActions: RunAction[] = [
      { labelKey: 'yasqe.dropdown.run_query.option.explain_query_plan', value: 'explain_plan', shortcut: 'yasqe.dropdown.run_query.option.explain_plan_shortcut' },
      { labelKey: 'yasqe.dropdown.run_query.option.llm_explain_all', value: 'explain_all', shortcut: 'yasqe.dropdown.run_query.option.llm_explain_all_shortcut' },
      { labelKey: 'yasqe.dropdown.run_query.option.llm_explain_query', value: 'explain_query' },
      { labelKey: 'yasqe.dropdown.run_query.option.llm_explain_results', value: 'explain_results' }
    ];

    const dropdownContainer = document.createElement('div');
    dropdownContainer.className = 'yasqe-inline-dropdown ontotext-run-dropdown open';

    const menu = document.createElement('div');
    menu.className = 'ontotext-run-dropdown-menu open';

    runActions.forEach(item => {
      const elementDiv = document.createElement('div');
      elementDiv.className = 'ontotext-run-dropdown-menu-item';
      elementDiv.setAttribute('role', 'menuitem');

      const labelSpan = document.createElement('span');
      labelSpan.className = 'ontotext-run-dropdown-menu-item__label';
      labelSpan.textContent = this.translationService.translate(item.labelKey);

      elementDiv.appendChild(labelSpan);

      if (item.shortcut) {
        const shortcutSpan = document.createElement('span');
        shortcutSpan.className = 'ontotext-run-dropdown-menu-item__shortcut';
        shortcutSpan.textContent = this.translationService.translate(item.shortcut);
        elementDiv.appendChild(shortcutSpan);
      }

      elementDiv.addEventListener('click', (ev) => {
        ev.preventDefault();
        triggerBtn.dispatchEvent(new CustomEvent('internalYasqeDropdownActionSelected', {
          bubbles: true,
          detail: { action: item.value }
        }));
        this.hideDropdown();
      });

      menu.appendChild(elementDiv);
    });

    dropdownContainer.appendChild(menu);
    triggerBtn.appendChild(dropdownContainer);
    this.activeDropdownHost = dropdownContainer;
  }

  private hideDropdown(): void {
    if (this.activeDropdownHost) {
      this.activeDropdownHost.remove();
      this.activeDropdownHost = undefined;
    }
  }

  private destroyComponent(): void {
    if (this.querySplitOpen) {
      this.hideDropdown();
    }

    if (this.querySplitToggleBtn) {
      this.querySplitToggleBtn.remove();
    }

    if (this.splitWrapper) {
      this.splitWrapper.remove();
    }
  }
  render() {
    // This component doesn't use JSX rendering because we're appending to an existing
    // DOM element (runButtonTooltip)
    return null;
  }
}
