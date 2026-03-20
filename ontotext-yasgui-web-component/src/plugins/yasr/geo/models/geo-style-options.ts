import {PathOptions} from "leaflet";

const NUMERIC_STYLE_KEYS = ['weight', 'opacity', 'fillOpacity'] as const;
const STRING_STYLE_KEYS = ['color', 'fillColor'] as const;

export const GEO_NUMERIC_STYLE_KEYS = new Set(NUMERIC_STYLE_KEYS as readonly (keyof GeoStyleOptions)[]);
export const GEO_STRING_STYLE_KEYS = new Set(STRING_STYLE_KEYS as readonly (keyof GeoStyleOptions)[]);

type NumericGeoKeys = Pick<PathOptions, typeof NUMERIC_STYLE_KEYS[number]>;
type StringGeoKeys = Pick<PathOptions, typeof STRING_STYLE_KEYS[number]>;

export type GeoStyleOptions = NumericGeoKeys & StringGeoKeys;
