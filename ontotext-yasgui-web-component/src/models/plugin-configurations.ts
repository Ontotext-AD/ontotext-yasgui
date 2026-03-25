/**
 * An object containing the configuration for each plugin.
 *
 * - **Keys**: plugin names (e.g., `"geo"`)
 * - **Values**: corresponding plugin configuration objects
 *
 * Example: Geo plugin
 * This plugin extends the original YASGUI plugin with the ability to display geographical data.
 * ```ts
 * const externalPluginsConfigurations: PluginsConfigurations = {
 *   geo: {
 *     defaultGeoStyleOptions: {
 *       // Width of the geo feature line. Default value is 3.
 *       geoWeight?: number,
 *       // Color of the geo feature line. Default value is '#3388ff'.
 *       geoColor?: string,
 *       // Opacity of the geo feature line. Must be between 0 and 1.
 *       geoOpacity?: number,
 *       // Fill color of polygon features. Default value is '#3388ff'.
 *       geoFillColor?: string,
 *       // Fill opacity of polygon features. Must be between 0 and 1.
 *       geoFillOpacity?: number,
 *     }
 *   }
 * }
 * ```
 *
 * This type allows plugins to define their specific configuration while keeping all configurations grouped in
 * a single object.
 */
export type PluginConfigurations = Record<string, PluginConfiguration>;

/**
 * Represents a single plugin's configuration.
 * The structure depends on the plugin; for example, the Geo plugin uses `defaultGeoStyleOptions` as shown above.
 */
export type PluginConfiguration = Record<string, any>;
