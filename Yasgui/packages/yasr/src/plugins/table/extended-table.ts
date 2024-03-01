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
      this.tableEl?.style.setProperty("width", this.tableEl.clientWidth + "px");
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

  private afterDraw() {
    this.setupIndexColumn();
    const explainPlanQueryElement = this.yasr.rootEl.querySelector("#explainPlanQuery") as HTMLElement | null;
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
            return this.getCellContent(data, prefixes);
          },
        };
      }),
    ];
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
    if (this.persistentConfig.isEllipsed === true) {
      addClass(this.getTableElement(), "extendedTableEllipseTable");
    } else {
      removeClass(this.getTableElement(), "extendedTableEllipseTable");
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
    super.destroy();
    this.cancelTableRenderingHandler();
  }
}
