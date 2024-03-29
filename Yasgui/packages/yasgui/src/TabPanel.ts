import { addClass, drawSvgStringAsElement, removeClass } from "@triply/yasgui-utils";
import "./TabPanel.scss";
import Tab from "./Tab";
import { RequestConfig } from "@triply/yasqe";
import { toPairs, fromPairs } from "lodash-es";
import { TranslationService } from "@triply/yasgui-utils";
const AcceptOptionsMap: { key: string; value: string }[] = [
  { key: "JSON", value: "application/sparql-results+json" },
  { key: "XML", value: "application/sparql-results+xml" },
  { key: "CSV", value: "text/csv" },
  { key: "TSV", value: "text/tab-separated-values" },
];
const AcceptHeaderGraphMap: { key: string; value: string }[] = [
  { key: "Turtle", value: "text/turtle" },
  { key: "JSON", value: "application/rdf+json" },
  { key: "RDF/XML", value: "application/rdf+xml" },
  { key: "TriG", value: "application/trig" },
  { key: "N-Triples", value: "application/n-triples" },
  { key: "N-Quads", value: "application/n-quads" },
  { key: "CSV", value: "text/csv" },
  { key: "TSV", value: "text/tab-separated-values" },
];
type TextInputPair = { name: string; value: string };
export default class TabPanel {
  menuElement!: HTMLElement;
  settingsButton!: HTMLButtonElement;
  tab: Tab;
  rootEl: HTMLElement;
  isOpen: boolean;

  private readonly translationService: TranslationService;
  private updateLabelFunctions: Function[] = [];

  constructor(tab: Tab, rootEl: HTMLElement, controlBarEl: HTMLElement) {
    this.tab = tab;
    this.translationService = this.tab.yasgui.translationService;
    this.rootEl = rootEl;
    this.isOpen = false;

    this.init(controlBarEl);
  }

  public update(): void {
    this.updateLabelFunctions.forEach((updateLabelFunction) => updateLabelFunction());
  }

  private init(controlBarEl: HTMLElement) {
    this.settingsButton = document.createElement("button");
    this.toggleAriaSettings();
    this.settingsButton.appendChild(this.getSettingButtonElement());
    this.updateLabelFunctions.push(this.updateSettingButtonLabel.bind(this));
    addClass(this.settingsButton, "tabContextButton");
    controlBarEl.appendChild(this.settingsButton);
    this.settingsButton.onclick = (ev) => {
      this.open(ev);
    };
    this.menuElement = document.createElement("div");
    addClass(this.menuElement, "tabMenu");
    controlBarEl.appendChild(this.menuElement);
    this.menuElement.onclick = (ev) => {
      ev.stopImmediatePropagation();
      return false;
    };
    this.drawBody();
  }

