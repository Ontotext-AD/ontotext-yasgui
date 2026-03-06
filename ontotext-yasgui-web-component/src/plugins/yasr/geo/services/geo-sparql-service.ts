import { Geometry } from 'geojson';
import { wktToGeoJSON } from 'betterknown';
import proj4 from 'proj4';
import { BindingValue } from '../../../../models/yasgui/parser';
import {ObjectUtil} from '../../../../services/utils/object-util';

/**
 * Service for handling GeoSPARQL literals in SPARQL query results.
 *
 * Supports detection of geometry columns and conversion of GeoSPARQL literals (e.g., WKT, GeoJSON)
 * into GeoJSON Geometry objects.
 */
export class GeoSPARQLService {

  /**
   * The Proj4 instance used for coordinate transformations.
   */
  static proj: any;

  /**
   * SRIDs define the spatial reference system of geometries.
   * Known SRIDs are registered with proj4 to allow accurate coordinate transformations.
   */
  static {
    GeoSPARQLService.proj = proj4;
    for (const [srid, definition] of Object.entries(GeoSPARQLService.getKnownSRIDProjDefinitions())) {
      GeoSPARQLService.proj.defs(`EPSG:${srid}`, definition);
    }
  }

  /**
   * Returns a mapping of well-known SRID codes to their Proj4 definitions.
   *
   * @returns {Record<string, string>} Map of SRID → Proj4 string definition.
   */
  static getKnownSRIDProjDefinitions(): Record<string, string> {
    return {
      // Proj4 defaults to longitude first axis order!!
      '4326': '+proj=longlat +datum=WGS84 +ellps=WGS84 +no_defs',
      // Web Mercator
      '3857': '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0 +x_0=0 +y_0=0 +k=1.0 +units=m +no_defs',
      // Belgium Lambert 1972
      '31370': '+proj=lcc +lat_1=51.166667 +lat_2=49.833333 +lat_0=90 +lon_0=4.367486666666667 +x_0=150000.013 +y_0=5400088.438 +ellps=intl +units=m +no_defs',
      // ETRS89 geographic
      '4258': '+proj=longlat +ellps=GRS80 +no_defs',
      // ETRS89 / LAEA Europe
      '3035': '+proj=laea +lat_0=52 +lon_0=10 +x_0=4321000 +y_0=3210000 +ellps=GRS80 +units=m +no_defs',
      // ETRS89 / UTM zone 32N
      '25832': '+proj=utm +zone=32 +ellps=GRS80 +units=m +no_defs',
      // ETRS89 / UTM zone 33N
      '25833': '+proj=utm +zone=33 +ellps=GRS80 +units=m +no_defs',
    };
  }

  /**
   * Parses a WKT (Well-Known Text) string into a GeoJSON Geometry.
   *
   * WKT is a standard textual representation of geometric objects (Point, LineString, Polygon, MultiPolygon, etc.).
   *
   * @param wkt - A WKT string representing a geometry.
   * @returns A GeoJSON Geometry object.
   */
  static parseWKT(wkt: string): Geometry | null {
    return ObjectUtil.safeParse<Geometry>(() => wktToGeoJSON(wkt, { proj: proj4 }));
  }

  /**
   * Supported GeoSPARQL literal conversions.
   *
   * Maps GeoSPARQL datatype URIs to parsing functions that convert literals into GeoJSON Geometry objects.
   */
  static readonly SUPPORTED_CONVERSIONS: Record<string, (input: string) => Geometry | null> = {
    'http://www.opengis.net/ont/geosparql#wktLiteral': GeoSPARQLService.parseWKT,
    'http://www.openlinksw.com/schemas/virtrdf#Geometry': GeoSPARQLService.parseWKT,
    'http://www.opengis.net/ont/geosparql#geoJSONLiteral': (json) => ObjectUtil.safeParse<Geometry>(() => JSON.parse(json))
  };

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
    return !!bindingValue?.datatype && bindingValue.datatype in GeoSPARQLService.SUPPORTED_CONVERSIONS;
  }
}
