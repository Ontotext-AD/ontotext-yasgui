import Table, { DEFAULT_PAGE_SIZE, PersistentConfig } from "./index";
import Parser from "../../parsers";
import Yasr from "@triply/yasr";
import Yasqe from "@triply/yasqe";
import { addClass, removeClass } from "@triply/yasgui-utils";
import { cloneDeep } from "lodash-es";
import $ from "jquery";

const ColumnResizer = require("column-resizer");

export class ExtendedTable extends Table {
  public label = "Extended_Table";
  public priority = 11;
  private tableRenderingHandlerId: number | undefined;

  private readonly getCellContentCustom?: (
    binding: Parser.BindingValue,
    prefixes?: { [label: string]: string }
  ) => string;

  constructor(yasr: Yasr) {
    super(yasr);
    if (yasr.config.externalPluginsConfigurations) {
      const pluginConfiguration = yasr.config.externalPluginsConfigurations.get("extended_table");
      this.getCellContentCustom = pluginConfiguration.getCellContent;
    }
  }

  public getCellContent(binding: Parser.BindingValue, prefixes?: { [label: string]: string }): string {
    if (this.getCellContentCustom) {
      return this.getCellContentCustom(binding, prefixes);
    }
    return super.getCellContent(binding, prefixes);
  }