  private getSettingButtonElement(): HTMLDivElement {
    return drawSvgStringAsElement(
      `<svg width="100.06" height="100.05" data-name="Layer 1" version="1.1" viewBox="0 0 100.06 100.05" xmlns="http://www.w3.org/2000/svg" xmlns:cc="http://creativecommons.org/ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
        <metadata>
         <rdf:RDF>
          <cc:Work rdf:about="">
           <dc:format>image/svg+xml</dc:format>
           <dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage"/>
           <dc:title>${this.translationService.translate("yasgui.control_bar.settings.btn.label")}</dc:title>
          </cc:Work>
         </rdf:RDF>
        </metadata>
        <title>${this.translationService.translate("yasgui.control_bar.settings.btn.label")}</title>
        <path d="m95.868 58.018-3-3.24a42.5 42.5 0 0 0 0-9.43l3-3.22c1.79-1.91 5-4.44 4-6.85l-4.11-10c-1-2.41-5.08-1.91-7.69-2l-4.43-0.16a43.24 43.24 0 0 0-6.64-6.66l-0.14-4.43c-0.08-2.6 0.43-6.69-2-7.69l-10-4.15c-2.4-1-4.95 2.25-6.85 4l-3.23 3a42.49 42.49 0 0 0-9.44 0l-3.21-3c-1.9-1.78-4.44-5-6.85-4l-10 4.11c-2.41 1-1.9 5.09-2 7.69l-0.16 4.42a43.24 43.24 0 0 0-6.67 6.65l-4.42 0.14c-2.6 0.08-6.69-0.43-7.69 2l-4.15 10c-1 2.4 2.25 4.94 4 6.84l3 3.23a42.49 42.49 0 0 0 0 9.44l-3 3.22c-1.78 1.9-5 4.43-4 6.84l4.11 10c1 2.41 5.09 1.91 7.7 2l4.41 0.15a43.24 43.24 0 0 0 6.66 6.68l0.13 4.41c0.08 2.6-0.43 6.7 2 7.7l10 4.15c2.4 1 4.94-2.25 6.84-4l3.24-3a42.5 42.5 0 0 0 9.42 0l3.22 3c1.91 1.79 4.43 5 6.84 4l10-4.11c2.41-1 1.91-5.08 2-7.7l0.15-4.42a43.24 43.24 0 0 0 6.68-6.65l4.42-0.14c2.6-0.08 6.7 0.43 7.7-2l4.15-10c1.04-2.36-2.22-4.9-3.99-6.82zm-45.74 15.7c-12.66 0-22.91-10.61-22.91-23.7s10.25-23.7 22.91-23.7 22.91 10.61 22.91 23.7-10.25 23.7-22.91 23.7z"/>
       </svg>`
    );
  }
  private updateBody() {
    const reqConfig = this.tab.getRequestConfig();
    if (typeof reqConfig.method !== "function") {
      this.setRequestMethod(reqConfig.method);
    }

    // Draw Accept headers
    this.setAcceptHeader_select(<string>reqConfig.acceptHeaderSelect);
    this.setAcceptHeader_graph(<string>reqConfig.acceptHeaderGraph);
    // console.log('setting args',reqConfig.args)
    if (typeof reqConfig.args !== "function") {
      this.setArguments([...reqConfig.args] || []);
    }

    if (typeof reqConfig.headers !== "function") {
      this.setHeaders(toPairs(reqConfig.headers).map(([name, value]) => ({ name, value })));
    }
    if (typeof reqConfig.defaultGraphs !== "function") {
      this.setDefaultGraphs([...reqConfig.defaultGraphs] || []);
    }
    if (typeof reqConfig.namedGraphs !== "function") {
      this.setNamedGraphs([...reqConfig.namedGraphs] || []);
    }
  }

  public open(ev: MouseEvent) {
    if (!this.isOpen) {
      this.updateBody();
      this.isOpen = true;
      addClass(this.menuElement, "open");
      this.toggleAriaSettings();
      const handleClick = (ev: MouseEvent) => {
        // Stops propagation in IE11
        let parent = <HTMLElement>ev.target;
        while (!!(window as any).MSInputMethodContext && !!(document as any).documentMode && parent.parentElement) {
          if (parent.className.indexOf("tabMenu") !== -1) {
            return false;
          }
          parent = parent.parentElement;
        }
        this.close(ev);
        document.removeEventListener("click", handleClick, true);
        return false;
      };
      document.addEventListener("click", handleClick, { once: true });
      ev.stopImmediatePropagation();
    }
  }
  public close(_event?: MouseEvent) {
    if (this.isOpen) {
      this.isOpen = false;
      removeClass(this.menuElement, "open");
      this.toggleAriaSettings();
    }
  }
  private toggleAriaSettings() {
    this.settingsButton.setAttribute(
      "aria-label",
      this.isOpen
        ? this.translationService.translate("yasgui.control_bar.settings.btn.close_settings.aria_label")
        : this.translationService.translate("yasgui.control_bar.settings.btn.open_settings.aria_label")
    );
    this.settingsButton.setAttribute("aria-expanded", `${this.isOpen}`);
  }
  private setRequestMethod!: (method: Exclude<RequestConfig<any>["method"], Function>) => void;

