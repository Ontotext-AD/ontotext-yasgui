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
   * Set-ups first column to be index column according official solution from DataTable.
   * @see <a href="https://datatables.net/examples/api/counter_columns.html">Official solution from DataTable</a>
   * @private
   */
  private setupIndexColumn() {
    if (!this.dataTable) {
      return;
    }
    const dataTable = this.dataTable;
    // Set up first column to be index column according official solution from DataTable.
    this.dataTable
      .on("order.dt search.dt", function () {
        let i = 1;
        dataTable.cells(null, 0, { search: "applied", order: "applied" }).every(function (cell) {
          this.data(i++);
        });
      })
      .draw();
  }
}
