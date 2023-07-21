import { EventEmitter } from "events";
import { merge, filter, mapValues, uniqueId } from "lodash-es";
import getDefaults from "./defaults";
import { Plugin } from "./plugins";
import {
  Storage as YStorage,
  drawFontAwesomeIconAsSvg,
  drawSvgStringAsElement,
  removeClass,
  addClass,
  hasClass,
} from "@triply/yasgui-utils";
import Parser from "./parsers";
export { default as Parser } from "./parsers";
import { addScript, addCss, sanitize } from "./helpers";
import * as faDownload from "@fortawesome/free-solid-svg-icons/faDownload";
import * as faQuestionCircle from "@fortawesome/free-solid-svg-icons/faQuestionCircle";
require("./main.scss");

export interface PersistentConfig {
  selectedPlugin?: string;
  pluginsConfig?: { [pluginName: string]: any };
}

export interface Yasr {
  on(event: "change", listener: (instance: Yasr) => void): this;
  emit(event: "change", instance: Yasr): boolean;
  on(event: "draw", listener: (instance: Yasr, plugin: Plugin<any>) => void): this;
  emit(event: "draw", instance: Yasr, plugin: Plugin<any>): boolean;
  on(event: "drawn", listener: (instance: Yasr, plugin: Plugin<any>) => void): this;
  emit(event: "drawn", instance: Yasr, plugin: Plugin<any>): boolean;
  on(event: "toggle-help", listener: (instance: Yasr) => void): this;
  emit(event: "toggle-help", instance: Yasr): boolean;
}
export class Yasr extends EventEmitter {
  public results?: Parser;
  public rootEl: HTMLDivElement;
  public headerEl: HTMLDivElement;
  public fallbackInfoEl: HTMLDivElement;
  public resultsEl: HTMLDivElement;
  public pluginControls!: HTMLDivElement;
  public config: Config;
  public storage: YStorage;
  public plugins: { [name: string]: Plugin<any> } = {};
  // private persistentConfig: PersistentConfig;
  public helpDrawn: Boolean = false;
  private drawnPlugin: string | undefined;
  private selectedPlugin: string | undefined;

  public readonly translationService: TranslationService;
  readonly yasqe: Yasqe;

  // Utils
  public utils = { addScript: addScript, addCSS: addCss, sanitize: sanitize };

  constructor(yasqe: Yasqe, parent: HTMLElement, conf: Partial<Config> = {}, data?: any) {
    super();
    if (!parent) throw new Error("No parent passed as argument. Dont know where to draw YASR");
    this.yasqe = yasqe;
    this.rootEl = document.createElement("div");
    this.rootEl.className = "yasr";
    parent.appendChild(this.rootEl);
    this.config = merge({}, Yasr.defaults, conf);

    //Do some post processing
    this.translationService = this.config.translationService;
    this.storage = new YStorage(Yasr.storageNamespace);
    this.getConfigFromStorage();
    this.headerEl = document.createElement("div");
    this.headerEl.className = "yasr_header";
    this.rootEl.appendChild(this.headerEl);
    this.fallbackInfoEl = document.createElement("div");
    this.fallbackInfoEl.className = "yasr_fallback_info";
    this.rootEl.appendChild(this.fallbackInfoEl);
    this.resultsEl = document.createElement("div");
    this.resultsEl.className = "yasr_results";
    this.resultsEl.id = uniqueId("resultsId");
    this.rootEl.appendChild(this.resultsEl);
    this.initializePlugins();
    this.drawHeader();

    const resp = data || this.getResponseFromStorage();
    if (resp) this.setResponse(resp);
  }
  private getConfigFromStorage() {
    const storageId = this.getStorageId(this.config.persistenceLabelConfig);
    if (storageId) {
      const persistentConfig: PersistentConfig | undefined = this.storage.get(storageId);
      if (persistentConfig) {
        this.selectedPlugin = persistentConfig.selectedPlugin;
        for (const pluginName in persistentConfig.pluginsConfig) {
          const pConf = persistentConfig.pluginsConfig[pluginName];
          if (pConf && this.config.plugins[pluginName]) this.config.plugins[pluginName].dynamicConfig = pConf;
        }
      }
    }
  }