  private drawRequestMethodSelector() {
    const requestTypeWrapper = document.createElement("div");
    addClass(requestTypeWrapper, "requestConfigWrapper");
    const requestTypeLabel = createLabel(
      this.translationService.translate("yasgui.control_bar.request_method.label"),
      requestTypeWrapper
    );
    this.updateLabelFunctions.push(
      () => (requestTypeLabel.innerText = this.translationService.translate("yasgui.control_bar.request_method.label"))
    );

    // Create Button
    const getButton = document.createElement("button");
    addClass(getButton, "selectorButton", "selectorGetButton");
    getButton.innerText = this.translationService.translate("yasgui.control_bar.get.btn.label");
    this.updateLabelFunctions.push(
      () => (getButton.innerText = this.translationService.translate("yasgui.control_bar.get.btn.label"))
    );
    const postButton = document.createElement("button");
    addClass(postButton, "selectorButton", "selectorPostButton");
    postButton.innerText = this.translationService.translate("yasgui.control_bar.post.btn.label");
    this.updateLabelFunctions.push(
      () => (postButton.innerText = this.translationService.translate("yasgui.control_bar.get.btn.label"))
    );
    addClass(this.tab.getRequestConfig().method === "GET" ? getButton : postButton, "selected");

    this.setRequestMethod = (method) => {
      if (method === "GET") {
        addClass(getButton, "selected");
        removeClass(postButton, "selected");
      } else if (method === "POST") {
        addClass(postButton, "selected");
        removeClass(getButton, "selected");
      }
    };
    getButton.onclick = () => {
      this.tab.setRequestConfig({ method: "GET" });
      this.setRequestMethod("GET");
    };
    postButton.onclick = () => {
      this.tab.setRequestConfig({ method: "POST" });
      this.setRequestMethod("POST");
    };

    // Add elements to container
    requestTypeWrapper.appendChild(getButton);
    requestTypeWrapper.appendChild(postButton);
    this.menuElement.appendChild(requestTypeWrapper);
  }

  private setAcceptHeader_select!: (acceptheader: string) => void;
  private setAcceptHeader_graph!: (acceptheader: string) => void;
  private drawAcceptSelector() {
    const acceptWrapper = document.createElement("div");
    addClass(acceptWrapper, "requestConfigWrapper", "acceptWrapper");
    const acceptWrapperLabel = createLabel(
      this.translationService.translate("yasgui.control_bar.accept_headers.label"),
      acceptWrapper
    );
    this.updateLabelFunctions.push(
      () =>
        (acceptWrapperLabel.innerText = this.translationService.translate("yasgui.control_bar.accept_headers.label"))
    );

    const registerUpdateLabelFunction = (labelElement: HTMLElement, labelKey: string) => {
      this.updateLabelFunctions.push(() => (labelElement.innerText = this.translationService.translate(labelKey)));
    };

    // Request type
    this.setAcceptHeader_select = createSelector(
      AcceptOptionsMap,
      (ev) => {
        this.tab.setRequestConfig({ acceptHeaderSelect: (<HTMLOptionElement>ev.target).value });
      },
      "yasgui.control_bar.ask_select.label",
      acceptWrapper,
      this.translationService,
      registerUpdateLabelFunction
    );

    this.setAcceptHeader_graph = createSelector(
      AcceptHeaderGraphMap,
      (ev) => {
        this.tab.setRequestConfig({ acceptHeaderGraph: (<HTMLOptionElement>ev.target).value });
      },
      "yasgui.control_bar.construct_describe.label",
      acceptWrapper,
      this.translationService,
      registerUpdateLabelFunction
    );

    this.menuElement.appendChild(acceptWrapper);
  }

