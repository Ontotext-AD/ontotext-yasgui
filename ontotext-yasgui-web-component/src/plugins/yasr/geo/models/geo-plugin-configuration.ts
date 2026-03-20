/**
 * Interface for the Geo plugin configuration objects.
 */
export interface GeoPluginConfiguration {
  /**
   * Width of the feature line.
   */
  geoWeight?: number;
  /**
   * Color of the feature line.
  */
  geoColor?: string;

  /**
   * Opacity of the feature line, the value must be between 0 and 1.
  */
  geoOpacity?: number;

  /**
   * Fill color of polygon features.
  */
  geoFillColor?: string;

  /**
   * Fill opacity of polygon features, the value must be between 0 and 1.
  */
  geoFillOpacity?: number;

  /**
   * Callback invoked when a feature is clicked.
   * Receives the feature properties excluding geo-related fields.
   *
   * @param featureProperties - The non-geo properties of the clicked feature.
   */
  onFeatureClick?: (featureProperties: Record<string, any>) => void;
}
