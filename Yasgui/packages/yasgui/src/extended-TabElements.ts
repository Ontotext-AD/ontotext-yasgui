import TabList, { TabListEl } from "./TabElements";
import { addClass, removeClass, TranslationService } from "@triply/yasgui-utils";

class EditableTextField extends HTMLElement {
  edit? = false;
  value?: string;
  translationService?: TranslationService;
}

const TAB_ID_PREFIX = "tab-";

export class ExtendedTabListEl extends TabListEl {
  private closeButton?: HTMLSpanElement;
  public renameTabElement?: EditableTextField;

  public draw(name: string) {
    this.tabEl = this.createTabRootElement();
    this.renameTabElement = this.createRenameElement(name);
    this.tabEl.prepend(this.renameTabElement!);
    this.closeButton = this.createCloseButton();
    this.tabEl.appendChild(this.closeButton);
    this.tabEl.appendChild(this.createLoaderElement());
    return this.tabEl;
  }

  private createTabRootElement(): HTMLDivElement {
    const tabEl = document.createElement("div");
    tabEl.setAttribute("role", "presentation");
    tabEl.addEventListener("keydown", this.tabElKeydownHandler.bind(this));
    tabEl.addEventListener("click", this.tabElOnClickHandler.bind(this));
    addClass(tabEl, "tab");
    return tabEl;
  }

  private createRenameElement(name: string): EditableTextField {
    const renameElement = document.createElement("ontotext-editable-text-field") as EditableTextField;
    renameElement.value = name;
    renameElement.setAttribute("role", "tab");
    // use the id for the tabpanel which is tabId to set the actual tab id
    renameElement.id = TAB_ID_PREFIX + this.tabId;
    renameElement.translationService = this.translationService;
    renameElement.addEventListener("valueChanged", this.renameElementValueChangedHandler.bind(this));
    renameElement.addEventListener("componentModeChanged", this.renameElementComponentModeChangedHandler.bind(this));
    renameElement.addEventListener("contextmenu", this.renameElementOpenContextMenuHandler.bind(this));
    return renameElement;
  }

  private createCloseButton(): HTMLSpanElement {
    const closeBtn = document.createElement("span");
    closeBtn.innerHTML = '<i class="ri-close-line"></i>';
    closeBtn.title = this.translationService.translate("yasgui.tab_list.close_tab.btn.label");
    closeBtn.setAttribute("tabindex", "-1");
    closeBtn.setAttribute("aria-hidden", "true");
    closeBtn.addEventListener("click", this.closeButtonOnClickHandler.bind(this));
    addClass(closeBtn, "closeTab");
    return closeBtn;
  }

  private createLoaderElement(): HTMLDivElement {
    const loaderEl = document.createElement("div");
    addClass(loaderEl, "loader");
    return loaderEl;
  }

  private tabElKeydownHandler(e: KeyboardEvent): void {
    if (e.code === "Delete") {
      if (!this.renameTabElement?.edit) {
        this.handleDeleteTab();
      }
    }
    if (e.code === "Enter" || (e.code === "Space" && !this.renameTabElement?.edit)) {
      e.preventDefault();
      this.selectWithKeyboard();
    }
  }

  private tabElOnClickHandler(e: MouseEvent): void {
    e.preventDefault();
    this.yasgui.selectTabId(this.tabId);
  }

  private renameElementValueChangedHandler(event: any) {
    const detail = event.detail;
    if (detail) {
      this.yasgui.getTab(this.tabId)?.setName(detail);
    } else if (this.renameTabElement) {
      this.renameTabElement.value = this.yasgui.getTab(this.tabId)?.getName();
    }
  }

  private renameElementComponentModeChangedHandler(event: any): void {
    if (event.detail) {
      addClass(this.closeButton, "hidden");
    } else {
      removeClass(this.closeButton, "hidden");
    }
  }

  private renameElementOpenContextMenuHandler(ev: MouseEvent): void {
    // Close possible old
    this.tabList.tabContextMenu?.closeConfigMenu();
    this.openTabConfigMenu(ev);
    ev.preventDefault();
    ev.stopPropagation();
  }

  private closeButtonOnClickHandler(event: MouseEvent) {
    if (event.shiftKey) {
      this.yasgui.getTab(this.tabId)?.getYasqe()?.emit("closeOtherTabs");
    } else {
      this.handleDeleteTab(event);
    }
  }

  private handleDeleteTab(e?: MouseEvent) {
    e?.preventDefault();
    this.yasgui.getTab(this.tabId)?.close();
  }

  public startRename() {
    if (this.renameTabElement) {
      const tab = this.yasgui.getTab(this.tabId);
      if (tab) {
        this.renameTabElement.edit = true;
        this.renameTabElement.focus();
      }
    }
  }

  public delete() {
    this.tabEl?.removeEventListener("click", this.tabElOnClickHandler.bind(this));
    this.tabEl?.removeEventListener("keydown", this.tabElKeydownHandler.bind(this));
    this.renameTabElement?.removeEventListener("valueChanged", this.renameElementValueChangedHandler.bind(this));
    this.renameTabElement?.removeEventListener(
      "componentModeChanged",
      this.renameElementComponentModeChangedHandler.bind(this)
    );
    this.renameTabElement?.removeEventListener("contextmenu", this.renameElementOpenContextMenuHandler.bind(this));
    this.closeButton?.removeEventListener("click", this.closeButtonOnClickHandler.bind(this));
    super.delete();
  }
}

export class ExtendedTabList extends TabList {
  public drawTab(tabId: string, index?: number) {
    this._tabs[tabId] = new ExtendedTabListEl(this.yasgui, this, tabId);
    const tabConf = this.yasgui.persistentConfig.getTab(tabId);
    if (index !== undefined && index < this.yasgui.persistentConfig.getTabs().length - 1) {
      this._tabsListEl?.insertBefore(
        this._tabs[tabId].draw(tabConf.name),
        this._tabs[this.yasgui.persistentConfig.getTabs()[index + 1]].tabEl || null
      );
    } else {
      this._tabsListEl?.appendChild(this._tabs[tabId].draw(tabConf.name));
    }
  }

  protected isRenamingTab(): boolean {
    return Object.values(this._tabs).some((tabEl) => (tabEl as ExtendedTabListEl).renameTabElement?.edit);
  }

  public deriveTabOrderFromEls() {
    const tabs: string[] = [];
    if (this._tabsListEl) {
      for (let i = 0; i < this._tabsListEl.children.length; i++) {
        const child = this._tabsListEl.children[i]; //this is the tab div
        const anchorTag = child.children[0]; //this one has an href
        if (anchorTag) {
          const href = anchorTag.id;
          if (href && href.indexOf(TAB_ID_PREFIX) >= 0) {
            tabs.push(href.substring(href.indexOf(TAB_ID_PREFIX) + TAB_ID_PREFIX.length));
          }
        }
      }
    }
    return tabs;
  }
}

export default ExtendedTabList;