  private setArguments!: (args: TextInputPair[]) => void;
  private drawArgumentsInput() {
    const onBlur = () => {
      const args: Exclude<RequestConfig<any>["args"], Function> = [];
      argumentsWrapper.querySelectorAll(".textRow").forEach((row) => {
        const [name, value] = row.children;
        if (name instanceof HTMLInputElement && value instanceof HTMLInputElement && name.value.length) {
          args.push({ name: name.value, value: value.value });
        }
      });
      this.tab.setRequestConfig({ args: args });
    };
    const argumentsWrapper = document.createElement("div");
    addClass(argumentsWrapper, "requestConfigWrapper", "textSetting");

    const argumentsLabel = createLabel(
      this.translationService.translate("yasgui.control_bar.arguments.label"),
      argumentsWrapper
    );
    this.updateLabelFunctions.push(
      () => (argumentsLabel.innerText = this.translationService.translate("yasgui.control_bar.arguments.label"))
    );

    this.menuElement.appendChild(argumentsWrapper);

    this.setArguments = (args) => {
      argumentsWrapper.querySelectorAll(".textRow").forEach((child) => {
        argumentsWrapper.removeChild(child);
      });
      // Draw the arguments
      for (let argIndex = 0; argIndex < args.length; argIndex++) {
        const argRow = drawDoubleInputWhenEmpty(argumentsWrapper, argIndex, args, onBlur);
        getRemoveButton(() => {
          args.splice(argIndex, 1);
          this.tab.setRequestConfig({ args: args });
          this.setArguments(args);
        }, argRow);
      }
      drawDoubleInput(argumentsWrapper, args, onBlur);
    };
  }

  private setHeaders!: (headers: TextInputPair[]) => void;
  private drawHeaderInput() {
    const onBlur = () => {
      const headers: Exclude<RequestConfig<any>["headers"], Function> = {};
      headerWrapper.querySelectorAll(".textRow").forEach((row) => {
        const [name, value] = row.children;
        if (name instanceof HTMLInputElement && value instanceof HTMLInputElement && name.value.length) {
          headers[name.value] = value.value;
        }
      });
      this.tab.setRequestConfig({ headers: headers });
    };
    const headerWrapper = document.createElement("div");
    addClass(headerWrapper, "requestConfigWrapper", "textSetting");

    const URLArgLabel = createLabel(this.translationService.translate("yasgui.control_bar.header_arguments.label"));
    this.updateLabelFunctions.push(
      () => (URLArgLabel.innerText = this.translationService.translate("yasgui.control_bar.header_arguments.label"))
    );
    headerWrapper.appendChild(URLArgLabel);

    this.menuElement.appendChild(headerWrapper);

    this.setHeaders = (headers) => {
      headerWrapper.querySelectorAll(".textRow").forEach((child) => {
        headerWrapper.removeChild(child);
      });
      // Draw the headers;
      for (let headerIndex = 0; headerIndex < headers.length; headerIndex++) {
        const headerRow = drawDoubleInputWhenEmpty(headerWrapper, headerIndex, headers, onBlur);
        // getRemoveButton(() => (headers[headerIndex] = undefined), headerRow);
        getRemoveButton(() => {
          headers.splice(headerIndex, 1);
          this.tab.setRequestConfig({ headers: fromPairs(headers.map((h) => [h.name, h.value])) });
          this.setHeaders(headers);
        }, headerRow);
      }
      drawDoubleInput(headerWrapper, headers, onBlur);
    };
  }

  private setDefaultGraphs!: (defaultGraphs: Array<string | undefined>) => void;
  private drawDefaultGraphInput() {
    const defaultGraphWrapper = document.createElement("div");
    addClass(defaultGraphWrapper, "requestConfigWrapper", "textSetting");

    const defaultGraphLabel = createLabel(this.translationService.translate("yasgui.control_bar.default_graphs.label"));
    this.updateLabelFunctions.push(
      () => (defaultGraphLabel.innerText = this.translationService.translate("yasgui.control_bar.default_graphs.label"))
    );
    defaultGraphWrapper.appendChild(defaultGraphLabel);

    this.menuElement.appendChild(defaultGraphWrapper);

    const onBlur = () => {
      const graphs: Exclude<RequestConfig<any>["defaultGraphs"], Function> = [];
      defaultGraphWrapper.querySelectorAll(".graphInput").forEach((row) => {
        const [el] = row.children;
        if (el instanceof HTMLInputElement && el.value.length) {
          graphs.push(el.value);
        }
      });
      this.tab.setRequestConfig({ defaultGraphs: graphs });
    };
    this.setDefaultGraphs = (defaultGraphs) => {
      defaultGraphWrapper.querySelectorAll(".graphInput").forEach((child) => {
        defaultGraphWrapper.removeChild(child);
      });
      for (let graphIndex = 0; graphIndex < defaultGraphs.length; graphIndex++) {
        const graphDiv = drawSingleInputWhenEmpty(defaultGraphWrapper, graphIndex, defaultGraphs, onBlur);
        getRemoveButton(() => (defaultGraphs[graphIndex] = undefined), graphDiv);
      }
      drawSingleInput(defaultGraphWrapper, defaultGraphs, onBlur);
    };
  }