  public draw(persistentConfig: PersistentConfig) {
    this.persistentConfig = { ...this.persistentConfig, ...persistentConfig };
    this.tableEl = document.createElement("table");
    const rows = this.getRows();
    const columns = this.getColumns();
    const types = this.resolveTypes();
    const columnDefinitions = this.getColumnDefinitions(types);
    if (rows.length <= (persistentConfig?.pageSize || DEFAULT_PAGE_SIZE)) {
      this.yasr.pluginControls;
      addClass(this.yasr.rootEl, "isSinglePage");
    } else {
      removeClass(this.yasr.rootEl, "isSinglePage");
    }

    if (this.dataTable) {
      this.destroyResizer();
      this.removeDataTableEventHandlers(this.dataTable);
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
      columnDefs: columnDefinitions,
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
          headerOnly: false,
          disabledColumns: this.persistentConfig.compact ? [] : [0],
        });
      }, 0);
    } else {
      addClass(this.tableEl, "fixedColumns");
    }

    this.registerDataTableEventHandlers(this.dataTable);

    this.drawControls();
    this.updateTableEllipseClasses();
    this.afterDraw();

    if (!rows || rows.length < 1) {
      this.updateEmptyTable(this.persistentConfig);
    }
  }

  /**
   * Resolves the type of binding in the sparql result using its datatype if present. If the datatype is not present,
   * null is returned. The types which this function can resolve are 'num', 'date' and 'str' and they are used to
   * bind the DataTables column type with the custom ordering functions where the name of the functions are based on
   * the type suffixed with '-pre'. For example
   * <code>$.fn.dataTable.ext.type.order['num-pre'] = function(d) {...}</code> is the custom ordering function for the
   * 'num' type.
   * @param binding The binding to resolve the type for.
   * @return The type of the binding or null if the binding is null.
   */
  private resolveValueType(binding: any){
      if (!binding) {
          return null;
      }
      if (binding.type != null && (binding.type === 'typed-literal' || binding.type === 'literal')) {
          const xsdType = binding.datatype;
          switch (xsdType) {
              case "http://www.w3.org/2001/XMLSchema#float":
              case "http://www.w3.org/2001/XMLSchema#double":
              case "http://www.w3.org/2001/XMLSchema#byte":
              case "http://www.w3.org/2001/XMLSchema#short":
              case "http://www.w3.org/2001/XMLSchema#int":
              case "http://www.w3.org/2001/XMLSchema#integer":
              case "http://www.w3.org/2001/XMLSchema#long":
              case "http://www.w3.org/2001/XMLSchema#decimal":
              case "http://www.w3.org/2001/XMLSchema#unsignedByte":
              case "http://www.w3.org/2001/XMLSchema#unsignedInt":
              case "http://www.w3.org/2001/XMLSchema#unsignedLong":
              case "http://www.w3.org/2001/XMLSchema#unsignedShort":
              case "http://www.w3.org/2001/XMLSchema#negativeInteger":
              case "http://www.w3.org/2001/XMLSchema#nonNegativeInteger":
              case "http://www.w3.org/2001/XMLSchema#positiveInteger":
              case "http://www.w3.org/2001/XMLSchema#nonPositiveInteger":
              case "http://www.w3.org/2001/XMLSchema#gDay":
              case "http://www.w3.org/2001/XMLSchema#gMonth":
              case "http://www.w3.org/2001/XMLSchema#gMonthDay":
              case "http://www.w3.org/2001/XMLSchema#gYear":
              case "http://www.w3.org/2001/XMLSchema#gYearMonth":
                  return "num";
              case "http://www.w3.org/2001/XMLSchema#date":
              case "http://www.w3.org/2001/XMLSchema#dateTime":
              case "http://www.w3.org/2001/XMLSchema#time":
                  return "date";
              default:
                  return "str";
          }
      }
  }

  /**
   * Resolves the types of the bindings in the sparql result.
   * For each variable in the result, this function counts the number of different types of the bindings for that
   * variable. If the type can be resolved unambiguously, the type is returned. If no type is found, 'str' is returned.
   * If multiple types are found, then an error is registered and logged because this renderer cannot allow sorting by
   * multiple types in a single column.
   * @return A record with the variable names as keys and the types as values.
   */
  private resolveTypes() {
    if (!this.yasr.results) return {};
    const variables = this.yasr.results?.getVariables();
    const bindings = this.yasr.results?.getBindings();
    const bindingTypes: Record<string, string> = {};
    variables.forEach((variable) => {
      const types: Record<string, number> = {};
      let typeCount = 0;
      bindings?.forEach((binding) => {
        const valueType = this.resolveValueType(binding[variable]);
        if (valueType != null) {
          if (!(valueType in types)) {
            types[valueType] = 0;
            typeCount++;
          }
          types[valueType]++;
        }
      });
      if (typeCount == 0) {
        bindingTypes[variable] = 'str';
      } else if (typeCount == 1) {
        bindingTypes[variable] = Object.keys(types)[0];
      } else {
        console.log('Mapping bindings to types failed. Multiple types for a variable found', types, variable);
      }
    });
    return bindingTypes;
  }

  /**
   * Builds a list with column definitions for the DataTables plugin. This is needed in order to allow sorting of the
   * columns based on their type.
   * @param types The types of the bindings in the sparql result.
   * @return A list with column definitions.
   */
  private getColumnDefinitions(types: Record<string, string>): DataTables.ColumnDefsSettings[] {
    const columnDefinitions = Object.keys(types).map((variable, index) => {
      return {targets: index + 1, type: types[variable]};
    });
    if (this.persistentConfig.compact) {
      columnDefinitions.unshift({targets: 0, type: 'num'});
    }
    return columnDefinitions;
  }

  private registerDataTableEventHandlers(dataTable: DataTables.Api) {
    // Both handlers are called only on sort column.
    dataTable.on("preDraw", this.preDrawTableHandler.bind(this));
    dataTable.on("draw", this.drawTableHandler.bind(this));
  }

  private removeDataTableEventHandlers(dataTable: DataTables.Api) {
    // Both handlers are called only on sort column.
    dataTable.off("preDraw", this.preDrawTableHandler.bind(this));
    dataTable.off("draw", this.drawTableHandler.bind(this));
  }

  /**
   * DataTables uses the rendered style to decide the widths of columns.
   * Before a draw remove the extendedTableEllipseTable styling and disable the table resizer.
   * @private
   */
  private preDrawTableHandler() {
    if (this.persistentConfig.isEllipsed !== false) {
      this.disableTableResizer();
      removeClass(this.tableEl, "extendedTableEllipseTable");
      this.tableEl?.style.removeProperty("width");
      this.tableEl?.style.setProperty("width", this.tableEl?.clientWidth + "px");
      return true; // Indicate it should re-render
    }
  }

  private disableTableResizer() {
    this.tableResizer?.reset({ disable: true });
  }

  private enableTableResizer() {
    // Enable the re-sizer
    this.tableResizer?.reset({
      disable: false,
      partialRefresh: true,
      headerOnly: false,
      disabledColumns: this.persistentConfig.compact ? [] : [0],
    });
  }

  /**
   * Recalculate the width of columns and enables the table resizer.
   *
   * @private
   */
  private drawTableHandler() {
    if (!this.tableEl) return;
    if (this.persistentConfig.isEllipsed !== false) {
      // Width of table after render, removing width will make it fall back to 100%
      let targetSize = this.tableEl.clientWidth;
      this.tableEl.style.removeProperty("width");
      // Let's make sure the new size is not bigger
      if (targetSize > this.tableEl.clientWidth) {
        targetSize = this.tableEl.clientWidth;
      }
      this.tableEl?.style.setProperty("width", `${targetSize}px`);
      this.enableTableResizer();
      this.updateTableEllipseClasses();
    }
  }

  /**
   * Checks if the specified <code>element</code> is truncated with ellipses.
   *
   * @param element The element to be checked for truncation.
   * @return <code>true</code> if the element is truncated with ellipses, <code>false</code> otherwise.
   */
  private isTextEllipsized(element: HTMLElement) {
    // If the scroll width is greater than the client width, content is likely truncated with an ellipsis
    return element.scrollWidth > element.clientWidth;
  }

  private dataTableClickHandler(event) {
    if (this.isCompactViewActive()) {
      let literalElement = event.target.closest('.literal-cell p');
      if (literalElement && this.isTextEllipsized(literalElement)) {
        // Adding the "expanded-literal" class will prevent the value from being truncated with ellipses.
        literalElement.classList.add('expanded-literal');
        // Removing the "expandable-literal" class will remove the cursor styling when a literal cell is hovered.
        literalElement.classList.remove('expandable-literal');
      }
    }
  }

  private isCompactViewActive(): boolean {
    return !!this.persistentConfig.isEllipsed;
  }

  private tableMouseoverHandler(event): void {
    if (this.isCompactViewActive()) {
      let literalElement = event.target.closest('.literal-cell p');
      if (literalElement && this.isTextEllipsized(literalElement)) {
        // Adding the 'expandable-literal' class will change cursor to point when literal is hovered.
        literalElement.classList.add('expandable-literal');
      }
    }
  }

  private tableMouseoutHandler(event): void {
    if (this.isCompactViewActive() && event.target.matches('.expandable-literal')) {
      // Remove pointer cursor when mouse leaves the cell
      event.target.classList.remove('expandable-literal');
    }
  }

  private afterDraw() {
    if (this.tableEl) {
      this.tableEl.addEventListener('click', this.dataTableClickHandler.bind(this));
      this.tableEl.addEventListener('mouseover', this.tableMouseoverHandler.bind(this));
      this.tableEl.addEventListener('mouseout', this.tableMouseoutHandler.bind(this));
    }
    this.setupIndexColumn();
    const explainPlanQueryElement = this.yasr.rootEl.querySelector(".explainPlanQuery") as HTMLElement | null;
    if (!explainPlanQueryElement) {
      return;
    }
    Yasqe.runMode(explainPlanQueryElement.innerText, "sparql11", explainPlanQueryElement);
  }

  protected getColumns(): DataTables.ColumnSettings[] {
    if (!this.yasr.results) return [];
    const prefixes = this.yasr.getPrefixes();
    return [
      {
        searchable: false,
        width: `${this.getSizeFirstColumn()}px`,
        orderable: false,
        render: (data: number, type: any) =>
          type === "filter" || type === "sort" || !type ? data : `<div class="rowNumber">${data}</div>`,
      }, //prepend with row numbers column
      ...this.yasr.results?.getVariables().map((name) => {
        return <DataTables.ColumnSettings>{
          name: name,
          title: name,
          render: (data: Parser.BindingValue | "", type: any, _row: any, _meta: DataTables.CellMetaSettings) => {
            // Handle empty rows
            if (data === "") {
              return data;
            }
            if (!type) {
              return data.value;
            }
            // The render function is called with different type property based on the operation currently performed,
            // e.g. filter, display, sort. We need to hook to sort operation to convert the value to the correct type
            // in order to allow DataTables to sort the column correctly.
            if (type === "sort") {
                const valueType = this.resolveValueType(data) || 'str'
                return this.convertValue(data, valueType);
            }
            return this.getCellContent(data, prefixes);
          },
        };
      }),
    ];
  }

  private convertValue(data: any, valueType: string) {
    switch (valueType) {
        case "num":
            return parseFloat(data.value);
        case "date":
            return new Date(data.value);
        default:
            return data.value;
    }
  }

  /**
   * Set-ups first column to be index column.
   * 1. Listen for the event 'draw.dt'
   * 2. Limit the nodes to just those on the page instead of all nodes.
   * 3. Use an offset of the page info starting point for the index.
   * @private
   */
  private setupIndexColumn() {
    if (!this.dataTable) {
      return;
    }
    const table = this.dataTable;
    table.on("draw.dt", function () {
      const PageInfo = table.page.info();
      table
        .column(0, { page: "current" })
        .nodes()
        .each(function (cell, i) {
          cell.innerHTML = `<span>${i + 1 + PageInfo.start}</span>`;
        });
    });
  }

  drawControls() {
    super.drawControls();
    this.updateTableRowNumberClasses();
  }

  protected handleSetEllipsisToggle = (event: Event) => {
    // Store in persistentConfig
    this.persistentConfig.isEllipsed = (event.target as HTMLInputElement).checked;
    this.showLoader(true);
    // Set in a timeout because if there are many columns to be displayed, the checkbox is updated after the table is refreshed.
    // This looks like nothing happened from the user's point of view.
    setTimeout(() => {
      this.updateTableEllipseClasses();
      this.showLoader(false);
    });
    this.yasr.storePluginConfig("extended_table", this.persistentConfig);
  };

  protected handleSetCompactToggle = (event: Event) => {
    // Store in persistentConfig
    this.persistentConfig.compact = (event.target as HTMLInputElement).checked;
    // the resizer is refreshed because it has to recalculate the position fo the column resizer elements.
    this.disableTableResizer();
    this.showLoader(true);
    // Set in a timeout because if there are many columns to be displayed, the checkbox is updated after the table is refreshed.
    // This looks like nothing happened from the user's point of view.
    setTimeout(() => {
      this.updateTableRowNumberClasses();
      this.enableTableResizer();
      this.showLoader(false);
    });
    this.yasr.storePluginConfig("extended_table", this.persistentConfig);
  };

  protected handleTableSizeSelect = (event: Event) => {
    const pageLength = parseInt((event.target as HTMLSelectElement).value);
    // Set page length
    this.dataTable?.page.len(pageLength).draw("page");
    // Store in persistentConfig
    this.persistentConfig.pageSize = pageLength;
    this.yasr.storePluginConfig("extended_table", this.persistentConfig);
  };

  private showLoader(rendering: boolean): void {
    this.cancelTableRenderingHandler();
    if (typeof window.requestAnimationFrame === "function") {
      if (rendering) {
        const message = this.translationService.translate("loader.message.query.editor.render.results");
        this.yasr.showLoader(message, false, false);
      } else {
        requestAnimationFrame(() => {
          this.tableRenderingHandlerId = undefined;
          this.yasr.hideLoader();
        });
      }
    }
  }

  private cancelTableRenderingHandler() {
    if (this.tableRenderingHandlerId !== undefined && typeof window.requestAnimationFrame === "function") {
      window.cancelAnimationFrame(this.tableRenderingHandlerId);
    }
  }

  private updateTableEllipseClasses() {
    if (!this.tableEl) {
      return;
    }
    // When 'Compact view' is toggled, remove the 'expanded-literal' class from all elements.
    // This will reset the literal cells.
    this.tableEl?.querySelectorAll('.expanded-literal').forEach((element) => {
      element.classList.remove('expanded-literal');
    });
    if (this.persistentConfig.isEllipsed === true) {
      addClass(this.tableEl, "extendedTableEllipseTable");
    } else {
      removeClass(this.tableEl, "extendedTableEllipseTable");
    }
  }

  private updateTableRowNumberClasses() {
    const tableElement = this.getTableElement();
    if (this.persistentConfig.compact) {
      removeClass(tableElement, "withRowNumber");
    } else {
      addClass(tableElement, "withRowNumber");
    }
  }

  destroy() {
    if (this.tableEl) {
      this.tableEl.removeEventListener('click', this.dataTableClickHandler.bind(this));
      this.tableEl.removeEventListener('mouseover', this.tableMouseoverHandler.bind(this));
      this.tableEl.removeEventListener('mouseout', this.tableMouseoutHandler.bind(this));
    }
    this.cancelTableRenderingHandler();
    super.destroy();
  }
}
