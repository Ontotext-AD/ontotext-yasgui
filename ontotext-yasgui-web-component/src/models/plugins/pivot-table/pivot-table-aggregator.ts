import {PivotTableAggregatorType} from './pivot-table-aggregator-type';

const AGGREGATOR_ORDER_LIST = [
  PivotTableAggregatorType.COUNT,
  PivotTableAggregatorType.COUNT_UNIQUE_VALUES,
  PivotTableAggregatorType.LIST_UNIQUE_VALUES,
  PivotTableAggregatorType.SUM,
  PivotTableAggregatorType.INTEGER_SUM,
  PivotTableAggregatorType.AVERAGE,
  PivotTableAggregatorType.MEDIAN,
  PivotTableAggregatorType.SAMPLE_VARIANCE,
  PivotTableAggregatorType.SAMPLE_STANDARD_DEVIATION,
  PivotTableAggregatorType.MINIMUM,
  PivotTableAggregatorType.MAXIMUM,
  PivotTableAggregatorType.FIRST,
  PivotTableAggregatorType.LAST,
  PivotTableAggregatorType.SUM_OVER_SUM,
  PivotTableAggregatorType.UPPER_BOUND,
  PivotTableAggregatorType.LOWER_BOUND,
  PivotTableAggregatorType.SUM_AS_FRACTION_OF_TOTAL,
  PivotTableAggregatorType.SUM_AS_FRACTION_OF_ROWS,
  PivotTableAggregatorType.SUM_AS_FRACTION_OF_COLUMNS,
  PivotTableAggregatorType.COUNT_AS_FRACTION_OF_TOTAL,
  PivotTableAggregatorType.COUNT_AS_FRACTION_OF_ROWS,
  PivotTableAggregatorType.COUNT_AS_FRACTION_OF_COLUMNS
];

export class PivotTableAggregator {
  /**
   * Stores the type of aggregator. The value must be one of {@link PivotTableAggregatorType}.
   * Used to define the aggregator when loading persisted aggregator or when the language is changed.
   */
  readonly type: string;

  /**
   * The name of aggregator, it depends on chosen language. The name will be shown as label in aggregators dropdown.
   */
  readonly name: string;

  /**
   * Arranges the position of the aggregator in the dropdown options.
   */
  readonly order: number;

  constructor(name, type) {
    this.name = name;
    this.type = type;
    this.order = AGGREGATOR_ORDER_LIST.indexOf(this.type);
  }
}
