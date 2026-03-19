import {circleMarker, CircleMarker, GeoJSONOptions, LatLng, Layer} from 'leaflet';
import {Feature} from 'geojson';
import {BindingValue} from '../../../../models/yasgui/parser';
import {ObjectUtil} from '../../../../services/utils/object-util';
import {GeoProperties} from '../models/geo-properties';
import {GeoPluginConfiguration} from '../models/geo-plugin-configuration';
import {LeafletService} from './leaflet-service';
import {GeoStyleOptions} from "../models/geo-style-options";

/**
 * Builder class for constructing Leaflet GeoJSON options with customizable point markers,
 * feature click handlers, and styling.
 */
export class GeoJsonOptionsBuilder {
  private static readonly MAX_POPUP_CONTENT_LINE_LENGTH = 120;
  /**
   * Internal storage for the GeoJSON options being built
   */
  private options: GeoJSONOptions = {};

  private configuration: GeoPluginConfiguration;

  constructor(configuration: GeoPluginConfiguration) {
    this.configuration = configuration;
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
      ...GeoJsonOptionsBuilder.getGeoStyleOptions(feature)
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
    let popupContent = feature.properties[GeoProperties.FIGURE_POPUP_CONTENT]?.value;
    if (!popupContent) {
      popupContent = this.getDefaultPopupContent(feature);
    }
    layer.bindPopup(popupContent);

    const tooltip = feature.properties[GeoProperties.FIGURE_TOOLTIP]?.value;
    if (tooltip) {
      layer.bindTooltip(tooltip);
    }

    // TODO: Register a click event handler that notifies external components when a feature is clicked.
    //  Investigate the correct way to deregister it when the plugin is destroyed.
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
        const truncated = value.length > GeoJsonOptionsBuilder.MAX_POPUP_CONTENT_LINE_LENGTH
          ? value.slice(0, GeoJsonOptionsBuilder.MAX_POPUP_CONTENT_LINE_LENGTH) + '...'
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
    if (!feature || !feature.properties) {
      return {} as GeoStyleOptions;
    }

    return Object.entries(LeafletService.getGeoOptionsMapping())
      .filter(([geoKey]) => {
        const propVal = feature.properties[geoKey]?.value;
        return propVal !== undefined && propVal !== null;
      })
      .reduce((geoProperties: Record<string, unknown>, [geoKey, targetKey]) => {
        const rawValue = feature.properties[geoKey as GeoProperties].value;
        geoProperties[targetKey] = LeafletService.castGeoStyleValue(targetKey, rawValue);
        return geoProperties;
    }, {} as GeoStyleOptions);
  }
}
