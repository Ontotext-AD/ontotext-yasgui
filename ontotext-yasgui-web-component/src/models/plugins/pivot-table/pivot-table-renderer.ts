import {PivotTableRendererType} from './pivot-table-renderer-type';

const RENDERER_ORDER_LIST = [
  PivotTableRendererType.TABLE,
  PivotTableRendererType.TABLE_BARCHART,
  PivotTableRendererType.HEATMAP,
  PivotTableRendererType.ROW_HEATMAP,
  PivotTableRendererType.COL_HEATMAP,
  PivotTableRendererType.TREEMAP,
  PivotTableRendererType.LINE_CHART,
  PivotTableRendererType.BAR_CHART,
  PivotTableRendererType.STACKED_BAR_CHART,
  PivotTableRendererType.AREA_CHART,
  PivotTableRendererType.SCATTER_CHART,
  PivotTableRendererType.TSV_EXPORT
];

export class PivotTableRenderer {

  /**
   * Stores the type of render. The value must be one of {@link PivotTableRendererType}.
   * Used to define the renderer when loading persisted renderer or when the language is changed.
   */
  readonly type: string;

  /**
   * The name of renderer, it depends on chosen language. The name will be shown as label in renderers dropdown.
   */
  readonly name: string;


  /**
   * Arranges the position of the renderer in the dropdown options.
   */
  readonly order: number;

  constructor(name, type) {
    this.name = name;
    this.type = type;
    this.order = RENDERER_ORDER_LIST.indexOf(this.type);
  }
}
