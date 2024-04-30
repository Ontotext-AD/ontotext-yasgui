import {PivotTableRenderer} from '../../models/plugins/pivot-table/pivot-table-renderer';
import {TranslationService} from '../translation.service';
import {PivotTableRendererType} from '../../models/plugins/pivot-table/pivot-table-renderer-type';
import {PivotTableAggregator} from '../../models/plugins/pivot-table/pivot-table-aggregator';
import {PivotTableAggregatorType} from '../../models/plugins/pivot-table/pivot-table-aggregator-type';

export class PivotTableService {

  static readonly RENDERER_NAME_PREFIX = 'yasr.plugin_control.plugin.pivot-table-plugin.renderer.type_';
  static readonly AGGREGATOR_NAME_PREFIX = 'yasr.plugin_control.plugin.pivot-table-plugin.aggregator.type_';

  private readonly translationService: TranslationService;
  private renderers: PivotTableRenderer[];
  private aggregators: PivotTableAggregator[];

  constructor(translationService: TranslationService) {
    this.translationService = translationService;
    this.initRenderers();
    this.initAggregators();
  }

  /**
   * Retrieves an instance of {@link PivotTableRenderer} based on the specified <code>type</code>.
   *
   * @param {string} type - renderer type, the value must be one of {@link PivotTableRendererType} values.
   * @returns {PivotTableRenderer} An instance of {@link PivotTableRenderer} corresponding to the specified type.
   */
  getPivotRendererByType(type: string): PivotTableRenderer {
    return this.renderers.find((renderer) => renderer.type === type);
  }

  /**
   * Retrieves an instance of {@link PivotTableRenderer} based on the specified <code>name</code>.
   *
   * @param {string} name - The renderer name. The value is language-dependent.
   * @returns {PivotTableRenderer} An instance of {@link PivotTableRenderer} corresponding to the specified name.
   */
  getPivotRendererByName(name: string): PivotTableRenderer {
    return this.renderers.find((renderer) => renderer.name === name);
  }

  /**
   * Fetches the name of a renderer with the specified <code>type</code>.
   *
   * @param {string} type - The renderer type. The value must be one of {@link PivotTableRendererType} values.
   * @param {string} language - The locale. For instance, "en", "fr", etc.
   * @return {string} The translated name of the renderer with the specified <code>type</code>.
   */
  getPivotTableRenderName(type: string, language?: string): string {
    if (language) {
      return this.translationService.translateInLocale((PivotTableService.RENDERER_NAME_PREFIX + type), language);
    }
    return this.translationService.translate(PivotTableService.RENDERER_NAME_PREFIX + type);
  }

  getPivotTableRenderersCompareByNameFunction(): (name1: string, name2: string) => number {
    return (name1, name2) => {
      const pivotRendererByName = this.getPivotRendererByName(name1);
      const pivotRendererByName1 = this.getPivotRendererByName(name2);
      return pivotRendererByName.order - pivotRendererByName1.order;
    }
  }

  /**
   * Retrieves an instance of {@link PivotTableAggregator} based on the specified <code>type</code>.
   *
   * @param {string} type - aggregator type, the value must be one of {@link PivotTableAggregatorType} values.
   * @returns {PivotTableAggregator} An instance of {@link PivotTableAggregator} corresponding to the specified type.
   */
  getPivotTableAggregatorByType(type: string): PivotTableAggregator {
    return this.aggregators.find((aggregator) => aggregator.type === type);
  }

  /**
   * Retrieves an instance of {@link PivotTableAggregator} based on the specified <code>name</code>.
   *
   * @param {string} name - The aggregator name. The value is language-dependent.
   * @returns {PivotTableAggregator} An instance of {@link PivotTableAggregator} corresponding to the specified name.
   */
  getPivotTableAggregatorByName(name: string): PivotTableAggregator {
    return this.aggregators.find((aggregator) => aggregator.name === name);
  }

  /**
   * Fetches the name of an aggregator with the specified <code>type</code>.
   *
   * @param {string} type - The aggregator type. The value must be one of {@link PivotTableAggregatorType} values.
   * @param {string} language - The locale. For instance, "en", "fr", etc.
   * @return {string} The translated name of the aggregator with the specified <code>type</code>.
   */
  getPivotTableAggregatorName(type: string, language?: string): string {
    if (language) {
      return this.translationService.translateInLocale(PivotTableService.AGGREGATOR_NAME_PREFIX + type, language);
    }
    return this.translationService.translate(PivotTableService.AGGREGATOR_NAME_PREFIX + type);
  }

  getPivotTableAggregatorsCompareByNameFunction(): (name1: string, name2: string) => number {
    return (name1, name2) => {
      const pivotTableAggregatorByName = this.getPivotTableAggregatorByName(name1);
      const pivotTableAggregatorByName1 = this.getPivotTableAggregatorByName(name2);
      return pivotTableAggregatorByName.order - pivotTableAggregatorByName1.order;
    }
  }

  /**
   * Initializes renderers. A renderer is an object that contains a mapping between a name and a type. The type is hardcoded and is
   * described in the {@link PivotTableRendererType}. The name depends on the language. During initialization, the names are translated
   * via the {@link TranslationService}.
   */
  private initRenderers() {
    this.renderers = [];
    Object.keys(PivotTableRendererType)
      .forEach((pivotTableRendererType) => {
        const pivotTableRenderName = this.getPivotTableRenderName(pivotTableRendererType);
        this.renderers.push(new PivotTableRenderer(pivotTableRenderName, pivotTableRendererType));
      });
  }

  /**
   * Initializes aggregators. An aggregator is an object that contains a mapping between a name and a type. The type is hardcoded and is
   * described in the {@link PivotTableAggregatorType} enum. The name depends on the language. During initialization, the names are translated
   * via the {@link TranslationService}.
   */
  private initAggregators() {
    this.aggregators = [];
    Object.keys(PivotTableAggregatorType)
      .forEach((pivotTableAggregatorType) => {
        const pivotTableRenderName = this.getPivotTableAggregatorName(pivotTableAggregatorType);
        this.aggregators.push(new PivotTableAggregator(pivotTableRenderName, pivotTableAggregatorType))
      });
  }
}