  /**
   * Ask the [[ Config.errorRenderers | configured error renderers ]] for a
   * custom rendering of [[`error`]].
   *
   * @param  error the error for which to find a custom rendering
   * @return       the first custom rendering found, or `undefined` if none was found.
   */
  public async renderError(error: Parser.ErrorSummary): Promise<HTMLElement | undefined> {
    // Chain the errorRenderers to get the first special rendering of the error
    // if no special rendering is found, return undefined
    let element: HTMLElement | undefined = undefined;
    if (this.config.errorRenderers !== undefined) {
      for (const renderer of this.config.errorRenderers) {
        element = await renderer(error);
        if (element !== undefined) break; // we found the first special case, so return that!
      }
    }
    return element;
  }

  public getStorageId(label: string, getter?: Config["persistenceId"]): string | undefined {
    const persistenceId = getter || this.config.persistenceId;
    if (!persistenceId) return;
    if (typeof persistenceId === "string") return persistenceId + "_" + label;
    return persistenceId(this) + "_" + label;
  }

  public somethingDrawn() {
    return !!this.resultsEl.children.length;
  }
  /**
   * Empties fallback element
   * CSS will make sure the outline is hidden when empty
   */
  public emptyFallbackElement() {
    // This is quicker than `<node>.innerHtml = ""`
    while (this.fallbackInfoEl.firstChild) this.fallbackInfoEl.removeChild(this.fallbackInfoEl.firstChild);
  }
  public getSelectedPluginName(): string {
    return this.selectedPlugin || this.config.defaultPlugin;
  }
  public getSelectedPlugin() {
    if (this.plugins[this.getSelectedPluginName()]) {
      return this.plugins[this.getSelectedPluginName()];
    }
    console.warn(`Tried using plugin ${this.getSelectedPluginName()}, but seems this plugin isnt registered in yasr.`);
  }
  /**
   * Update selectors, based on whether they can actuall draw something, and which plugin is currently selected
   */
  private updatePluginSelectors(enabledPlugins?: string[]) {
    if (!this.pluginSelectorsEl) return;
    for (const pluginName in this.config.plugins) {
      const plugin = this.plugins[pluginName];
      if (plugin && !plugin.hideFromSelection) {
        if (enabledPlugins) {
          if (enabledPlugins.indexOf(pluginName) >= 0) {
            //make sure enabled
            removeClass(this.pluginSelectorsEl.querySelector(".select_" + pluginName), "disabled");
          } else {
            //make sure disabled
            addClass(this.pluginSelectorsEl.querySelector(".select_" + pluginName), "disabled");
          }
        }
        if (pluginName === this.getSelectedPluginName()) {
          addClass(this.pluginSelectorsEl.querySelector(".select_" + pluginName), "selected");
        } else {
          removeClass(this.pluginSelectorsEl.querySelector(".select_" + pluginName), "selected");
        }
      }
    }
  }

