/**
 * Make sure not to include any deps from our main index file. That way, we can easily publish the plugin as standalone build
 */
import { TranslationService } from "@triply/yasgui-utils";

require("./index.scss");
require("datatables.net-dt/css/jquery.dataTables.css");
require("datatables.net");
//@ts-ignore (jquery _does_ expose a default. In es6, it's the one we should use)
import $ from "jquery";
import Parser from "../../parsers";
import { escape } from "lodash-es";
import { Plugin, DownloadInfo } from "../";
import Yasr from "../../";
import { drawSvgStringAsElement, drawFontAwesomeIconAsSvg, addClass, removeClass } from "@triply/yasgui-utils";
import * as faTableIcon from "@fortawesome/free-solid-svg-icons/faTable";
import { DeepReadonly } from "ts-essentials";
import { cloneDeep } from "lodash-es";

const ColumnResizer = require("column-resizer");
export const DEFAULT_PAGE_SIZE = 50;

export interface PluginConfig {
  openIriInNewWindow: boolean;
  tableConfig: DataTables.Settings;
  maxResizableResultsColumns: number;
}

export interface PersistentConfig {
  pageSize?: number;
  compact?: boolean;
  isEllipsed?: boolean;
}

type DataRow = [number, ...(Parser.BindingValue | "")[]];

function expand(this: HTMLDivElement, event: MouseEvent) {
  addClass(this, "expanded");
  event.preventDefault();
}

export default class Table implements Plugin<PluginConfig> {
  protected config: DeepReadonly<PluginConfig>;
  protected persistentConfig: PersistentConfig = {};
  protected yasr: Yasr;
  private tableControls: Element | undefined;
  protected tableEl: HTMLTableElement | undefined;
  protected dataTable: DataTables.Api | undefined;
  private tableFilterField: HTMLInputElement | undefined;
  private tableSizeField: HTMLSelectElement | undefined;
  private tableCompactSwitch: HTMLInputElement | undefined;
  private tableEllipseSwitch: HTMLInputElement | undefined;
  protected tableResizer:
    | {
        reset: (options: {
          disable: boolean;
          onResize?: () => void;
          partialRefresh?: boolean;
          headerOnly?: boolean;
          disabledColumns?: number[];
        }) => void;
        onResize: () => {};
      }
    | undefined;
  public helpReference = "https://triply.cc/docs/yasgui#table";
  public label = "Table";
  public priority = 10;
  protected readonly translationService: TranslationService;
  public getIcon() {
    return drawSvgStringAsElement(drawFontAwesomeIconAsSvg(faTableIcon));
  }
  constructor(yasr: Yasr) {
    this.yasr = yasr;
    //TODO read options from constructor
    this.translationService = this.yasr.config.translationService;
    this.config = { ...Table.defaults, maxResizableResultsColumns: this.getMaxResizibleColumns() };
  }
  public static defaults: PluginConfig = {
    openIriInNewWindow: true,
    maxResizableResultsColumns: 19,
    tableConfig: {
      dom: "tip", //  tip: Table, Page Information and Pager, change to ipt for showing pagination on top
      pageLength: DEFAULT_PAGE_SIZE, //default page length
      lengthChange: true, //allow changing page length
      data: [],
      columns: [],
      order: [],
      deferRender: true,
      orderClasses: false,
      language: {
        paginate: {
          first: "&lt;&lt;", // Have to specify these two due to TS defs, <<
          last: "&gt;&gt;", // Have to specify these two due to TS defs, >>
          next: "&gt;", // >
          previous: "&lt;", // <
        },
      },
    },
  };
  protected getRows(): DataRow[] {
    if (!this.yasr.results) return [];
    const bindings = this.yasr.results.getBindings();
    if (!bindings) return [];
    // Vars decide the columns
    const vars = this.yasr.results.getVariables();
    // Use "" as the empty value, undefined will throw runtime errors
    return bindings.map((binding, rowId) => [rowId + 1, ...vars.map((variable) => binding[variable] ?? "")]);
  }

