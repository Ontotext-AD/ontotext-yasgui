import {control, featureGroup, FeatureGroup, geoJson, Map, map, TileLayer} from 'leaflet';
import {YasrPlugin} from '../../../models/yasr-plugin';
import {Yasr} from '../../../models/yasgui/yasr';
import {Binding} from '../../../models/yasgui/parser';
import {GeoSPARQLService} from './services/geo-sparql-service';
import {TranslationService} from '../../../services/translation.service';
import {Feature} from 'geojson';
import {LeafletOptionsBuilder} from './services/leaflet-options-builder';
import {LeafletService} from './services/leaflet-service';
import {GeoDatatype, GeometryColumns} from './models/geometry-columns';
import {GeoPluginConfiguration} from './models/geo-plugin-configuration';

/**
 * A YASR plugin that visualizes SPARQL query results as geographic features on a Leaflet map.
 *
 * It supports GeoSPARQL WKT geometries and displays them with popups and tooltips if result variables
 * (like `geo_popup` and `geo_tooltip`) are present. Provides base map switching and automatic map
 * fitting to feature bounds.
 */
export class GeoPlugin implements YasrPlugin {
  public static readonly PLUGIN_NAME = 'geo';
  priority = 30;
  label = 'Geo';
  private yasr: Yasr;
  private readonly translationService: TranslationService;
  private pluginGonfiguration: GeoPluginConfiguration;
  private geoMapContainer: HTMLElement;
  private map: Map;
  private resultsLayer: FeatureGroup;
  private subscriptions: Array<() => void> = [];

  constructor(yasr: Yasr) {
    if (yasr) {
      this.yasr = yasr;
      this.pluginGonfiguration = this.yasr.config.externalPluginsConfigurations.get(GeoPlugin.PLUGIN_NAME) as GeoPluginConfiguration;
      this.translationService = this.yasr.config.translationService;
      // Subscribe for language changes
      this.subscriptions.push(this.translationService.subscribeForLanguageChange({
        name: 'geo-plugin',
        notify: this.recreateMap,
      }));
    }
  }

  /**
   * Determines if the plugin can handle the current query results.
   *
   * @returns True if there are geometry columns in the results.
   */
  canHandleResults(): boolean {
    return this.getGeometryColumns() !== null;
  }

  /**
   * Initializes the plugin by creating the map container and base maps.
   *
   * @returns A promise that resolves once initialization is complete.
   */
  initialize(): Promise<void> {
    return new Promise(resolve => {
      // The initialize method can be called multiple times when YASGUI is resized.
      // Initialize the geo map setup only once.
      if (!this.geoMapContainer) {
        this.geoMapContainer = this.createGeoMapElement();
        this.createMapInstance();
        this.createBaseMapsAndControl();
      }
      this.resultsLayer?.clearLayers();
      resolve();
    });
  }

  /**
   * Draws the map and appends it to the YASR results element.
   */
  draw(): void {
    if (!this.geoMapContainer) {
      return;
    }
    this.yasr.resultsEl.appendChild(this.geoMapContainer);
    this.redrawMap();
  }

  /**
   * Returns the default icon for this plugin.
   */
  getIcon(): Element {
    const icon = document.createElement('i');
    icon.classList.add('ri-map-pin-fill');
    return icon;
  }

  /**
   * Recreates the map.
   */
  private recreateMap = () => {
    if (!this.geoMapContainer) {
      return;
    }
    this.destroyMap();
    this.createMapInstance();
    this.createBaseMapsAndControl();
    this.redrawMap();
  }

  /**
   * Creates the container element used to render the Leaflet map.
   *
   * The element receives the `geo-plugin` CSS class which is expected to define the size and layout of the map container.
   *
   * @returns {HTMLElement} The map container element.
   */
  private createGeoMapElement(): HTMLElement {
    const geoMapContainer = document.createElement('div');
    geoMapContainer.classList.add('geo-plugin');
    return geoMapContainer;
  }

  /**
   * Creates a Leaflet map instance with the default center and zoom.
   */
  private createMapInstance(): void {
    if (this.map) {
      this.destroyMap();
    }

    this.map = map(this.geoMapContainer, {
      center: [50 + 38 / 60 + 28 / 3600, 4 + 40 / 60 + 5 / 3600],
      zoom: 5,
    });
  }

  /**
   * Adds base maps and layer control to the map.
   */
  private createBaseMapsAndControl(): void {
    // TODO: consider base maps to be passed as configuration.
    const baseMaps = this.createBaseMaps();
    // Add the first base map as default
    const firstLayerKey = Object.keys(baseMaps)[0];
    if (firstLayerKey) {
      baseMaps[firstLayerKey].addTo(this.map);
    }

    const resultsLayer = featureGroup().addTo(this.map);
    control.layers(baseMaps, { [this.translationService.translate('yasr.plugin.geo-plugin.tile-layer.results')]: resultsLayer }).addTo(this.map);
    this.resultsLayer = resultsLayer;
  }