  private getCompatiblePlugins(): string[] {
    if (!this.results)
      return Object.keys(
        filter(this.config.plugins, (val) => (typeof val === "object" && val.enabled) || val === true)
      );

    const supportedPlugins: { name: string; priority: number }[] = [];
    for (const pluginName in this.plugins) {
      if (this.plugins[pluginName].canHandleResults()) {
        supportedPlugins.push({ name: pluginName, priority: this.plugins[pluginName].priority });
      }
    }
    return supportedPlugins.sort((p1, p2) => p2.priority - p1.priority).map((p) => p.name);
  }
  public draw() {
    this.updateHelpButton();
    this.updateResponseInfo();
    if (!this.results) return;
    this.updatePluginSelectorNames();
    const compatiblePlugins = this.getCompatiblePlugins();
    if (this.drawnPlugin && this.getSelectedPluginName() !== this.drawnPlugin) {
      while (this.pluginControls.firstChild) {
        this.pluginControls.firstChild.remove();
      }
      this.plugins[this.drawnPlugin].destroy?.();
    }
    let pluginToDraw: string | undefined;
    if (this.getSelectedPlugin() && this.getSelectedPlugin()?.canHandleResults()) {
      pluginToDraw = this.getSelectedPluginName();
      // When present remove fallback box
      this.emptyFallbackElement();
    } else if (compatiblePlugins[0]) {
      if (this.drawnPlugin) {
        this.plugins[this.drawnPlugin].destroy?.();
      }
      pluginToDraw = compatiblePlugins[0];
      // Signal to create the plugin+
      this.fillFallbackBox(pluginToDraw);
    }
    if (pluginToDraw) {
      this.drawnPlugin = pluginToDraw;

      this.emit("draw", this, this.plugins[pluginToDraw]);
      const plugin = this.plugins[pluginToDraw];
      const initPromise = plugin.initialize ? plugin.initialize() : Promise.resolve();
      initPromise.then(
        async () => {
          if (pluginToDraw) {
            // make sure to clear the object _here_
            // otherwise we run into race conditions when draw is executed
            // shortly after each other, and the plugin uses an initialize function
            // as a result, things can be rendered _twice_
            while (this.resultsEl.firstChild) this.resultsEl.firstChild.remove();
            await this.plugins[pluginToDraw].draw(this.config.plugins[pluginToDraw].dynamicConfig);
            this.emit("drawn", this, this.plugins[pluginToDraw]);
            this.updateExportHeaders();
            this.updatePluginSelectors(compatiblePlugins);
          }
        },
        (_e) => console.error
      );
    } else {
      this.resultsEl.textContent = this.translationService.translate("yasr.plugin.no_compatible.message");
      this.updateExportHeaders();
      this.updatePluginSelectors(compatiblePlugins);
    }
  }
  //just an alias for `draw`. That way, we've got a consistent api with yasqe
  public refresh() {
    this.draw();
  }
  public destroy() {
    if (this.drawnPlugin) this.plugins[this.drawnPlugin]?.destroy?.();
    this.removeAllListeners();
    this.rootEl.remove();
  }

