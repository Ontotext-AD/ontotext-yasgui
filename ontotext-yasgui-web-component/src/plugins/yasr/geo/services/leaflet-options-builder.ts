import {GeoJSONOptions, LatLng, Layer, marker, Icon, DivIcon} from 'leaflet';
import {Feature} from 'geojson';
import {BindingValue} from '../../../../models/yasgui/parser';
import {ObjectUtil} from '../../../../services/utils/object-util';
import {GEO_PROPERTIES_PREFIX, GeoPropertyKey, GeoSparqlVariable} from '../models/geo-sparql-variable';
import {GeoPluginConfiguration} from '../models/geo-plugin-configuration';
import {GeoStyleOptionKeys, GeoStyleOptions} from '../models/geo-style-options';
import {FeatureClickPayload} from '../models/feature-click-payload';
import {LeafletService} from './leaflet-service';
import {GeoPropertySanitizer} from '../utils/geo-property-sanitizer';
import markdownit from "markdown-it";

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

  private markdown: markdownit.MarkdownIt;

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
    this.markdown = markdownit({html: true});
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
      ...this.getGeoStyleOptions(feature)
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
   * Extracts and sanitizes a typed property value from a GeoJSON feature.
   *
   * If the property is missing or has no value, `undefined` is returned.
   *
   * @template K - A valid GeoPropertyKey representing the feature property
   *
   * @param propertyName - The Geo property key to extract from the feature
   * @param feature - The GeoJSON feature containing properties
   *
   * @returns The sanitized value, or undefined if the property is invalid or missing.   *
   */
  private getFeaturePropertyValue<K extends GeoPropertyKey>(propertyName: K, feature: Feature): ReturnType<typeof GeoPropertySanitizer.sanitize<K>> | undefined {
    const property = feature.properties?.[propertyName];
    if (!property?.value) {
      return;
    }
    return GeoPropertySanitizer.sanitize(propertyName, property.value);
  }

  /**
   * Function used by Leaflet's pointToLayer option to create a marker for each point feature.
   *
   * @param feature - The GeoJSON feature .
   * @param latlng - The Leaflet LatLng for the feature.
   * @returns A Leaflet Layer representing the point marker.
   */
  private pointToLayerFunction(feature: Feature, latlng: LatLng): Layer  {
    let icon: Icon | DivIcon | undefined;

    icon = this.getIconByMarkerClass(feature);
    if (!icon) {
      icon = this.getIconByMarkerUrl(feature);
    }
    if (!icon) {
      icon = LeafletService.createClassBasedIcon({
        className: 'ri-map-pin-line default-geo-icon',
        color: this.getFeaturePropertyValue(GeoSparqlVariable.FIGURE_COLOR, feature) ?? this.configuration.defaultGeoStyleOptions.color,
        opacity: this.getFeaturePropertyValue(GeoSparqlVariable.FIGURE_OPACITY, feature) ?? 1
      });
    }

    return marker(latlng, {icon});
  }

  /**
   * Creates a Leaflet DivIcon based on the `geo_markerClass` feature property.
   *
   * When `geo_markerClass` is present, a class-based marker icon is generated.
   * Additional styling properties are applied when available:
   * - FIGURE_COLOR (fallback: defaultGeoStyleOptions.color)
   * - FIGURE_OPACITY (fallback: defaultGeoStyleOptions.opacity)
   *
   * If `geo_markerClass` is missing or empty, the method returns `undefined`.
   *
   * @param feature - GeoJSON feature containing GeoSPARQL marker properties.
   */
  private getIconByMarkerClass(feature: Feature): DivIcon | undefined {
    const className = this.getFeaturePropertyValue(GeoSparqlVariable.MARKER_CLASS, feature);
      if (className) {
        const color = this.getFeaturePropertyValue(GeoSparqlVariable.FIGURE_COLOR, feature) ?? this.configuration.defaultGeoStyleOptions.color;
        const opacity = this.getFeaturePropertyValue(GeoSparqlVariable.FIGURE_OPACITY, feature) ?? this.configuration.defaultGeoStyleOptions.opacity;
        return LeafletService.createClassBasedIcon({className, color, opacity});
      }
  }

  /**
   * Creates a Leaflet Icon based on the `geo_markerUrl` feature property.
   *
   * When `geo_markerUrl` is present, an image-based marker icon is created from the URL.
   * This is typically used for safe raster images (e.g., PNG icons).
   *
   * If `geo_markerUrl` is missing or empty, the method returns `undefined`.
   *
   * @param feature - GeoJSON feature containing GeoSPARQL marker properties.
   */
  private getIconByMarkerUrl(feature: Feature): Icon | undefined {
    const url = this.getFeaturePropertyValue(GeoSparqlVariable.MARKER_URL, feature);
    if (url) {
      return LeafletService.createIconFromUrl(url);
    }
  }

  /**
   * Function used by Leaflet's `onEachFeature` option to attach event handlers to each feature layer.
   *
   * @param feature - The GeoJSON feature being processed .
   * @param layer - The Leaflet Layer representing the feature.
   */
  private onEachFeatureFunction(feature: Feature, layer: Layer) {
    // Cache the rendered popup content to avoid re-rendering on each open.
    let renderedPopupContent: string | HTMLElement | undefined;
    // Lazily render popup content only when the popup is first opened. This avoids unnecessary processing for features
    // that are never clicked.
    layer.bindPopup(() => {
      if (renderedPopupContent !== null && renderedPopupContent !== undefined) {
        return renderedPopupContent;
      }

      const popupContent = this.getFeaturePropertyValue(GeoSparqlVariable.FIGURE_POPUP_CONTENT, feature);
      // Caches the result for future opens
      renderedPopupContent = popupContent !== null && popupContent !== undefined ? this.markdown.render(popupContent) : this.getDefaultPopupContent(feature);
      return renderedPopupContent;
    }, {maxWidth: 500, className: 'geo-popup'});

    const tooltip = this.getFeaturePropertyValue(GeoSparqlVariable.FIGURE_TOOLTIP, feature);
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
  private getGeoStyleOptions(feature: Feature): GeoStyleOptions {
    const geoStyleOptions: GeoStyleOptions = {}
    if (!feature?.properties) {
      return geoStyleOptions;
    }

    Object.values(GeoSparqlVariable)
      .forEach((geoSparqlVariable) => {
        const featurePropertyValue = this.getFeaturePropertyValue(geoSparqlVariable, feature);
        if (featurePropertyValue !== undefined) {
          const styleOptionKey = LeafletOptionsBuilder.toGeoStyleOptionKey(geoSparqlVariable);
          const parser = GEO_STYLE_OPTION_PARSERS[styleOptionKey];
          geoStyleOptions[styleOptionKey] = parser ? parser(featurePropertyValue) : featurePropertyValue;
        }
      });
    return geoStyleOptions;
  }

  private static toGeoStyleOptionKey(geoSparqlVariable: string): string {
    return geoSparqlVariable.slice(GEO_PROPERTIES_PREFIX.length);
  }
}
