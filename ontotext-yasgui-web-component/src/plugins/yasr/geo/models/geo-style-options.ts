import { PathOptions} from 'leaflet';

export type GeoStyleOptionKeys = 'weight' | 'opacity' | 'fillOpacity' | 'color' | 'fillColor';
export type GeoStyleOptions = Pick<PathOptions, GeoStyleOptionKeys>;
