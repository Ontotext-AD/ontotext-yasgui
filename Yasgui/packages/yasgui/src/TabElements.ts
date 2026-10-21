import Yasgui from "./";
import TabContextMenu from "./TabContextMenu";
import { hasClass, addClass, removeClass } from "@triply/yasgui-utils";
import { TranslationService } from "@triply/yasgui-utils";
const sortablejs = require("sortablejs");
require("./TabElements.scss");
export interface TabList {}
export class TabListEl {
  protected tabList: TabList;
  protected tabId: string;
  protected yasgui: Yasgui;
  private renameEl?: HTMLInputElement;
  private nameEl?: HTMLSpanElement;
  public tabEl?: HTMLDivElement;
  protected readonly translationService: TranslationService;
  constructor(yasgui: Yasgui, tabList: TabList, tabId: string) {
    this.tabList = tabList;
    this.yasgui = yasgui;
    this.translationService = this.yasgui.translationService;
    this.tabId = tabId;
  }
  public delete() {
    if (this.tabEl) {
      this.tabList._tabsListEl?.removeChild(this.tabEl);
      delete this.tabList._tabs[this.tabId];
    }
  }
  public startRename() {
    if (this.renameEl) {
      const tab = this.yasgui.getTab(this.tabId);
      if (tab) {
        this.renameEl.value = tab.name();
        addClass(this.tabEl, "renaming");
        this.renameEl.focus();
      }
    }
  }
  public active(active: boolean) {
    if (!this.tabEl) return;
    if (active) {
      addClass(this.tabEl, "active");
      // add aria-properties
      this.tabEl.children[0].setAttribute("aria-selected", "true");
      this.tabEl.children[0].setAttribute("tabindex", "0");
    } else {
      removeClass(this.tabEl, "active");
      // remove aria-properties
      this.tabEl.children[0].setAttribute("aria-selected", "false");
      this.tabEl.children[0].setAttribute("tabindex", "-1");
    }
  }
  /**
   * Links the tab to its tab panel. The panel is drawn lazily when the tab is shown for the first time,
   * so the tab references it only after it exists.
   */
  public linkTabPanel() {
    this.tabEl?.children[0]?.setAttribute("aria-controls", this.tabId);
  }
  /**
   * Selects the tab from the keyboard. The focus stays on the tab, so the user can keep navigating the tab list,
   * even if the editor of the selected tab is focused automatically.
   */
  protected selectWithKeyboard() {
    this.yasgui.selectTabId(this.tabId);
    this.tabList.focusSelectedTab();
  }
  public rename(name: string) {
    if (this.nameEl) {
      this.nameEl.textContent = name;
    }
  }
  public setAsValid(isValid: boolean) {
    if (isValid) {
      removeClass(this.tabEl, "query-invalid");
      if (this.tabEl) {
        this.tabEl.removeAttribute("title");
      }
    } else {
      addClass(this.tabEl, "query-invalid");
      if (this.tabEl) {
        this.tabEl.setAttribute(
          "title",
          this.translationService.translate("yasqe.tab_list.new_tab.query_invalid.warning.message")
        );
      }
    }
  }
  public setAsQuerying(querying: boolean) {
    if (querying) {
      addClass(this.tabEl, "querying");
    } else {
      removeClass(this.tabEl, "querying");
    }
  }
  public draw(name: string) {
    this.tabEl = document.createElement("div");
    this.tabEl.setAttribute("role", "presentation");
    this.tabEl.ondblclick = () => {
      this.startRename();
    };
    addClass(this.tabEl, "tab");
    this.tabEl.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.code === "Delete") handleDeleteTab();
      if (e.code === "Space" && !hasClass(this.tabEl, "renaming")) {
        e.preventDefault();
        this.selectWithKeyboard();
      }
    });

    const handleDeleteTab = (e?: MouseEvent) => {
      e?.preventDefault();
      this.yasgui.getTab(this.tabId)?.close();
    };

    const tabLinkEl = document.createElement("a");
    tabLinkEl.setAttribute("role", "tab");
    tabLinkEl.href = "#" + this.tabId;
    tabLinkEl.id = "tab-" + this.tabId; // use the id for the tabpanel which is tabId to set the actual tab id
    // if (this.yasgui.persistentConfig.tabIsActive(this.tabId)) {
    //   this.yasgui.store.dispatch(selectTab(this.tabId))
    // }
    tabLinkEl.addEventListener("click", (e) => {
      e.preventDefault();
      this.yasgui.selectTabId(this.tabId);
    });

    //tab name
    this.nameEl = document.createElement("span");
    this.nameEl.textContent = name;
    tabLinkEl.appendChild(this.nameEl);

    //tab close btn
    const closeBtn = document.createElement("div");
    closeBtn.innerHTML = "&#x2716;";
    closeBtn.title = this.translationService.translate("yasgui.tab_list.close_tab.btn.label");
    closeBtn.setAttribute("tabindex", "-1");
    closeBtn.setAttribute("aria-hidden", "true");
    addClass(closeBtn, "closeTab");
    closeBtn.addEventListener("click", (event) => {
      if (event.shiftKey) {
        this.yasgui.getTab(this.tabId)?.getYasqe()?.emit("closeOtherTabs");
      } else {
        handleDeleteTab(event);
      }
    });
    tabLinkEl.appendChild(closeBtn);

    const renameEl = (this.renameEl = document.createElement("input"));
    renameEl.type = "text";
    renameEl.value = name;
    renameEl.onkeyup = (event) => {
      if (event.key === "Enter") {
        this.yasgui.getTab(this.tabId)?.setName(renameEl.value);
        removeClass(this.tabEl, "renaming");
      }
    };
    renameEl.onblur = () => {
      this.yasgui.getTab(this.tabId)?.setName(renameEl.value);
      removeClass(this.tabEl, "renaming");
    };
    tabLinkEl.appendChild(this.renameEl);
    tabLinkEl.oncontextmenu = (ev: MouseEvent) => {
      // Close possible old
      this.tabList.tabContextMenu?.closeConfigMenu();
      this.openTabConfigMenu(ev);
      ev.preventDefault();
      ev.stopPropagation();
    };
    this.tabEl.appendChild(tabLinkEl);

    //draw loading animation overlay
    const loaderEl = document.createElement("div");
    addClass(loaderEl, "loader");
    this.tabEl.appendChild(loaderEl);

    return this.tabEl;
  }
  protected openTabConfigMenu(event: MouseEvent) {
    this.tabList.tabContextMenu?.openConfigMenu(this.tabId, this, event);
  }
  redrawContextMenu() {
    this.tabList.tabContextMenu?.redraw();
  }
}

