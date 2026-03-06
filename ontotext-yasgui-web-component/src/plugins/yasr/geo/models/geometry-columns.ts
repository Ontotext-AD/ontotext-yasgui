import {GeoSPARQLService} from '../services/geo-sparql-service';

export type GeoDatatype = keyof typeof GeoSPARQLService.SUPPORTED_CONVERSIONS;
export type GeometryColumns = Record<string, GeoDatatype>;