  getPrefixes(): Prefixes {
    if (this.config.prefixes) {
      if (typeof this.config.prefixes === "function") {
        return this.config.prefixes(this);
      } else {
        return this.config.prefixes;
      }
    }
    return {};
  }
  public selectPlugin(plugin: string) {
    if (this.selectedPlugin === plugin) {
      // Don't re-render when selecting the same plugin. Also see #1893
      return;
    }
    if (this.config.plugins[plugin]) {
      this.selectedPlugin = plugin;
    } else {
      console.warn(`Plugin ${plugin} does not exist.`);
      this.selectedPlugin = this.config.defaultPlugin;
    }
    this.storeConfig();
    this.emit("change", this);
    this.updatePluginSelectors();
    this.draw();
  }
  private pluginSelectorsEl!: HTMLUListElement;
  getPluginSelectorsEl(): HTMLUListElement {
    return this.pluginSelectorsEl;
  }
  drawPluginSelectors() {
    this.pluginSelectorsEl = document.createElement("ul");
    this.pluginSelectorsEl.className = "yasr_btnGroup";
    const pluginOrder = this.config.pluginOrder;
    Object.keys(this.config.plugins)
      .sort()
      .forEach((plugin) => {
        if (pluginOrder.indexOf(plugin) === -1) pluginOrder.push(plugin);
      });
    for (const pluginName of pluginOrder) {
      if (!this.config.plugins[pluginName] || !this.config.plugins[pluginName].enabled) {
        continue;
      }
      const plugin = this.plugins[pluginName];

      if (!plugin) continue; //plugin not loaded
      if (plugin.hideFromSelection) continue;
      const name = this.translationService.translate(
        `yasr.plugin_control.plugin.name.${plugin.label || pluginName}`.toLowerCase()
      );
      const button = document.createElement("button");
      addClass(button, "yasr_btn", "select_" + pluginName);
      button.type = "button";
      button.setAttribute(
        "aria-label",
        this.translationService.translate("yasr.plugin_control.shows_view.btn.aria_label", [
          { key: "name", value: name },
        ])
      );
      if (plugin.getIcon) {
        const icon = plugin.getIcon();
        if (icon) {
          // icon.className = '';
          addClass(icon, "plugin_icon");
          button.appendChild(icon);
        }
      }
      const nameEl = document.createElement("span");
      nameEl.textContent = name;
      button.appendChild(nameEl);
      button.addEventListener("click", () => this.selectPlugin(pluginName));
      const li = document.createElement("li");
      const buttonPluginTooltip: any = document.createElement("yasgui-tooltip");
      buttonPluginTooltip.dataTooltip = window.innerWidth < 768 ? name : "";
      buttonPluginTooltip.placement = "top";
      buttonPluginTooltip.appendChild(button);
      li.appendChild(buttonPluginTooltip);
      this.pluginSelectorsEl.appendChild(li);
    }

    if (this.pluginSelectorsEl.children.length >= 1) this.headerEl.appendChild(this.pluginSelectorsEl);
    this.updatePluginSelectors();
  }
  private fillFallbackBox(fallbackElement?: string) {
    this.emptyFallbackElement();

    // Do not show fallback render warnings for plugins without a selector.
    if (this.plugins[fallbackElement || this.drawnPlugin || ""]?.hideFromSelection) return;

    const selectedPlugin = this.getSelectedPlugin();
    const fallbackPluginLabel =
      this.plugins[fallbackElement || this.drawnPlugin || ""]?.label || fallbackElement || this.drawnPlugin || "";
    const selectedPluginLabel = selectedPlugin?.label || this.getSelectedPluginName();
    const selectedPluginName = this.translationService.translate(
      `yasr.plugin_control.plugin.name.${selectedPluginLabel}`.toLowerCase()
    );

    const textElement = document.createElement("p");
    textElement.innerText = this.translationService.translate("yasr.fallback.box.info.info_message", [
      { key: "selectedPluginName", value: fallbackPluginLabel },
    ]);
    textElement.innerText += this.getSelectedPlugin()?.helpReference
      ? this.translationService.translate("yasr.plugin_control.info.see")
      : "";

    if (selectedPlugin?.helpReference) {
      const linkElement = document.createElement("a");
      linkElement.innerText = this.translationService.translate("yasr.plugin_control.plugin_documentation.link.label", [
        { key: "selectedPluginName", value: selectedPluginName },
      ]);
      linkElement.href = selectedPlugin.helpReference;
      linkElement.rel = "noopener noreferrer";
      linkElement.target = "_blank";
      textElement.append(linkElement);
      textElement.innerHTML += " " + this.translationService.translate("yasr.fallback.box.info.for_more_info");
    }

    this.fallbackInfoEl.appendChild(textElement);
  }
  private drawPluginElement() {
    const spaceElement = document.createElement("div");
    addClass(spaceElement, "space_element");
    this.headerEl.appendChild(spaceElement);
    this.pluginControls = document.createElement("div");
    this.pluginControls.setAttribute("id", "yasr_plugin_control");
    addClass(this.pluginControls, "yasr_plugin_control");
    this.pluginControls.setAttribute("aria-controls", this.resultsEl.id);
    this.headerEl.appendChild(this.pluginControls);
  }