  private setNamedGraphs!: (defaultGraphs: Array<string | undefined>) => void;
  private drawNamedGraphInput() {
    const namedGraphWrapper = document.createElement("div");
    addClass(namedGraphWrapper, "requestConfigWrapper", "textSetting");

    const namedGraphLabel = createLabel(this.translationService.translate("yasgui.control_bar.named_graph.label"));
    this.updateLabelFunctions.push(
      () => (namedGraphLabel.innerText = this.translationService.translate("yasgui.control_bar.named_graph.label"))
    );
    namedGraphWrapper.appendChild(namedGraphLabel);
    this.menuElement.appendChild(namedGraphWrapper);

    const onBlur = () => {
      const graphs: Exclude<RequestConfig<any>["namedGraphs"], Function> = [];
      namedGraphWrapper.querySelectorAll(".graphInput").forEach((row) => {
        const [el] = row.children;
        if (el instanceof HTMLInputElement && el.value.length) {
          graphs.push(el.value);
        }
      });
      this.tab.setRequestConfig({ namedGraphs: graphs });
    };

    this.setNamedGraphs = (namedGraphs) => {
      namedGraphWrapper.querySelectorAll(".graphInput").forEach((child) => {
        namedGraphWrapper.removeChild(child);
      });
      // Draw default graphs
      for (let graphIndex = 0; graphIndex < namedGraphs.length; graphIndex++) {
        const graphDiv = drawSingleInputWhenEmpty(namedGraphWrapper, graphIndex, namedGraphs, onBlur);
        getRemoveButton(() => (namedGraphs[graphIndex] = undefined), graphDiv);
      }
      drawSingleInput(namedGraphWrapper, namedGraphs, onBlur);
    };
  }

  private drawBody() {
    // Draw request Method
    this.drawRequestMethodSelector();

    // Draw Accept headers
    this.drawAcceptSelector();

    // Draw URL Arguments
    this.drawArgumentsInput();

    // Draw HTTP Header body
    this.drawHeaderInput();

    // Default graphs
    this.drawDefaultGraphInput();

    // Named graphs
    this.drawNamedGraphInput();
  }

  public destroy() {
    this.settingsButton.onclick = null;
    this.menuElement.onclick = null;
    while (this.menuElement.firstChild) this.menuElement.firstChild.remove();
    this.menuElement.remove();
    this.updateLabelFunctions = [];
  }
  private updateSettingButtonLabel() {
    while (this.settingsButton.firstChild) {
      this.settingsButton.removeChild(this.settingsButton.firstChild);
    }
    this.settingsButton.appendChild(this.getSettingButtonElement());
    this.toggleAriaSettings();
  }
}

/**
 * This function returns a setter so we can easily set a new value
 */
function createSelector(
  options: { key: string; value: string }[],
  changeHandler: (event: Event) => void,
  labelKey: string,
  parent: HTMLElement,
  translationService: TranslationService,
  registerUpdateLabelFunction: (labelElement: HTMLElement, labelKey: string) => void
): (selected: string) => void {
  const selectorWrapper = document.createElement("div");
  addClass(selectorWrapper, "selector");

  const selectorLabel = createLabel(translationService.translate(labelKey), selectorWrapper);
  registerUpdateLabelFunction(selectorLabel, labelKey);
  addClass(selectorLabel, "selectorLabel");

  const selectElement = document.createElement("select");
  selectElement.onchange = changeHandler;
  selectorWrapper.appendChild(selectElement);
  const optionEls = options.map((o) => createOption(o, selectElement));
  parent.appendChild(selectorWrapper);
  return (selected) => {
    if (typeof selected === "string") {
      for (const optionEl of optionEls) {
        optionEl.selected = optionEl.value === selected;
      }
    }
  };
}

