import {BindingValue} from '../../../../models/yasgui/parser';
import {Parsers} from '../utils/parsers';
import {Geometry} from 'geojson';

/**
 * Service for handling GeoSPARQL literals in SPARQL query results.
 *
 * Supports detection of geometry columns and conversion of GeoSPARQL literals (e.g., WKT, GeoJSON)
 * into GeoJSON Geometry objects.
 */
export class GeoSPARQLService {
  /**
   * Parses a GeoSPARQL literal value into a GeoJSON Geometry object.
   *
   * Looks up the appropriate parser for the given datatype and uses it to convert
   * the raw string value into a GeoJSON Geometry. Returns `null` if the datatype
   * is not supported.
   *
   * @param datatype - The datatype IRI of the GeoSPARQL literal (e.g., WKT or GeoJSON literal type).
   * @param value - The raw string value of the GeoSPARQL literal to parse.
   * @returns A GeoJSON {@link Geometry} object if parsing succeeds, or `null` if the datatype is unsupported.
   */
  static parse(datatype: string, value: string): Geometry | null {
    const parser = Parsers.SUPPORTED_CONVERSIONS[datatype];
    return parser ? parser(value) : null;
  }

  /**
   * Determines whether a SPARQL binding value represents a GeoSPARQL literal.
   *
   * A binding is considered a GeoSPARQL literal if its `datatype` matches one of the supported GeoSPARQL types
   * (WKT or GeoJSON literals).
   *
   * @param bindingValue - The binding value from a SPARQL query result.
   * @returns True if the binding is a recognized GeoSPARQL literal; false otherwise.
   */
  static isGeoSPARQLBinding(bindingValue: BindingValue | undefined): boolean {
    return !!bindingValue?.datatype && bindingValue.datatype in Parsers.SUPPORTED_CONVERSIONS;
  }
}