  private drawHeader() {
    this.drawPluginSelectors();
    this.drawResponseInfo();
    this.drawPluginElement();
    this.drawDownloadIcon();
    this.drawDocumentationButton();
  }
  private downloadBtn: HTMLAnchorElement | undefined;
  private drawDownloadIcon() {
    this.downloadBtn = document.createElement("a");
    addClass(this.downloadBtn, "yasr_btn", "yasr_downloadIcon", "btn_icon");
    this.downloadBtn.download = ""; // should default to the file name of the blob
    this.downloadBtn.setAttribute(
      "aria-label",
      this.translationService.translate("yasr.plugin_control.download_results.btn.label")
    );
    this.downloadBtn.setAttribute("tabindex", "0"); // anchor elements with no href are not automatically included in the tabindex
    this.downloadBtn.setAttribute("role", "button");
    const iconEl = drawSvgStringAsElement(drawFontAwesomeIconAsSvg(faDownload));
    iconEl.setAttribute("aria-hidden", "true");
    this.downloadBtn.appendChild(iconEl);
    this.downloadBtn.addEventListener("click", () => {
      if (hasClass(this.downloadBtn, "disabled")) return;
      this.download();
    });
    this.downloadBtn.addEventListener("keydown", (event) => {
      // needed for accessibility
      if (event.code === "Space" || event.code === "Enter") {
        if (hasClass(this.downloadBtn, "disabled")) return;
        this.download();
      }
    });

    this.headerEl.appendChild(this.downloadBtn);
  }
  private dataElement!: HTMLDivElement;
  private drawResponseInfo() {
    this.dataElement = document.createElement("div");
    addClass(this.dataElement, "yasr_response_chip");
    this.headerEl.appendChild(this.dataElement);
    this.updateResponseInfo();
  }

  getResponseInfoElement() {
    return this.dataElement;
  }

  public updateResponseInfo() {
    let innerText = "";
    if (this.results) {
      removeClass(this.dataElement, "empty");
      const bindings = this.results.getBindings();
      if (bindings) {
        // Set amount of results
        const params = [{ key: "countResults", value: `${bindings.length}` }];
        innerText +=
          bindings.length === 1
            ? this.translationService.translate("yasr.plugin_control.info.count_result", params)
            : this.translationService.translate("yasr.plugin_control.info.count_results", params);
      }

      const responseTime = this.results.getResponseTime();
      if (responseTime) {
        if (!innerText) {
          innerText = this.translationService.translate("yasr.response");
        }
        const time = responseTime / 1000;
        const params = [{ key: "timeInSeconds", value: `${time}` }];
        innerText +=
          time === 1
            ? this.translationService.translate("yasr.plugin_control.info.result_in_second", params)
            : this.translationService.translate("yasr.plugin_control.info.result_in_seconds", params);
      }
    } else {
      addClass(this.dataElement, "empty");
    }
    this.dataElement.innerText = innerText;
  }
  private updateHelpButton() {
    const selectedPlugin = this.getSelectedPlugin();
    if (selectedPlugin?.helpReference) {
      const titleLabel = this.translationService.translate("yasr.plugin_control.plugin_documentation.link.tooltip", [
        { key: "pluginName", value: selectedPlugin.label || this.getSelectedPluginName() },
      ]);
      this.documentationLink.href = selectedPlugin.helpReference;
      this.documentationLink.title = titleLabel;
      this.documentationLink.setAttribute("aria-label", titleLabel);
      removeClass(this.documentationLink, "disabled");
    } else {
      addClass(this.documentationLink, "disabled");
      this.documentationLink.title = this.translationService.translate("yasr.plugin_control.missing_help.link.tooltip");
    }
  }

  updatePluginSelectorNames() {
    if (!this.pluginSelectorsEl) {
      return;
    }
    const pluginOrder = this.config.pluginOrder;
    for (const pluginName of pluginOrder) {
      if (!this.config.plugins[pluginName] || !this.config.plugins[pluginName].enabled) {
        continue;
      }
      const plugin = this.plugins[pluginName];
      if (plugin && !plugin.hideFromSelection) {
        let button = this.pluginSelectorsEl.querySelector(".select_" + pluginName);
        if (button) {
          const name = this.translationService.translate(
            `yasr.plugin_control.plugin.name.${plugin.label || pluginName}`.toLowerCase()
          );
          button.setAttribute(
            "aria-label",
            this.translationService.translate("yasr.plugin_control.shows_view.btn.aria_label", [
              { key: "name", value: name },
            ])
          );
          let nameEl = button.querySelector("span");
          if (nameEl) {
            nameEl.innerText = name;
          }
          const buttonPluginTooltip = button.parentElement;
          if (buttonPluginTooltip) {
            (buttonPluginTooltip as any).dataTooltip = window.innerWidth < 768 ? name : "";
          }
        }
      }
    }
  }

