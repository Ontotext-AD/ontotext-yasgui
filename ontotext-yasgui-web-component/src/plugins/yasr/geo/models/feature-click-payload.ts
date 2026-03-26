import {GeoPropertyKey} from './geo-sparql-variable';

type FeatureBindingValue = { value: unknown };

/**
 * Represents the payload emitted when a user clicks on a map feature.
 *
 * This type contains the feature's properties derived from query bindings (e.g., SPARQL results),
 * where each property is wrapped in a binding object.
 *
 * - All keys are dynamic and correspond to variables returned in the query result.
 * - Reserved `geo_*` properties (defined by {@link GeoPropertyKey}) are explicitly excluded, as they are used
 * internally to control map rendering (e.g., styling, popups, tooltips) and should not be exposed in
 * user-facing event data.
 */
export type FeatureClickPayload = Record<string, FeatureBindingValue> & {
  [K in GeoPropertyKey]?: never;
};
