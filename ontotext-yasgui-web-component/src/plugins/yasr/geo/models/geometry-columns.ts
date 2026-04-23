import {Parsers} from '../utils/parsers';

export type GeoDatatype = keyof typeof Parsers.SUPPORTED_CONVERSIONS;
export type GeometryColumns = Record<string, GeoDatatype>;