function getInputValues(div: HTMLElement) {
  const values = [];
  for (const child of div.getElementsByTagName("input")) {
    values.push(child.value);
  }
  return values;
}

function createLabel(content: string, parent?: HTMLElement) {
  const label = document.createElement("label");
  addClass(label, "label");
  label.innerText = content;
  if (parent) parent.appendChild(label);
  return label;
}

function createOption(content: { key: string; value: string }, parent: HTMLElement) {
  const option = document.createElement("option");
  option.textContent = content.key;
  option.value = content.value;
  parent.appendChild(option);
  return option;
}

function createInput(content: string, parent?: HTMLElement) {
  const input = document.createElement("input");
  input.type = "text";
  input.value = content ? content : "";
  if (parent) parent.appendChild(input);
  return input;
}
function getRemoveButton(deleteAction: () => void, parent?: HTMLElement) {
  const button = document.createElement("button");
  button.textContent = "X";
  addClass(button, "removeButton");
  if (parent) parent.appendChild(button);
  button.onclick = (ev) => {
    deleteAction();
    (<HTMLButtonElement>ev.target).parentElement?.remove();
  };
  return button;
}
function drawSingleInput(root: HTMLElement, content: Array<string | undefined>, onBlur: () => void) {
  const lastRow: HTMLDivElement | null = root.querySelector(".graphInput:last-of-type");
  if (!lastRow || getInputValues(lastRow)[0] !== "" || lastRow.getElementsByTagName("button").length !== 0) {
    const index = content.length;
    drawSingleInputWhenEmpty(root, index, content, onBlur);
    if (lastRow && lastRow.getElementsByTagName("button").length === 0) {
      getRemoveButton(() => (content[index - 1] = undefined), lastRow);
    }
  }
}
function drawSingleInputWhenEmpty(
  root: HTMLElement,
  index: number,
  content: Array<string | undefined>,
  onBlur: () => void
) {
  const namedGraphItem = document.createElement("div");
  addClass(namedGraphItem, "graphInput");
  const namedGraphInput = createInput(content[index] || "", namedGraphItem);
  namedGraphInput.onkeyup = (ev) => {
    const target = <HTMLInputElement>ev.target;
    content[index] ? (content[index] = target.value) : content.push(target.value);
    drawSingleInput(root, content, onBlur);
  };
  namedGraphItem.onblur = onBlur;
  root.appendChild(namedGraphItem);
  return namedGraphItem;
}

function drawDoubleInput(root: HTMLElement, content: Array<TextInputPair | undefined>, onBlur: () => void) {
  const lastRow: HTMLDivElement | null = root.querySelector(".textRow:last-of-type");
  // When there are no row's or the last row has values,
  if (!lastRow || getInputValues(lastRow).filter((value) => value).length !== 0) {
    const index = content.length;
    drawDoubleInputWhenEmpty(root, index, content, onBlur);
    // If there is a last row and the button is not already there
    if (lastRow && lastRow.getElementsByTagName("button").length === 0) {
      getRemoveButton(() => (content[index - 1] = undefined), lastRow);
    }
  }
}
function drawDoubleInputWhenEmpty(
  root: HTMLElement,
  index: number,
  content: Array<TextInputPair | undefined>,
  onBlur: () => void
) {
  const kvInput = document.createElement("div");
  addClass(kvInput, "textRow");
  const value = content[index];
  const nameField = createInput(value ? value.name : "", kvInput);
  const valueField = createInput(value ? value.value : "", kvInput);
  nameField.onkeyup = (ev) => {
    const val = content[index];
    val
      ? (val.name = (<HTMLInputElement>ev.target).value)
      : content.push({ name: (<HTMLInputElement>ev.target).value, value: "" });
    drawDoubleInput(root, content, onBlur);
  };
  nameField.onblur = onBlur;
  valueField.onkeyup = (ev) => {
    const val = content[index];
    val
      ? (val.value = (<HTMLInputElement>ev.target).value)
      : content.push({ value: (<HTMLInputElement>ev.target).value, name: "" });
    drawDoubleInput(root, content, onBlur);
  };
  valueField.onblur = onBlur;
  root.appendChild(kvInput);
  return kvInput;
}
