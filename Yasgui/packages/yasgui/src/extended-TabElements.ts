import TabList, { TabListEl } from "./TabElements";
import { addClass, removeClass } from "@triply/yasgui-utils";

class EditableTextField extends HTMLElement {
  edit? = false;
  value?: string;
}

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
    renameElement.id = "tab-" + this.tabId;
    renameElement.setAttribute("aria-controls", this.tabId); // respective tabPanel id
    renameElement.addEventListener("valueChanged", this.renameElementValueChangedHandler.bind(this));
    renameElement.addEventListener("componentModeChanged", this.renameElementComponentModeChangedHandler.bind(this));
    renameElement.addEventListener("blur", this.renameElementOnBlurHandler.bind(this));
    renameElement.addEventListener("focus", this.renameElementOnFocusHandler.bind(this));
    renameElement.addEventListener("contextmenu", this.renameElementOpenContextMenuHandler.bind(this));
    return renameElement;
  }

  private createCloseButton(): HTMLSpanElement {
    const closeBtn = document.createElement("span");
    closeBtn.innerHTML = '<i class="icon-close"></i>';
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
    if (e.code === "Enter") {
      e.preventDefault();
      this.yasgui.selectTabId(this.tabId);
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

  private renameElementOnBlurHandler(): void {
    if (!this.tabEl) return;
    if (this.tabEl.classList.contains("active")) {
      this.renameTabElement?.setAttribute("tabindex", "0");
    } else {
      this.renameTabElement?.setAttribute("tabindex", "-1");
    }
  }

  private renameElementOnFocusHandler(): void {
    if (!this.tabEl) return;
    if (this.tabEl.classList.contains("active")) {
      this.tabList.tabEntryIndex = Object.keys(this.tabList._tabs).indexOf(this.tabId);
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
    this.renameTabElement?.removeEventListener("blur", this.renameElementOnBlurHandler.bind(this));
    this.renameTabElement?.removeEventListener("focus", this.renameElementOnFocusHandler.bind(this));
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
      this._tabsListEl?.insertBefore(this._tabs[tabId].draw(tabConf.name), this.addTabEl || null);
    }
  }

  protected handleKeydownArrowKeys = (e: KeyboardEvent) => {
    if (Object.values(this._tabs).some((tabEl) => (tabEl as ExtendedTabListEl).renameTabElement?.edit)) {
      return;
    }

    if (e.code === "ArrowLeft" || e.code === "ArrowRight") {
      if (!this._tabsListEl) return;
      const numOfChildren = this._tabsListEl.childElementCount;
      if (typeof this.tabEntryIndex !== "number") return;
      const tabEntryDiv = this._tabsListEl.children[this.tabEntryIndex];
      // If the current tab does not have active set its tabindex to -1
      if (!tabEntryDiv.classList.contains("active")) {
        tabEntryDiv.setAttribute("tabindex", "-1"); // cur tab removed from tab index
      }
      if (e.code === "ArrowLeft") {
        this.tabEntryIndex--;
        if (this.tabEntryIndex < 0) {
          this.tabEntryIndex = numOfChildren - 1;
        }
      }
      if (e.code === "ArrowRight") {
        this.tabEntryIndex++;
        if (this.tabEntryIndex >= numOfChildren) {
          this.tabEntryIndex = 0;
        }
      }
      const newTabEntryDiv = this._tabsListEl.children[this.tabEntryIndex];
      newTabEntryDiv.setAttribute("tabindex", "0");
      // focus on the tab
      (newTabEntryDiv as HTMLElement).focus();
    }
  };

  public deriveTabOrderFromEls() {
    const tabs: string[] = [];
    if (this._tabsListEl) {
      for (let i = 0; i < this._tabsListEl.children.length; i++) {
        const child = this._tabsListEl.children[i]; //this is the tab div
        const anchorTag = child.children[0]; //this one has an href
        if (anchorTag) {
          const href = anchorTag.id;
          if (href && href.indexOf("tag-") >= 0) {
            tabs.push(href.substring(href.indexOf("tag-") + 1));
          }
        }
      }
    }
    return tabs;
  }
}

export default ExtendedTabList;
