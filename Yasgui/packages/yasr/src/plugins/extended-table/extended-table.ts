import Table, { PersistentConfig } from "../table";
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
    const explainPlanQueryElement = document.getElementById("explainPlanQuery");
    if (!explainPlanQueryElement) {
      return;
    }
    Yasqe.runMode(explainPlanQueryElement.innerText, "sparql11", explainPlanQueryElement);
  }
}
