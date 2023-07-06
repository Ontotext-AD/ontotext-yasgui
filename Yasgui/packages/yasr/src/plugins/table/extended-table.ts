import Table, { PersistentConfig } from "./index";
import Parser from "../../parsers";
import Yasr from "@triply/yasr";
import Yasqe from "@triply/yasqe";

export class ExtendedTable extends Table {
  public label = "Extended_Table";
  public priority = 11;

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
    super.draw(persistentConfig);
    this.setupIndexColumn();
    const explainPlanQueryElement = document.getElementById("explainPlanQuery");
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
    table.on( 'draw.dt', function () {
      const PageInfo = table.page.info();
      table.column(0, { page: 'current' }).nodes().each( function (cell, i) {
        cell.innerHTML = `<span>${i + 1 + PageInfo.start}</span>`;
      });
    });
  }
}