export class TabList {
  yasgui: Yasgui;

  private _selectedTab?: string;
  protected addTabEl?: HTMLDivElement;
  public _tabs: { [tabId: string]: TabListEl } = {};
  /**
   * Holds the tab list and the add tab button. The button is outside the tab list, because a tab list may own only tabs.
   */
  private tabsBarEl?: HTMLDivElement;
  public _tabsListEl?: HTMLDivElement;
  public tabContextMenu?: TabContextMenu;

  constructor(yasgui: Yasgui) {
    this.yasgui = yasgui;
    this.registerListeners();
  }
  get(tabId: string) {
    return this._tabs[tabId];
  }

  private registerListeners() {
    this.yasgui.on("query", (_yasgui, tab) => {
      const id = tab.getId();
      if (this._tabs[id]) {
        this._tabs[id].setAsQuerying(true);
      }
    });
    this.yasgui.on("queryResponse", (_yasgui, tab) => {
      const id = tab.getId();
      if (this._tabs[id]) {
        this._tabs[id].setAsQuerying(false);
      }
    });
    this.yasgui.on("queryAbort", (_yasgui, tab) => {
      const id = tab.getId();
      if (this._tabs[id]) {
        this._tabs[id].setAsQuerying(false);
      }
    });
    this.yasgui.on("queryStatus", (tab, data) => this.queryStatusChangeHandler(tab, data));
    this.yasgui.on("yasqeReady", (tab, yasqe) => this.yasqeReadyHandler(tab, yasqe));
  }

  private yasqeReadyHandler(tab: any, yasqe: any) {
    this._tabs[tab.getId()].setAsValid(yasqe.queryValid);
  }

  private queryStatusChangeHandler(tab: any, data: any) {
    this._tabs[tab.getId()].setAsValid(data.valid);
  }