  private getUriLinkFromBinding(binding: Parser.BindingValue, prefixes?: { [key: string]: string }) {
    const href = binding.value;
    let visibleString = href;
    let prefixed = false;
    if (prefixes) {
      for (const prefixLabel in prefixes) {
        if (visibleString.indexOf(prefixes[prefixLabel]) == 0) {
          visibleString = prefixLabel + ":" + href.substring(prefixes[prefixLabel].length);
          prefixed = true;
          break;
        }
      }
    }
    // Hide brackets when prefixed or compact
    const hideBrackets = prefixed || this.persistentConfig.compact;
    return `${hideBrackets ? "" : "&lt;"}<a class='iri' target='${
      this.config.openIriInNewWindow ? "_blank" : "_self"
    }'${this.config.openIriInNewWindow ? " ref='noopener noreferrer'" : ""} href='${href}'>${visibleString}</a>${
      hideBrackets ? "" : "&gt;"
    }`;
  }
  protected getCellContent(binding: Parser.BindingValue, prefixes?: { [label: string]: string }): string {
    let content: string;
    if (binding.type == "uri") {
      content = `<span>${this.getUriLinkFromBinding(binding, prefixes)}</span>`;
    } else {
      content = `<span class='nonIri'>${this.formatLiteral(binding, prefixes)}</span>`;
    }

    return `<div>${content}</div>`;
  }
  private formatLiteral(literalBinding: Parser.BindingValue, prefixes?: { [key: string]: string }) {
    let stringRepresentation = escape(literalBinding.value);
    // Return now when in compact mode.
    if (this.persistentConfig.compact) return stringRepresentation;

    if (literalBinding["xml:lang"]) {
      stringRepresentation = `"${stringRepresentation}"<sup>@${literalBinding["xml:lang"]}</sup>`;
    } else if (literalBinding.datatype) {
      const dataType = this.getUriLinkFromBinding({ type: "uri", value: literalBinding.datatype }, prefixes);
      stringRepresentation = `"${stringRepresentation}"<sup>^^${dataType}</sup>`;
    }
    return stringRepresentation;
  }

  protected getColumns(): DataTables.ColumnSettings[] {
    if (!this.yasr.results) return [];
    const prefixes = this.yasr.getPrefixes();

    return [
      {
        name: "",
        searchable: false,
        width: `${this.getSizeFirstColumn()}px`,
        type: "num",
        orderable: false,
        visible: this.persistentConfig.compact !== true,
        render: (data: number, type: any) =>
          type === "filter" || type === "sort" || !type ? data : `<div class="rowNumber">${data}</div>`,
      }, //prepend with row numbers column
      ...this.yasr.results?.getVariables().map((name) => {
        return <DataTables.ColumnSettings>{
          name: name,
          title: name,
          render: (data: Parser.BindingValue | "", type: any, _row: any, _meta: DataTables.CellMetaSettings) => {
            // Handle empty rows
            if (data === "") return data;
            if (type === "filter" || type === "sort" || !type) return data.value;
            return this.getCellContent(data, prefixes);
          },
        };
      }),
    ];
  }
  protected getSizeFirstColumn() {
    const numResults = this.yasr.results?.getBindings()?.length || 0;
    return numResults.toString().length * 8;
  }

  getTableElement() {
    return this.tableEl;
  }

