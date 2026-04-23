import {GeoSparqlVariableType} from './geo-sparql-variable';

export type Sanitizer<K extends keyof GeoSparqlVariableType> = (v?: string) => GeoSparqlVariableType[K];
