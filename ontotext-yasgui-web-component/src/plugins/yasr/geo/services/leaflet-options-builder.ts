import {circleMarker, CircleMarker, GeoJSONOptions, LatLng, Layer, PathOptions} from 'leaflet';
import {Feature, GeoJsonProperties} from 'geojson';
import {BindingValue} from '../../../../models/yasgui/parser';
import {ObjectUtil} from '../../../../services/utils/object-util';
import {GeoProperties} from '../models/geo-properties';
import {GeoPluginConfiguration} from '../models/geo-plugin-configuration';
import {LeafletService} from './leaflet-service';

/**
 * Builder class for Leaflet necessary options.
 */
export class LeafletOptionsBuilder {
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
  constructor(configuration: GeoPluginConfiguration, subscriptions: Array<() => void> = []) {
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
   * Configure the GeoJSON to apply custom styling to features. The style can depend on the feature's properties.
   *
   * @returns The builder instance for chaining.
   */
  withStyle(): this {
    this.options['style'] = this.styleFunction.bind(this);
    return this;
  }

  /**
   * Generates the style for a GeoJSON feature based on its properties.
   *
   * @param feature - The GeoJSON feature to style.
   * @returns A `GeoJsonProperties` object representing the Leaflet path options for the feature.
   */
  private styleFunction(feature: Feature): GeoJsonProperties {
    return {
      ...this.getDefaultPathOptions(),
      ...LeafletOptionsBuilder.getGeoProperties(feature)
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
  getDefaultPointMarker(latlng): CircleMarker {
    return circleMarker(latlng, this.getDefaultPathOptions());
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
    let popupContent = feature.properties[GeoProperties.FIGURE_POPUP_CONTENT]?.value;
    if (!popupContent) {
      popupContent = this.getDefaultPopupContent(feature);
    }
    layer.bindPopup(popupContent);

    const tooltip = feature.properties[GeoProperties.FIGURE_TOOLTIP]?.value;
    if (tooltip) {
      layer.bindTooltip(tooltip);
    }

    const { onFeatureClick } = this.configuration;
    // Attach the click handler if a callback is provided
    if (onFeatureClick) {
      const featureProperties = this.getFeatureProperties(feature);
      const handleClick = () => onFeatureClick(featureProperties);
      layer.on('click', handleClick);
      this.subscriptions.push(() => layer.off('click', handleClick));
    }
  }

  /**
   * Extracts the non-geo properties from a GeoJSON feature. Iterates over the `feature.properties` object and filters out any keys
   * that correspond to geo-related properties defined in {@link GeoProperties}. The remaining properties are returned
   * in a flat key-value map.
   *
   * @param feature - The GeoJSON feature containing `properties`.
   *
   * @returns A record of all non-geo properties, where keys are property names and values are of type {@link BindingValue}.
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
  private getFeatureProperties(feature: Feature): Record<string, BindingValue> {
    return Object.keys(feature.properties ?? {})
      .filter(key => !ObjectUtil.isEnumValue(key, GeoProperties))
      .reduce((acc, key) => {
        acc[key] = feature.properties[key];
        return acc;
      }, {} as Record<string, any>);
  }

  /**
   * Generates the default HTML content for a feature popup.
   *
   * The popup displays all feature property bindings except those defined in {@link GeoProperties}
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
      .filter(key => !ObjectUtil.isEnumValue(key, GeoProperties))
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
   * Returns the default path options used for markers and polygons.
   *
   * @returns A PathOptions object with default color, weight, opacity, and fillOpacity.
   */
  private getDefaultPathOptions(): PathOptions {
    return {
      weight: this.configuration.geoWeight,
      color: this.configuration.geoColor,
      opacity: this.configuration.geoOpacity,
      fillColor: this.configuration.geoFillColor,
      fillOpacity: this.configuration.geoFillOpacity,
    }
  }

  /**
   * Extracts style-related geo properties from a GeoJSON feature.
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
  private static getGeoProperties(feature: Feature): PathOptions {
    return Object.entries(LeafletService.getGeoPropertiesMapping())
      .reduce((geoProperties, [geoKey, targetKey]) => {
        const propertyValue = feature?.properties?.[geoKey]?.value;
        if (propertyValue) {
          geoProperties[targetKey] = propertyValue;
        }
        return geoProperties;
      }, {});
  }
}
