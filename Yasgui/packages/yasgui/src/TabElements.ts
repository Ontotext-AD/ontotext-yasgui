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
          this.tabEl.setAttribute("title", this.translationService.translate("yasqe.tab_list.new_tab.query_invalid.warning.message"));
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
    });

    const handleDeleteTab = (e?: MouseEvent) => {
      e?.preventDefault();
      this.yasgui.getTab(this.tabId)?.close();
    };

    const tabLinkEl = document.createElement("a");
    tabLinkEl.setAttribute("role", "tab");
    tabLinkEl.href = "#" + this.tabId;
    tabLinkEl.id = "tab-" + this.tabId; // use the id for the tabpanel which is tabId to set the actual tab id
    tabLinkEl.setAttribute("aria-controls", this.tabId); // respective tabPanel id
    tabLinkEl.addEventListener("blur", () => {
      if (!this.tabEl) return;
      if (this.tabEl.classList.contains("active")) {
        tabLinkEl.setAttribute("tabindex", "0");
      } else {
        tabLinkEl.setAttribute("tabindex", "-1");
      }
    });
    tabLinkEl.addEventListener("focus", () => {
      if (!this.tabEl) return;
      if (this.tabEl.classList.contains("active")) {
        const allTabs = Object.keys(this.tabList._tabs);
        const currentTabIndex = allTabs.indexOf(this.tabId);
        this.tabList.tabEntryIndex = currentTabIndex;
      }
    });
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
  public _tabsListEl?: HTMLDivElement;
  public tabContextMenu?: TabContextMenu;
  public tabEntryIndex: number | undefined;

  constructor(yasgui: Yasgui) {
    this.yasgui = yasgui;
    this.registerListeners();
    this.tabEntryIndex = this.getActiveIndex();
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

  private getActiveIndex() {
    if (!this._selectedTab) return;
    const allTabs = Object.keys(this._tabs);
    const currentTabIndex = allTabs.indexOf(this._selectedTab);
    return currentTabIndex;
  }
  protected handleKeydownArrowKeys = (e: KeyboardEvent) => {
    if (e.code === "ArrowLeft" || e.code === "ArrowRight") {
      if (!this._tabsListEl) return;
      const numOfChildren = this._tabsListEl.childElementCount;
      if (typeof this.tabEntryIndex !== "number") return;
      const tabEntryDiv = this._tabsListEl.children[this.tabEntryIndex];
      // If the current tab does not have active set its tabindex to -1
      if (!tabEntryDiv.classList.contains("active")) {
        tabEntryDiv.children[0].setAttribute("tabindex", "-1"); // cur tab removed from tab index
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
      newTabEntryDiv.children[0].setAttribute("tabindex", "0");
      (newTabEntryDiv.children[0] as HTMLElement).focus(); // focus on the a tag inside the div for click event
    }
  };
  drawTabsList() {
    this._tabsListEl = document.createElement("div");
    addClass(this._tabsListEl, "tabsList");
    this._tabsListEl.setAttribute("role", "tablist");
    this._tabsListEl.addEventListener("keydown", this.handleKeydownArrowKeys);

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
    addTabLink.addEventListener("focus", () => {
      // sets aria tabEntryIndex to active tab
      // this.tabEntryIndex = this.getActiveIndex();
      if (!this._tabsListEl) return;
      this.tabEntryIndex = this._tabsListEl.childElementCount - 1; // sets tabEntry to add tab, visually makes sense, not sure about accessibility-wise
    });
    addTabLink.addEventListener("blur", () => {
      addTabLink.setAttribute("tabindex", "0"); // maintains tabability
    });
    const icon = document.createElement("i");
    icon.className = "icon-plus";
    addTabLink.prepend(icon);
    this.addTabEl.appendChild(addTabLink);
    this._tabsListEl.appendChild(this.addTabEl);
    this.tabContextMenu = TabContextMenu.get(
      this.yasgui,
      this.yasgui.config.contextMenuContainer ? this.yasgui.config.contextMenuContainer : this._tabsListEl
    );
    return this._tabsListEl;
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
      this._tabsListEl?.insertBefore(this._tabs[tabId].draw(tabConf.name), this.addTabEl || null);
    }
  }
  public destroy() {
    for (const tabId in this._tabs) {
      const tab = this._tabs[tabId];
      tab.delete();
    }
    this._tabs = {};
    this.tabContextMenu?.destroy();
    this._tabsListEl?.remove();
    this._tabsListEl = undefined;
  }
}

export default TabList;