  public draw(persistentConfig: PersistentConfig) {
    this.persistentConfig = { ...this.persistentConfig, ...persistentConfig };
    this.tableEl = document.createElement("table");
    const rows = this.getRows();
    const columns = this.getColumns();

    if (rows.length <= (persistentConfig?.pageSize || DEFAULT_PAGE_SIZE)) {
      this.yasr.pluginControls;
      addClass(this.yasr.rootEl, "isSinglePage");
    } else {
      removeClass(this.yasr.rootEl, "isSinglePage");
    }

    if (this.dataTable) {
      this.destroyResizer();

      this.dataTable.destroy(true);
      this.dataTable = undefined;
    }
    this.yasr.resultsEl.appendChild(this.tableEl);
    // reset some default config properties as they couldn't be initialized beforehand
    const dtConfig: DataTables.Settings = {
      ...((cloneDeep(this.config.tableConfig) as unknown) as DataTables.Settings),
      pageLength: -1,
      data: rows,
      columns: columns,
      // DataTables will only render the rows that are initially visible on the page.
      deferRender: true,
      // // Switch off the pagination.
      paging: false,
      // Switched off for optimization purposes.
      // Our cells are calculated dynamically, and with this configuration on, rendering the datatable results becomes very slow.
      autoWidth: false,
      language: {
        zeroRecords: this.translationService.translate("yasr.plugin_control.table.empty_result.label"),
        info: this.translationService.translate("yasr.plugin.table.data_tables.info.result_info"),
        paginate: {
          first: this.translationService.translate("yasr.plugin.table.data_tables.paginate.first"),
          last: this.translationService.translate("yasr.plugin.table.data_tables.paginate.last"),
          next: this.translationService.translate("yasr.plugin.table.data_tables.paginate.next"),
          previous: this.translationService.translate("yasr.plugin.table.data_tables.paginate.previous"),
        },
      },
    };
    this.dataTable = $(this.tableEl).DataTable(dtConfig);
    this.tableEl.style.removeProperty("width");
    this.tableEl.style.width = this.tableEl.clientWidth + "px";

    // If it is a compact view, the first column (row number column) is not visible, we decrease the maximum resizable columns.
    const maxResizableResultsColumns = this.persistentConfig.compact
      ? this.config.maxResizableResultsColumns - 1
      : this.config.maxResizableResultsColumns;

    if (columns.length <= maxResizableResultsColumns) {
      // There is an issue with columns resizing. When the table is rendered the columns resizing doesn't working until a column header is clicked.
      // A possible reason could be that the table columns have not been fully rendered before the table resizer initialized.
      // The timeout will ensure that the rendering of the table resizer occurs after the table is rendered.
      setTimeout(() => {
        this.tableResizer = new ColumnResizer.default(this.tableEl, {
          partialRefresh: true,
          onResize: this.persistentConfig.isEllipsed !== false && this.setEllipsisHandlers,
          headerOnly: false,
          disabledColumns: this.persistentConfig.compact ? [] : [0],
        });
      }, 0);
    } else {
      addClass(this.tableEl, "fixedColumns");
    }
    // DataTables uses the rendered style to decide the widths of columns.
    // Before a draw remove the ellipseTable styling
    if (this.persistentConfig.isEllipsed !== false) {
      this.dataTable?.on("preDraw", () => {
        this.tableResizer?.reset({ disable: true });
        removeClass(this.tableEl, "ellipseTable");
        this.tableEl?.style.removeProperty("width");
        this.tableEl?.style.setProperty("width", this.tableEl.clientWidth + "px");
        return true; // Indicate it should re-render
      });
      // After a draw
      this.dataTable?.on("draw", () => {
        if (!this.tableEl) return;
        // Width of table after render, removing width will make it fall back to 100%
        let targetSize = this.tableEl.clientWidth;
        this.tableEl.style.removeProperty("width");
        // Let's make sure the new size is not bigger
        if (targetSize > this.tableEl.clientWidth) targetSize = this.tableEl.clientWidth;
        this.tableEl?.style.setProperty("width", `${targetSize}px`);
        // Enable the re-sizer
        this.tableResizer?.reset({
          disable: false,
          partialRefresh: true,
          onResize: this.setEllipsisHandlers,
          headerOnly: false,
          disabledColumns: this.persistentConfig.compact ? [] : [0],
        });
        // Re-add the ellipsis
        addClass(this.tableEl, "ellipseTable");
        // Check if cells need the ellipsisHandlers
        this.setEllipsisHandlers();
      });
    }

    this.drawControls();
    // Draw again but with the events
    if (this.persistentConfig.isEllipsed !== false) {
      addClass(this.tableEl, "ellipseTable");
      this.setEllipsisHandlers();
    }

    if (!rows || rows.length < 1) {
      this.updateEmptyTable(this.persistentConfig);
    }

    // if (this.tableEl.clientWidth > width) this.tableEl.parentElement?.style.setProperty("overflow", "hidden");
  }

  protected updateEmptyTable(persistentConfig: PersistentConfig): void {
    const element: HTMLTableCellElement | null | undefined = this.tableEl?.querySelector("td.dataTables_empty");
    if (element) {
      const columns = this.dataTable?.columns().count();
      const columnCount = columns || 0;
      element.colSpan = persistentConfig.compact ? columnCount - 1 : columnCount;
    }
    if (this.tableFilterField) {
      this.tableFilterField.disabled = true;
    }
    if (this.tableCompactSwitch) {
      this.tableCompactSwitch.disabled = true;
    }
    if (this.tableEllipseSwitch) {
      this.tableEllipseSwitch.disabled = true;
    }
  }

