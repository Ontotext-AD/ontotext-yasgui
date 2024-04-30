import {RowOrColumnOrder} from './row-or-column-order';
import {PivotTableAggregatorType} from './pivot-table-aggregator-type';

export interface PivotTablePersistentConfig {
  /**
   * Stores the names of selected column variables.
   */
  cols: string[],

  /**
   * Stores the names of selected column variables.
   */
  rows: string[],

  colOrder: RowOrColumnOrder,
  rowOrder: RowOrColumnOrder,

  // TODO check what is this.
  vals: any[],

  /**
   * Stores excluded values for a given variable. The key represents the variable name (e.g. "s", "p", ...) and
   * the value is an array of specific variables that should be excluded from rendering.
   */
  exclusions: Record<string, string[]>[],

  /**
   * Stores excluded values for a given variable. The key represents the variable name (e.g. "s", "p", ...) and
   * the value is an array of specific variables that should be included in rendering.
   */
  inclusions: Record<string, string[]>[],

  /**
   * Stores excluded values for a given variable. The key represents the variable name (e.g. "s", "p", ...) and
   * the value is an array of specific variables that should be included in rendering.
   */
  inclusionsInfo: Record<string, string[]>[],

  /**
   * Stores the type of chosen aggregator. The value must be one of {@link PivotTableAggregatorType}.
   */
  aggregatorType: string,

  /**
   * Stores the type of chosen render. The value must be one of {@link PivotTableRendererType}.
   */
  rendererType: string,
}

export interface PivotTableConfig extends PivotTablePersistentConfig {
  onRefresh?: (pivotUIOptions: PivotTablePersistentConfig) => void;
  rendererName?: string;
  aggregatorName?: string;
}
