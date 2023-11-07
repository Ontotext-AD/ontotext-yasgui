import {RowOrColumnOrder} from './row-or-column-order';

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
   * Stores the name of chosen aggregator.
   */
  aggregatorName: string,

  /**
   * Stores the name of chosen render.
   */
  rendererName: string,
}

export interface PivotTableConfig extends PivotTablePersistentConfig {
  renderers?: any;
  onRefresh?: (pivotUIOptions: PivotTablePersistentConfig) => void;
}