  /**
   * Creates an object with all available base map layers.
   */
  private createBaseMaps(): Record<string, TileLayer> {
    const translate = this.translationService.translate.bind(this.translationService);
    return {
      [translate('yasr.plugin.geo-plugin.tile-layer.open-street.name')]: LeafletService.getOpenStreetTileLayer(),
      [translate('yasr.plugin.geo-plugin.tile-layer.open-topo.name')]: LeafletService.getOpenTopoTileLayer(),
    };
  }

  /**
   * Redraws the map by creating layers for all geometry columns.
   */
  private redrawMap(): void {
    if (!this.map || !this.resultsLayer) {
      return;
    }
    const bindings = this.getBindings();
    Object.entries(this.getGeometryColumns() ?? {})
      .forEach(([colName, _datatype]) => {
        this.resultsLayer.addLayer(this.createGeoLayer(bindings, colName));
      });
    this.fitResultsLayerBounds();
  }

  /**
   * Creates a Leaflet FeatureGroup from query bindings for a specific geometry column.
   *
   * @param bindings SPARQL query bindings
   * @param colName The geometry column name
   */
  private createGeoLayer(bindings: Binding[], colName: string): FeatureGroup {
    const geojson = this.createGeoJson(bindings, colName);
    const leafletOptions = new LeafletOptionsBuilder(this.pluginGonfiguration)
      .withPointMarker()
      .withFeatureClick()
      .withStyle()
      .build();
    return geoJson(geojson, leafletOptions);
  }

  /**
   * Retrieves SPARQL query bindings from the YASR results.
   */
  private getBindings(): Binding[] {
    return this.yasr.results?.getBindings?.() ?? [];
  }

  /**
   * Retrieves the list of variable names from the SPARQL query results.
   *
   * @returns An array of variable names present in the SPARQL results.
   */
  private getVariables(): string[] {
    return this.yasr.results?.getVariables?.() ?? [];
  }

  /**
   * Adjusts the map view to fit the bounds of the current results layer.
   *
   * This method delays execution slightly to ensure the map container has been fully rendered and sized
   * before recalculating the layout.
   *
   * @remarks
   * A short timeout is used because Leaflet may compute incorrect bounds if the map is resized or rendered
   * asynchronously (e.g., after DOM updates).
   */
  private fitResultsLayerBounds(): void {
    setTimeout(() => {
      this.map.invalidateSize();
      const bounds = this.resultsLayer.getBounds();
      if (bounds.isValid()) {
        this.map.fitBounds(bounds, {
          padding: [20, 20]
        });
      }
      });
  }

  /**
   * Extracts geometry columns from the first row of SPARQL bindings. Only columns whose values are GeoSPARQL
   * literals are included.
   *
   * @returns A record mapping column names to their GeoSPARQL datatype.
   */
  private getGeometryColumns(): GeometryColumns | null {
      const bindings = this.getBindings();
      if (!bindings.length) {
        return null;
      }

      const geometryColumns: GeometryColumns = {};
      const variables = this.getVariables();
      for (const varName of variables) {
        // Find the first row where this variable is a GeoSPARQL binding
        const firstGeoBinding = bindings.find((row) => GeoSPARQLService.isGeoSPARQLBinding(row[varName]));
        if (firstGeoBinding) {
          geometryColumns[varName] = firstGeoBinding[varName].datatype as GeoDatatype;
        }
      }
      return Object.keys(geometryColumns).length > 0 ? geometryColumns : null;
  }

  /**
   * Converts SPARQL bindings into GeoJSON Features for a given geometry column.
   *
   * @param bindings SPARQL query bindings
   * @param columnName The name of the geometry column
   */
  private createGeoJson(bindings: Binding[], columnName: string): Feature[] {
    return bindings
      .map<Feature | undefined>((item) => {
        const binding = item[columnName];
        if (!binding) {
          return undefined;// no cast needed
        }

        const parser = GeoSPARQLService.SUPPORTED_CONVERSIONS[binding.datatype];
        const geometry = parser ? parser(binding.value) : null;
        if (!geometry) {
          return undefined;
        }

        return {
          type: 'Feature',
          properties: { ...item }, // optionally omit the geometry column
          geometry
        };
      })
      .filter((feature): feature is Feature => feature !== undefined);
  }

  /**
   * Destroys the Leaflet map instance and clears the results layer.
   */
  private destroyMap(): void {
    if (this.map) {
      this.map.remove();
      this.map = undefined;
    }
    this.resultsLayer = undefined;
  }

  /**
   * Destroys the plugin, removing the map and unsubscribing from language changes.
   */
  destroy(): void {
    this.destroyMap();

    if (this.geoMapContainer) {
      this.geoMapContainer.remove();
    }
    this.geoMapContainer = undefined;

    this.subscriptions.forEach(unsubscribe => unsubscribe());
  }
}
