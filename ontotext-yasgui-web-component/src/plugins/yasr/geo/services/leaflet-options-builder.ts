import {circleMarker, CircleMarker, GeoJSONOptions, LatLng, Layer} from 'leaflet';
import {Feature} from 'geojson';
import {BindingValue} from '../../../../models/yasgui/parser';
import {ObjectUtil} from '../../../../services/utils/object-util';
import {GEO_PROPERTIES_PREFIX, GeoSparqlVariable} from '../models/geo-sparql-variable';
import {GeoPluginConfiguration} from '../models/geo-plugin-configuration';
import {GeoStyleOptionKeys, GeoStyleOptions} from '../models/geo-style-options';
import {FeatureClickPayload} from '../models/feature-click-payload';

/**
 * Parsers for converting raw feature property values into typed GeoStyleOptions.
 *
 * Each key corresponds to a `GeoStyleOptionKey` and maps to a function that receives an unknown value
 * (typically from a feature's properties) and returns the properly typed value for that style option.
 *
 * These parsers are used when generating the `GeoStyleOptions` for a feature, ensuring that feature property values
 * are correctly typed for rendering.
 */
const GEO_STYLE_OPTION_PARSERS: {[K in GeoStyleOptionKeys]: (v: unknown) => GeoStyleOptions[K];} = {
  weight:      (v: unknown) => { const n = Number(v); return Number.isNaN(n) ? undefined : n; },
  opacity:     (v: unknown) => { const n = Number(v); return Number.isNaN(n) ? undefined : n; },
  fillOpacity: (v: unknown) => { const n = Number(v); return Number.isNaN(n) ? undefined : n; },
  color:       (v: unknown) => String(v),
  fillColor:   (v: unknown) => String(v),
};

/**
 * Builder class for constructing Leaflet GeoJSON options with customizable point markers,
 * feature click handlers, and styling.
 */
export class LeafletOptionsBuilder {
  /**
   * Maximum number of characters per line for default popup content.
   *
   * When generating the default content of a map feature's popup, each property value is truncated to this length.
   * If the value exceeds this limit, it is cut off and "..." is appended to indicate truncation. This ensures the popup
   * remains compact and readable, preventing overly long lines from breaking the layout.
   */
  private static readonly MAX_POPUP_CONTENT_LINE_LENGTH = 120;
  /**
   * Internal storage for the GeoJSON options being built
   */
  private options: GeoJSONOptions = {};

  private configuration: GeoPluginConfiguration;

  /**
   * Collection of cleanup functions used to unregister event handlers (e.g. Leaflet layer listeners)
   * created during plugin initialization.
   */
  private subscriptions: Array<() => void>;

  /**
   * Creates a new instance of the Geo plugin configuration wrapper.
   *
   * @param configuration - The resolved Geo plugin configuration.
   * @param subscriptions - An array of cleanup functions responsible for unregistering event handlers (e.g. click listeners on Leaflet layers).
   *
   * @remarks
   * The handlers are registered after the Leaflet options are constructed, so this array is provided by the client.
   * The client is responsible for invoking these cleanup functions at the appropriate time (e.g. when the plugin is destroyed
   * or reinitialized) to prevent memory leaks and duplicate handlers.
   */
  constructor(configuration: GeoPluginConfiguration, subscriptions: Array<() => void>) {
    this.configuration = configuration;
    this.subscriptions = subscriptions;
  }

  /**
   * Configure the GeoJSON to use custom point markers.
   *
   * @returns The builder instance for chaining.
   */
  withPointMarker(): this {
    this.options['pointToLayer'] =  this.pointToLayerFunction.bind(this);
    return this;
  }

  /**
   * Configure the GeoJSON to handle feature click events. External components can be notified
   * when a feature is clicked.
   *
   * @returns The builder instance for chaining.
   */
  withFeatureClick(): this {
    this.options['onEachFeature'] = this.onEachFeatureFunction.bind(this);
    return this;
  }

  /**
   * Configure the GeoJSON to apply custom styling to features. The style can depend on the feature's geo style options.
   *
   * @returns The builder instance for chaining.
   */
  withStyle(): this {
    this.options['style'] = this.styleFunction.bind(this);
    return this;
  }

  /**
   * Generates the style for a GeoJSON feature based on its geo style options.
   *
   * @param feature - The GeoJSON feature to style.
   * @returns A `GeoStyleOptions` object representing the Leaflet path options for the feature.
   */
  private styleFunction(feature: Feature): GeoStyleOptions {
    return {
      ...this.configuration.defaultGeoStyleOptions,
      ...LeafletOptionsBuilder.getGeoStyleOptions(feature)
    };
  }

  /**
   * Returns the fully constructed GeoJSON options object.
   *
   * @returns The GeoJSONOptions object.
   */
  build(): GeoJSONOptions {
    return this.options;
  }

  /**
   * Create a default CircleMarker for a point feature.
   *
   * @param latlng - The Leaflet LatLng for the feature
   * @returns A Leaflet CircleMarker with default styling.
   */
  getDefaultPointMarker(latlng: LatLng): CircleMarker {
    return circleMarker(latlng, this.configuration.defaultGeoStyleOptions);
  }

  /**
   * Function used by Leaflet's pointToLayer option to create a marker for each point feature.
   *
   * @param _feature - The GeoJSON feature .
   * @param latlng - The Leaflet LatLng for the feature.
   * @returns A Leaflet Layer representing the point marker.
   */
  private pointToLayerFunction(_feature: Feature, latlng: LatLng): Layer  {
    // TODO: Implement custom point marker logic depending on the feature properties.
    //  The properties are filled from the bindings of the SPARQL query result, so they can hold any information
    //  that can be used to determine the marker style.
    //  This is part of another task, currently, we just return a default point marker.
    return this.getDefaultPointMarker(latlng);
  }