  updateExportHeaders() {
    if (this.downloadBtn && this.drawnPlugin) {
      this.downloadBtn.title = "";
      const plugin = this.plugins[this.drawnPlugin];
      if (plugin && plugin.download) {
        const downloadInfo = plugin.download(this.config.getDownloadFileName?.());
        removeClass(this.downloadBtn, "disabled");
        if (downloadInfo) {
          if (downloadInfo.title) this.downloadBtn.title = downloadInfo.title;
          return;
        }
      }
      this.downloadBtn.title = this.translationService.translate("yasr.plugin_control.disabled.btn.tooltip");
      addClass(this.downloadBtn, "disabled");
    }
  }

  private documentationLink!: HTMLAnchorElement;
  private drawDocumentationButton() {
    this.documentationLink = document.createElement("a");
    addClass(this.documentationLink, "yasr_btn", "yasr_external_ref_btn");
    this.documentationLink.appendChild(drawSvgStringAsElement(drawFontAwesomeIconAsSvg(faQuestionCircle)));
    this.documentationLink.href = "//triply.cc/docs/yasgui";
    this.documentationLink.target = "_blank";
    this.documentationLink.rel = "noopener noreferrer";
    this.headerEl.appendChild(this.documentationLink); // We can do this as long as the help-element is the last item in the row
  }
  download() {
    if (!this.drawnPlugin) return;
    const currentPlugin = this.plugins[this.drawnPlugin];
    if (currentPlugin && currentPlugin.download) {
      const downloadInfo = currentPlugin.download(this.config.getDownloadFileName?.());
      if (!downloadInfo) return;
      const data = downloadInfo.getData();
      let downloadUrl: string;
      if (data.startsWith("data:")) {
        downloadUrl = data;
      } else {
        const blob = new Blob([data], { type: downloadInfo.contentType ?? "text/plain" });
        downloadUrl = window.URL.createObjectURL(blob);
      }
      const mockLink = document.createElement("a");
      mockLink.href = downloadUrl;
      mockLink.download = downloadInfo.filename;
      mockLink.click();
    }
  }

  public handleLocalStorageQuotaFull(_e: any) {
    console.warn("Localstorage quota exceeded. Clearing all queries");
    Yasr.clearStorage();
  }

  public getResponseFromStorage() {
    const storageId = this.getStorageId(this.config.persistenceLabelResponse);
    if (storageId) {
      return this.storage.get(storageId);
    }
  }
  public getPersistentConfig(): PersistentConfig {
    return {
      selectedPlugin: this.getSelectedPluginName(),
      pluginsConfig: mapValues(this.config.plugins, (plugin) => plugin.dynamicConfig),
    };
  }
  //This doesnt store the plugin complete config. Only those configs we want persisted
  public storePluginConfig(pluginName: string, conf: any) {
    const plugin = this.config.plugins[pluginName];
    if (!plugin) {
      return;
    }
    plugin.dynamicConfig = conf;
    this.storeConfig();
    this.emit("change", this);
  }
  private storeConfig() {
    const storageId = this.getStorageId(this.config.persistenceLabelConfig);
    if (storageId) {
      this.storage.set(
        storageId,
        this.getPersistentConfig(),
        this.config.persistencyExpire,
        this.handleLocalStorageQuotaFull
      );
    }
  }
  private storeResponse() {
    const storageId = this.getStorageId(this.config.persistenceLabelResponse);
    if (storageId && this.results) {
      const storeObj = this.results.getAsStoreObject(this.config.maxPersistentResponseSize);
      if (storeObj && !storeObj.error) {
        this.storage.set(storageId, storeObj, this.config.persistencyExpire, this.handleLocalStorageQuotaFull);
      } else {
        //remove old string;
        this.storage.remove(storageId);
      }
    }
  }
  public setResponse(
    data: any,
    duration?: number,
    queryStartedTime?: number,
    hasMorePages?: boolean,
    possibleElementsCount?: number,
    customResultMessage?: CustomResultMessage
  ) {
    if (!data) return;
    this.results = new Parser(
      data,
      duration,
      queryStartedTime,
      hasMorePages,
      possibleElementsCount,
      customResultMessage
    );

    this.draw();

    this.storeResponse();
  }

