import {GeoStyleOptions} from './geo-style-options';
import {PluginConfiguration} from '../../../../models/plugin-configurations';
import {FeatureClickPayload} from './feature-click-payload';

/**
 * Interface for the Geo plugin configuration.
 */
export interface GeoPluginConfiguration extends PluginConfiguration {
  defaultGeoStyleOptions?: GeoStyleOptions;
  /**
   * Callback invoked when a feature is clicked.
   * Receives the feature properties excluding geo-related fields.
   *
   * @param featureProperties - The non-geo properties of the clicked feature.
   */
  onFeatureClick?: (featureProperties: FeatureClickPayload) => void;
}