  /**
   * Function used by Leaflet's `onEachFeature` option to attach event handlers to each feature layer.
   *
   * @param feature - The GeoJSON feature being processed .
   * @param layer - The Leaflet Layer representing the feature.
   */
  private onEachFeatureFunction(feature: Feature, layer: Layer) {
    let popupContent = feature.properties[GeoSparqlVariable.FIGURE_POPUP_CONTENT]?.value;
    if (!popupContent) {
      popupContent = this.getDefaultPopupContent(feature);
    }
    layer.bindPopup(popupContent);

    const tooltip = feature.properties[GeoSparqlVariable.FIGURE_TOOLTIP]?.value;
    if (tooltip) {
      layer.bindTooltip(tooltip, {
        direction: 'top',
        offset: [0, -10],
        sticky: true
      });
    }

    const { onFeatureClick } = this.configuration;
    // Attach the click handler if a callback is provided
    if (typeof onFeatureClick === 'function') {
      const clikPayload = this.getFeatureClickPayload(feature);
      const handleClick = () => onFeatureClick(clikPayload);
      layer.on('click', handleClick);
      this.subscriptions.push(() => layer.off('click', handleClick));
    }
  }

  /**
   * Extracts non-geo properties from a GeoJSON feature.
   *
   * Iterates over `feature.properties` and excludes any entries whose keys match geo-related variables defined in {@link GeoSparqlVariable}.
   *
   * @param feature - The GeoJSON feature containing a `properties` object.
   *
   * @returns An object containing only non-geo properties from the feature.
   *
   * @example
   * // Given feature.properties:
   * {
   *   geo_color: { value: 'red' },
   *   name: { value: 'Feature A' },
   *   type: { value: 'Polygon' }
   * }
   *
   * // Result:
   * {
   *   name: { value: 'Feature A' },
   *   type: { value: 'Polygon' }
   * }
   */
  private getFeatureClickPayload(feature: Feature): FeatureClickPayload {
    return Object.keys(feature.properties ?? {})
      .filter(key => !ObjectUtil.isEnumValue(key, GeoSparqlVariable))
      .reduce((geoStyleOptions: FeatureClickPayload, key: string) => {
        geoStyleOptions[key] = feature.properties[key];
        return geoStyleOptions;
      }, {} as FeatureClickPayload);
  }

  /**
   * Generates the default HTML content for a feature popup.
   *
   * The popup displays all feature property bindings except those defined in {@link GeoSparqlVariable}
   * (e.g. geo_* variables used internally by the geo plugin). Each property is rendered as a key–value pair in HTML.
   * Values longer than 120 characters are truncated and suffixed with '...'.
   *
   * Example output:
   * `<b>featureType:</b> example<br><b>exampleWKT:</b> POINT(...)`
   *
   * @param feature - The GeoJSON feature whose properties will be rendered.
   * @returns HTML string representing the popup content.
   */
  private getDefaultPopupContent(feature: Feature): HTMLDivElement {
    const container = document.createElement('div');
    const properties = (feature.properties ?? {}) as Record<string, BindingValue>;

    Object.keys(properties)
      .filter(key => !ObjectUtil.isEnumValue(key, GeoSparqlVariable))
      .forEach((key) => {
        const value = properties[key]?.value ?? '';
        const truncated = value.length > LeafletOptionsBuilder.MAX_POPUP_CONTENT_LINE_LENGTH
          ? value.slice(0, LeafletOptionsBuilder.MAX_POPUP_CONTENT_LINE_LENGTH) + '...'
          : value;

        const line = document.createElement('div');
        const boldKey = document.createElement('b');
        boldKey.textContent = key + ': ';
        line.appendChild(boldKey);
        line.appendChild(document.createTextNode(truncated));
        container.appendChild(line);
      });

    return container;
  }

  /**
   * Extracts style-related geo style options from a GeoJSON feature.
   *
   * @param feature - A GeoJSON Feature whose `properties` may contain geo-prefixed entries.
   *
   * @returns A flat key-value map of Leaflet style properties (e.g. `color`, `fillColor`).
   *
   * @example
   * Input:
   * feature.properties = {
   *   geo_Color: { value: 'red' },
   *   geo_fillOpacity: { value: 0.5 }
   * }
   *
   * Output:
   * {
   *   color: 'red',
   *   fillOpacity: '0.5'
   * }
   */
  private static getGeoStyleOptions(feature: Feature): GeoStyleOptions {
    const geoStyleOptions: GeoStyleOptions = {}
    if (!feature?.properties) {
      return geoStyleOptions;
    }

    Object.values(GeoSparqlVariable)
      .forEach((geoSparqlVariable) => {
        const featureProperty = feature.properties[geoSparqlVariable];
        if (featureProperty && featureProperty.value) {
          const styleOptionKey = LeafletOptionsBuilder.toGeoStyleOptionKey(geoSparqlVariable);
          const parser = GEO_STYLE_OPTION_PARSERS[styleOptionKey];
          geoStyleOptions[styleOptionKey] = parser ? parser(featureProperty.value) : featureProperty.value;
        }
      });
    return geoStyleOptions;
  }

  private static toGeoStyleOptionKey(geoSparqlVariable: string): string {
    return geoSparqlVariable.slice(GEO_PROPERTIES_PREFIX.length);
  }
}