  private initializePlugins() {
    for (const plugin in this.config.plugins) {
      if (!this.config.plugins[plugin]) continue; //falsy value, so assuming it should be disabled
      if (Yasr.plugins[plugin]) {
        this.plugins[plugin] = new (<any>Yasr.plugins[plugin])(this);
      } else {
        console.warn("Wanted to initialize plugin " + plugin + " but could not find a matching registered plugin");
      }
    }
  }

  static defaults: Config = getDefaults();
  static plugins: { [key: string]: typeof Plugin & { defaults?: any } } = {};
  static registerPlugin(name: string, plugin: typeof Plugin, enable = true) {
    Yasr.plugins[name] = plugin;
    if (enable) {
      Yasr.defaults.plugins[name] = { enabled: true };
    } else {
      Yasr.defaults.plugins[name] = { enabled: false };
    }
  }
  /**
   * Collection of Promises to load external scripts used by Yasr Plugins
   * That way, the plugins wont load similar scripts simultaneously
   */
  static Dependencies: { [name: string]: Promise<any> } = {};
  static storageNamespace = "triply";
  static clearStorage() {
    const storage = new YStorage(Yasr.storageNamespace);
    storage.removeNamespace();
  }
}

export type Prefixes = { [prefixLabel: string]: string };
export interface PluginConfig {
  dynamicConfig?: any;
  staticConfig?: any;
  enabled?: boolean;
}
export interface Config {
  tabId?: string;
  persistenceId: ((yasr: Yasr) => string) | string | null;
  persistenceLabelResponse: string;
  persistenceLabelConfig: string;
  maxPersistentResponseSize: number;
  persistencyExpire: number;
  getPlainQueryLinkToEndpoint: (() => string | undefined) | undefined;
  getDownloadFileName?: () => string | undefined;
  plugins: { [pluginName: string]: PluginConfig };
  pluginOrder: string[];
  defaultPlugin: string;

  prefixes: Prefixes | ((yasr: Yasr) => Prefixes);
  translationService: TranslationService;
  externalPluginsConfigurations?: Map<string, any>;
  yasrToolbarPlugins?: YasrToolbarPlugin[];
  downloadAsOptions?: { labelKey: string; value: any }[];

  showResultInfo: boolean;
  sparqlResponse?: string;
  /**
   * Custom renderers for errors.
   * Allow multiple to be able to add new custom renderers without having to
   * overwrite or explicitly call previously added or default ones.
   */
  errorRenderers?: ((error: Parser.ErrorSummary) => Promise<HTMLElement | undefined>)[];
}

export function registerPlugin(name: string, plugin: typeof Plugin, enable = true) {
  Yasr.plugins[name] = plugin;
  if (enable) {
    Yasr.defaults.plugins[name] = { enabled: true };
  } else {
    Yasr.defaults.plugins[name] = { enabled: false };
  }
}

import * as YasrPluginError from "./plugins/error";
import { ExtendedTable } from "./plugins/table/extended-table";
import { TranslationService } from "@triply/yasgui-utils";
import Yasqe, { CustomResultMessage } from "@triply/yasqe";
import ExtendedBoolean from "./plugins/boolean/extended-boolean";
import ExtendedResponse from "./plugins/response/extended-response";
import ExtendedError from "./plugins/error/extended-error";
import { YasrToolbarPlugin } from "./extended-yasr";

Yasr.registerPlugin("extended_boolean", ExtendedBoolean as any);
Yasr.registerPlugin("extended_response", ExtendedResponse as any);
Yasr.registerPlugin("extended_error", ExtendedError as any);
Yasr.registerPlugin("error", YasrPluginError.default as any);
Yasr.registerPlugin("extended_table", ExtendedTable as any);

export { Plugin, DownloadInfo } from "./plugins";

export default Yasr;