  protected isRenamingTab(): boolean {
    return !!this._tabsListEl?.querySelector(".tab.renaming");
  }
  private getTabElements(): HTMLElement[] {
    return Array.from(this._tabsListEl?.querySelectorAll<HTMLElement>("[role=tab]") || []);
  }
  /**
   * Moves the focus to the given tab and makes it the only tab stop of the tab list (roving tabindex).
   *
   * @param tabElement - The element with the tab role to focus.
   */
  private focusTab(tabElement: HTMLElement) {
    for (const tab of this.getTabElements()) {
      tab.setAttribute("tabindex", tab === tabElement ? "0" : "-1");
    }
    tabElement.focus();
  }
  /**
   * Moves the focus to the selected tab and makes it the only tab stop of the tab list.
   */
  public focusSelectedTab() {
    if (!this._selectedTab) return;
    const selectedTabElement = this._tabs[this._selectedTab]?.tabEl?.querySelector<HTMLElement>("[role=tab]");
    if (selectedTabElement) {
      this.focusTab(selectedTabElement);
    }
  }
  /**
   * Moves the focus between the tabs following the WAI-ARIA tabs pattern. A tab is selected with Enter or Space.
   */
  private handleTabListKeydown = (e: KeyboardEvent) => {
    if (this.isRenamingTab()) return;
    const tabs = this.getTabElements();
    const currentIndex = tabs.findIndex((tab) => tab.contains(e.target as Node));
    if (currentIndex < 0) return;
    let newIndex: number;
    switch (e.code) {
      case "ArrowLeft":
        newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        break;
      case "ArrowRight":
        newIndex = (currentIndex + 1) % tabs.length;
        break;
      case "Home":
        newIndex = 0;
        break;
      case "End":
        newIndex = tabs.length - 1;
        break;
      default:
        return;
    }
    e.preventDefault();
    this.focusTab(tabs[newIndex]);
  };
  /**
   * When the focus leaves the tab list, the selected tab becomes the only tab stop again,
   * so tabbing back into the tab list focuses the selected tab.
   */
  private handleFocusOut = (e: FocusEvent) => {
    // The focus stays where it was, when the whole window loses the focus
    if (!document.hasFocus()) return;
    if (this._tabsListEl?.contains(e.relatedTarget as Node)) return;
    if (this._selectedTab) this.selectTab(this._selectedTab);
  };
  drawTabsList() {
    this.tabsBarEl = document.createElement("div");
    // The bar keeps the "tabsList" class, because the styles and the layout of the embedding pages rely on it
    addClass(this.tabsBarEl, "tabsList");

    this._tabsListEl = document.createElement("div");
    addClass(this._tabsListEl, "tabs");
    this._tabsListEl.setAttribute("role", "tablist");
    // Accessibility checkers detect keyboard support of a tab list only by an inline key handler attribute.
    // The empty attribute is replaced by the handler property right away, so no inline code is executed.
    this._tabsListEl.setAttribute("onkeydown", "");
    this._tabsListEl.onkeydown = this.handleTabListKeydown;
    this._tabsListEl.addEventListener("focusout", this.handleFocusOut);
    this.tabsBarEl.appendChild(this._tabsListEl);

    sortablejs.default.create(this._tabsListEl, {
      group: "tabList",
      animation: 100,
      onUpdate: (_ev: any) => {
        const tabs = this.deriveTabOrderFromEls();
        this.yasgui.emit("tabOrderChanged", this.yasgui, tabs);
        this.yasgui.persistentConfig.setTabOrder(tabs);
      },
      filter: ".addTab",
      onMove: (ev: any, _origEv: any) => {
        return hasClass(ev.related, "tab");
      },
    });

    this.addTabEl = document.createElement("div");
    this.addTabEl.setAttribute("role", "presentation");
    this.addTabEl.className = "create-tab-tab";

    const addTabLink = document.createElement("button");
    addTabLink.className = "addTab";
    const addTabLabel = this.yasgui.translationService.translate("yasgui.tab_list.add_tab.btn.label");
    addTabLink.title = addTabLabel;
    addTabLink.setAttribute("aria-label", addTabLabel);
    addTabLink.addEventListener("click", this.handleAddNewTab);
    const icon = document.createElement("i");
    icon.className = "ri-add-circle-line";
    addTabLink.prepend(icon);
    this.addTabEl.appendChild(addTabLink);
    this.tabsBarEl.appendChild(this.addTabEl);
    this.tabContextMenu = TabContextMenu.get(
      this.yasgui,
      this.yasgui.config.contextMenuContainer ? this.yasgui.config.contextMenuContainer : this.tabsBarEl
    );
    return this.tabsBarEl;
  }
  handleAddNewTab = (event: Event) => {
    event.preventDefault();
    this.yasgui.addTab(true);
  };
  // drawPanels() {
  //   this.tabPanelsEl = document.createElement("div");
  //   return this.tabsListEl;
  // }
  public addTab(tabId: string, index?: number) {
    return this.drawTab(tabId, index);
  }
  public deriveTabOrderFromEls() {
    const tabs: string[] = [];
    if (this._tabsListEl) {
      for (let i = 0; i < this._tabsListEl.children.length; i++) {
        const child = this._tabsListEl.children[i]; //this is the tab div
        const anchorTag = child.children[0]; //this one has an href
        if (anchorTag) {
          const href = (<HTMLAnchorElement>anchorTag).href;
          if (href && href.indexOf("#") >= 0) {
            tabs.push(href.substr(href.indexOf("#") + 1));
          }
        }
      }
    }
    return tabs;
  }

  public selectTab(tabId: string) {
    this._selectedTab = tabId;
    for (const id in this._tabs) {
      this._tabs[id].active(this._selectedTab === id);
    }
  }

  public drawTab(tabId: string, index?: number) {
    this._tabs[tabId] = new TabListEl(this.yasgui, this, tabId);
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
  public destroy() {
    for (const tabId in this._tabs) {
      const tab = this._tabs[tabId];
      tab.delete();
    }
    this._tabs = {};
    this.tabContextMenu?.destroy();
    this.tabsBarEl?.remove();
    this.tabsBarEl = undefined;
    this._tabsListEl = undefined;
  }
}

export default TabList;
