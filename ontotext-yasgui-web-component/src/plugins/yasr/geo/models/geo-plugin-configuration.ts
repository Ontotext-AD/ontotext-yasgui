import {GeoStyleOptions} from './geo-style-options';
import {PluginConfiguration} from '../../../../models/plugin-configurations';

/**
 * Interface for the Geo plugin configuration.
 */
export interface GeoPluginConfiguration extends PluginConfiguration {
  defaultGeoStyleOptions?: GeoStyleOptions;
}