  private setEllipsisHandlers = () => {
    this.dataTable?.cells({ page: "current" }).every((rowIdx, colIdx) => {
      const cell = this.dataTable?.cell(rowIdx, colIdx);
      if (cell?.data() === "") return;
      const cellNode = cell?.node() as HTMLTableCellElement;
      if (cellNode) {
        const content = cellNode.firstChild as HTMLDivElement;
        if ((content.firstElementChild?.getBoundingClientRect().width || 0) > content.getBoundingClientRect().width) {
          if (!content.classList.contains("expandable")) {
            addClass(content, "expandable");
            content.addEventListener("click", expand, { once: true });
          }
        } else {
          if (content.classList.contains("expandable")) {
            removeClass(content, "expandable");
            content.removeEventListener("click", expand);
          }
        }
      }
    });
  };
  private handleTableSearch = (event: KeyboardEvent) => {
    this.dataTable?.search((event.target as HTMLInputElement).value).draw("page");
  };
  protected handleTableSizeSelect = (event: Event) => {
    const pageLength = parseInt((event.target as HTMLSelectElement).value);
    // Set page length
    this.dataTable?.page.len(pageLength).draw("page");
    // Store in persistentConfig
    this.persistentConfig.pageSize = pageLength;
    this.yasr.storePluginConfig("table", this.persistentConfig);
  };
  protected handleSetCompactToggle = (event: Event) => {
    // Store in persistentConfig
    this.persistentConfig.compact = (event.target as HTMLInputElement).checked;
    // Update the table
    this.draw(this.persistentConfig);
    this.yasr.storePluginConfig("table", this.persistentConfig);
  };
  protected handleSetEllipsisToggle = (event: Event) => {
    // Store in persistentConfig
    this.persistentConfig.isEllipsed = (event.target as HTMLInputElement).checked;
    // Update the table
    this.draw(this.persistentConfig);
    this.yasr.storePluginConfig("table", this.persistentConfig);
  };
  /**
   * Draws controls on each update
   */
  drawControls() {
    // Remove old header
    this.removeControls();
    this.tableControls = document.createElement("div");
    this.tableControls.className = "tableControls";

    // Create table filter
    this.tableFilterField = document.createElement("input");
    this.tableFilterField.className = "tableFilter";
    let filterQueryLabel = this.translationService.translate("yasr.plugin.table.table_filter.input.placeholder");
    this.tableFilterField.placeholder = filterQueryLabel;
    this.tableFilterField.setAttribute("aria-label", filterQueryLabel);
    this.tableControls.appendChild(this.tableFilterField);
    this.tableFilterField.addEventListener("keyup", this.handleTableSearch);

    // Ellipsis switch
    const ellipseToggleWrapper = document.createElement("div");
    const ellipseSwitchComponent = document.createElement("label");
    const ellipseTextComponent = document.createElement("span");
    ellipseTextComponent.innerText = this.translationService.translate("yasr.plugin.table.ellipse.checkbox.label");
    addClass(ellipseTextComponent, "label");
    ellipseSwitchComponent.appendChild(ellipseTextComponent);
    addClass(ellipseSwitchComponent, "switch");
    ellipseToggleWrapper.appendChild(ellipseSwitchComponent);
    this.tableEllipseSwitch = document.createElement("input");
    ellipseSwitchComponent.addEventListener("change", this.handleSetEllipsisToggle);
    this.tableEllipseSwitch.type = "checkbox";
    ellipseSwitchComponent.appendChild(this.tableEllipseSwitch);
    // isEllipsed should be unchecked by default
    this.tableEllipseSwitch.defaultChecked =
      this.persistentConfig.isEllipsed !== undefined ? this.persistentConfig.isEllipsed : false;
    this.tableControls.appendChild(ellipseToggleWrapper);

    // Compact switch
    const toggleWrapper = document.createElement("div");
    const switchComponent = document.createElement("label");
    const textComponent = document.createElement("span");
    textComponent.innerText = this.translationService.translate("yasr.plugin.table.simple_view.checkbox.label");
    addClass(textComponent, "label");
    switchComponent.appendChild(textComponent);
    addClass(switchComponent, "switch");
    toggleWrapper.appendChild(switchComponent);
    this.tableCompactSwitch = document.createElement("input");
    switchComponent.addEventListener("change", this.handleSetCompactToggle);
    addClass(this.tableCompactSwitch, "row-number-switch");
    this.tableCompactSwitch.type = "checkbox";
    switchComponent.appendChild(this.tableCompactSwitch);
    this.tableCompactSwitch.defaultChecked = !!this.persistentConfig.compact;
    this.tableControls.appendChild(toggleWrapper);

    // Create page wrapper
    const pageSizerWrapper = document.createElement("div");
    pageSizerWrapper.className = "pageSizeWrapper";

    // Create label for page size element
    const pageSizerLabel = document.createElement("span");
    pageSizerLabel.textContent = this.translationService.translate("yasr.plugin.table.page_size.dropdown.label");
    pageSizerLabel.className = "pageSizerLabel";
    pageSizerWrapper.appendChild(pageSizerLabel);

    // Create page size element
    this.tableSizeField = document.createElement("select");
    this.tableSizeField.className = "tableSizer";

    // Create options for page sizer
    const options = [10, 50, 100, 1000, -1];
    for (const option of options) {
      const element = document.createElement("option");
      element.value = option + "";
      // -1 selects everything so we should call it All
      element.innerText = option > 0 ? option + "" : "All";
      // Set initial one as selected
      if (this.dataTable?.page.len() === option) element.selected = true;
      this.tableSizeField.appendChild(element);
    }
    pageSizerWrapper.appendChild(this.tableSizeField);
    this.tableSizeField.addEventListener("change", this.handleTableSizeSelect);
    this.tableControls.appendChild(pageSizerWrapper);
    this.yasr.pluginControls.appendChild(this.tableControls);
  }
  download(filename?: string) {
    return {
      getData: () => this.yasr.results?.asCsv() || "",
      contentType: "text/csv",
      title: this.translationService.translate("yasr.plugin.table.download_result.btn.label"),
      filename: `${filename || "queryResults"}.csv`,
    } as DownloadInfo;
  }

  public canHandleResults() {
    return !!this.yasr.results && this.yasr.results.getVariables() && this.yasr.results.getVariables().length > 0;
  }
  private removeControls() {
    // Unregister listeners and remove references to old fields
    this.tableFilterField?.removeEventListener("keyup", this.handleTableSearch);
    this.tableFilterField = undefined;
    this.tableSizeField?.removeEventListener("change", this.handleTableSizeSelect);
    this.tableSizeField = undefined;
    this.tableCompactSwitch?.removeEventListener("change", this.handleSetCompactToggle);
    this.tableCompactSwitch = undefined;
    this.tableEllipseSwitch?.removeEventListener("change", this.handleSetEllipsisToggle);
    this.tableEllipseSwitch = undefined;
    // Empty controls
    while (this.tableControls?.firstChild) this.tableControls.firstChild.remove();
    this.tableControls?.remove();
  }
  protected destroyResizer() {
    if (this.tableResizer) {
      this.tableResizer.reset({ disable: true });
      window.removeEventListener("resize", this.tableResizer.onResize);
      this.tableResizer = undefined;
    }
  }
  private getMaxResizibleColumns(): number {
    let maxResizableResultsColumns = Table.defaults.maxResizableResultsColumns;
    if (this.yasr.config.externalPluginsConfigurations) {
      const pluginConfiguration = this.yasr.config.externalPluginsConfigurations.get("table");
      if (pluginConfiguration) {
        maxResizableResultsColumns = pluginConfiguration.maxResizableResultsColumns;
      }
    }
    return maxResizableResultsColumns;
  }
  destroy() {
    this.removeControls();
    this.destroyResizer();
    // According to datatables docs, destroy(true) will also remove all events
    this.dataTable?.destroy(true);
    this.dataTable = undefined;
    removeClass(this.yasr.rootEl, "isSinglePage");
  }
}
