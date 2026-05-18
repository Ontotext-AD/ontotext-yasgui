import {YasrGeoPluginPageSteps} from '../../../../steps/pages/yasr-geo-plugin-page-steps';
import {YasqeSteps} from '../../../../steps/yasqe-steps';
import {YasrSteps} from '../../../../steps/yasr-steps';
import {GeoPluginSteps} from '../../../../steps/geo-plugin-steps';
import {QueryStubs} from '../../../../stubs/query-stubs';

describe('Geo Plugin Parsers', () => {

  it('should render geo features from GeoJSON literal (geoJSONLiteral) datatype', () => {
    // GIVEN: I visit the geo plugin page.
    YasrGeoPluginPageSteps.visit();
    // AND: The query returns data with geoJSONLiteral datatype.
    QueryStubs.stubGeoJsonLiteralResponse();

    // WHEN: I execute a query and open the geo tab.
    YasqeSteps.executeQuery();
    YasrSteps.openGeoPluginTab();

    // THEN: I should see the geo features on the map.
    // Point → circle marker + LineString → 1 path + Polygon → 1 path = 3 features
    GeoPluginSteps.getAllGeoFeatures().should('have.length', 2);
    GeoPluginSteps.getAllMarkers().should('have.length', 1);
  });

  it('should render geo features from GML literal (gmlLiteral) datatype', () => {
    // GIVEN: I visit the geo plugin page.
    YasrGeoPluginPageSteps.visit();
    // AND: The query returns data with gmlLiteral datatype.
    QueryStubs.stubGeoGmlLiteralResponse();

    // WHEN: I execute a query and open the geo tab.
    YasqeSteps.executeQuery();
    YasrSteps.openGeoPluginTab();

    // THEN: I should see the geo features on the map (Point + LineString + Polygon = 3 features).
    GeoPluginSteps.getAllGeoFeatures().should('have.length', 2);
    GeoPluginSteps.getAllMarkers().should('have.length', 1);
  });

  it('should render geo features from KML literal (kmlLiteral) datatype', () => {
    // GIVEN: I visit the geo plugin page.
    YasrGeoPluginPageSteps.visit();
    // AND: The query returns data with kmlLiteral datatype.
    QueryStubs.stubGeoKmlLiteralResponse();

    // WHEN: I execute a query and open the geo tab.
    YasqeSteps.executeQuery();
    YasrSteps.openGeoPluginTab();

    // THEN: I should see the geo features on the map (Point + LineString + Polygon = 3 features).
    GeoPluginSteps.getAllGeoFeatures().should('have.length', 2);
    GeoPluginSteps.getAllMarkers().should('have.length', 1);
  });

  it('should render geo features from DGGS H3 literal (dggsLiteral) datatype', () => {
    // GIVEN: I visit the geo plugin page.
    YasrGeoPluginPageSteps.visit();
    // AND: The query returns data with dggsLiteral (H3) datatype.
    QueryStubs.stubGeoDggsLiteralResponse();

    // WHEN: I execute a query and open the geo tab.
    YasqeSteps.executeQuery();
    YasrSteps.openGeoPluginTab();

    // THEN: I should see geo features on the map.
    // CELL → Point (circle marker) = 1 + CELLLIST → MultiPolygon polygons
    GeoPluginSteps.getAllGeoFeatures().should('have.length', 1);
    GeoPluginSteps.getAllMarkers().should('have.length', 1);
  });

  it('should render geo features from GeoCode literal (geoCodeLiteral) datatype', () => {
    // GIVEN: I visit the geo plugin page.
    YasrGeoPluginPageSteps.visit();
    // AND: The query returns data with geoCodeLiteral datatype (OpenLocationCode, GeoURI, GeoHash).
    QueryStubs.stubGeoCodeLiteralResponse();

    // WHEN: I execute a query and open the geo tab.
    YasqeSteps.executeQuery();
    YasrSteps.openGeoPluginTab();

    // THEN: I should see one point marker per geocode entry (3 entries = 3 circle markers).
    GeoPluginSteps.getAllGeoFeatures().should('have.length', 0);
    GeoPluginSteps.getAllMarkers().should('have.length', 3);
  });

  it('should render geo features from WKT literals with SRID prefixes (CRS84, EPSG:4326, other EPSG)', () => {
    // GIVEN: I visit the geo plugin page.
    YasrGeoPluginPageSteps.visit();
    // AND: The query returns data with WKT literals that include SRID prefix annotations.
    QueryStubs.stubGeoWktSridResponse();

    // WHEN: I execute a query and open the geo tab.
    YasqeSteps.executeQuery();
    YasrSteps.openGeoPluginTab();

    // THEN: All three points should be rendered regardless of their SRID prefix (CRS84, EPSG:4326, EPSG:3857).
    GeoPluginSteps.getAllGeoFeatures().should('have.length', 0);
    GeoPluginSteps.getAllMarkers().should('have.length', 3);
  });

  it('should render geo features from VirtRDF Geometry (virtrdf#Geometry) datatype', () => {
    // GIVEN: I visit the geo plugin page.
    YasrGeoPluginPageSteps.visit();
    // AND: The query returns data with virtrdf#Geometry datatype.
    QueryStubs.stubGeoVirtRdfResponse();

    // WHEN: I execute a query and open the geo tab.
    YasqeSteps.executeQuery();
    YasrSteps.openGeoPluginTab();

    // THEN: I should see the geo features on the map (Point + LineString = 2 features).
    GeoPluginSteps.getAllGeoFeatures().should('have.length', 1);
    GeoPluginSteps.getAllMarkers().should('have.length', 1);
  });

  it('should render geo features from DGGS H3 literal without a URI prefix (bare CELL/CELLLIST syntax)', () => {
    // GIVEN: I visit the geo plugin page.
    YasrGeoPluginPageSteps.visit();
    // AND: The query returns dggsLiteral values that have no <https://h3geo.org/res/N> URI prefix –
    // just bare CELL('...') / CELLLIST('...' '...') syntax.
    // The fixture includes:
    //   - a bare CELL (Point)
    //   - a comma-separated CELLLIST (MultiPolygon)
    //   - a whitespace-separated CELLLIST (MultiPolygon) – exercises the normalization step
    QueryStubs.stubGeoDggsNoPrefixResponse();

    // WHEN: I execute a query and open the geo tab.
    YasqeSteps.executeQuery();
    YasrSteps.openGeoPluginTab();

    // THEN: All three entries should be rendered on the map (1 Point + 2 MultiPolygons).
    GeoPluginSteps.getAllGeoFeatures().should('have.length.at.least', 2);
    GeoPluginSteps.getAllMarkers().should('have.length', 1);
  });

  it('should render GeoURI points with RFC 5870 parameters and skip entries with invalid coordinates', () => {
    // GIVEN: I visit the geo plugin page.
    YasrGeoPluginPageSteps.visit();
    // AND: The query returns four GeoURI geoCodeLiteral entries:
    //   1. geo:43.8356,25.9657;u=10;crs=wgs84  – valid coords with RFC 5870 parameters (should render)
    //   2. geo:43.8356,25.9657,150             – valid coords with altitude (should render)
    //   3. geo:43.8,abc                        – invalid longitude (NaN) (should be skipped → null)
    //   4. geo:43.8356,25.9657,abc             – invalid altitude (NaN) (should be skipped → null)
    QueryStubs.stubGeoGeoUriEdgeCasesResponse();

    // WHEN: I execute a query and open the geo tab.
    YasqeSteps.executeQuery();
    YasrSteps.openGeoPluginTab();

    // THEN: Only the two valid points should be rendered; the NaN-coordinate entry is silently skipped.
    GeoPluginSteps.getAllGeoFeatures().should('have.length', 0);
    GeoPluginSteps.getAllMarkers().should('have.length', 2);
  });

  it('should skip invalid WKT and render only valid WKT features', () => {
    // GIVEN: I visit the geo plugin page.
    YasrGeoPluginPageSteps.visit();
    // AND: The query returns two wktLiteral entries – one malformed and one valid.
    QueryStubs.stubGeoInvalidWktResponse();

    // WHEN: I execute a query and open the geo tab.
    YasqeSteps.executeQuery();
    YasrSteps.openGeoPluginTab();

    // THEN: Only the valid WKT point should be rendered; the malformed one is silently skipped.
    GeoPluginSteps.getAllGeoFeatures().should('have.length', 0);
    GeoPluginSteps.getAllMarkers().should('have.length', 1);
    // AND: A warning should be displayed indicating that some geometries could not be rendered.
    GeoPluginSteps.getWarningMessage().should('contain', 'Some geometries could not be rendered due to invalid format.');
  });

  it('should display a warning and render no features when all WKT geometries are invalid', () => {
    // GIVEN: I visit the geo plugin page.
    YasrGeoPluginPageSteps.visit();
    // AND: The query returns only invalid wktLiteral entries.
    QueryStubs.stubGeoAllInvalidWktResponse();

    // WHEN: I execute a query and open the geo tab (no wait – all results will be invalid).
    YasqeSteps.executeQueryWithoutWaitResult();
    YasrSteps.openGeoPluginTab();

    // THEN: No features should be rendered on the map.
    GeoPluginSteps.getAllGeoFeatures().should('have.length', 0);
    GeoPluginSteps.getAllMarkers().should('have.length', 0);
    // AND: A warning should be displayed indicating that no valid geometries were found.
    GeoPluginSteps.getWarningMessage().should('contain', 'No valid geometries found in the results.');
  });

  it('should render only the valid feature when some binding rows are missing the geo column', () => {
    // GIVEN: I visit the geo plugin page.
    YasrGeoPluginPageSteps.visit();
    // AND: The query returns three rows but only one has a location binding (the other two have no geo value).
    QueryStubs.stubGeoSparseBindingResponse();

    // WHEN: I execute a query and open the geo tab.
    YasqeSteps.executeQuery();
    YasrSteps.openGeoPluginTab();

    // THEN: Only the one row with a valid binding should be rendered on the map.
    GeoPluginSteps.getAllGeoFeatures().should('have.length', 0);
    GeoPluginSteps.getAllMarkers().should('have.length', 1);
    // AND: A warning should not be shown even though two out of three rows had no geometry value.
    GeoPluginSteps.getWarningMessage().should('not.exist');
  });

  it('should render a geo feature from a full KML document (input already contains <kml> root)', () => {
    // GIVEN: I visit the geo plugin page.
    YasrGeoPluginPageSteps.visit();
    // AND: The query returns a kmlLiteral whose value is a complete KML document
    // (starts with <kml ...>), exercising the branch where no wrapping is applied.
    QueryStubs.stubGeoKmlFullDocumentResponse();

    // WHEN: I execute a query and open the geo tab.
    YasqeSteps.executeQuery();
    YasrSteps.openGeoPluginTab();

    // THEN: The single point inside the full KML document should be rendered.
    GeoPluginSteps.getAllGeoFeatures().should('have.length', 0);
    GeoPluginSteps.getAllMarkers().should('have.length', 1);
  });

  it('should render a GeometryCollection when a single KML binding contains multiple features', () => {
    // GIVEN: I visit the geo plugin page.
    YasrGeoPluginPageSteps.visit();
    // AND: The query returns a single kmlLiteral binding that contains three Placemarks
    // (2 Points + 1 LineString), exercising the GeometryCollection code path.
    QueryStubs.stubGeoKmlMultiFeatureResponse();

    // WHEN: I execute a query and open the geo tab.
    YasqeSteps.executeQuery();
    YasrSteps.openGeoPluginTab();

    // THEN: All geometries inside the GeometryCollection should be rendered on the map
    // (2 circle markers for the Points + 1 path for the LineString = 3 features).
    GeoPluginSteps.getAllGeoFeatures().should('have.length', 1);
    GeoPluginSteps.getAllMarkers().should('have.length', 2);
  });

  it('should render no features when a KML binding produces zero GeoJSON features', () => {
    // GIVEN: I visit the geo plugin page.
    YasrGeoPluginPageSteps.visit();
    // AND: The query returns a kmlLiteral whose KML document has no Placemarks,
    // so kmlToGeoJSON returns a FeatureCollection with an empty features array.
    QueryStubs.stubGeoKmlEmptyResponse();

    // WHEN: I execute a query and open the geo tab (no wait – result will fall back).
    YasqeSteps.executeQueryWithoutWaitResult();
    YasrSteps.openGeoPluginTab();

    // THEN: No features should be rendered on the map.
    GeoPluginSteps.getAllGeoFeatures().should('have.length', 0);
    GeoPluginSteps.getAllMarkers().should('have.length', 0);
  });

  it('should render a geo feature from a GeoHash-36 (geoCodeLiteral) value', () => {
    // GIVEN: I visit the geo plugin page.
    YasrGeoPluginPageSteps.visit();
    // AND: The query returns a geoCodeLiteral with the GeoHash-36 URI scheme.
    QueryStubs.stubGeoGeoHash36Response();

    // WHEN: I execute a query and open the geo tab.
    YasqeSteps.executeQuery();
    YasrSteps.openGeoPluginTab();

    // THEN: The decoded GeoHash-36 point should be rendered on the map.
    GeoPluginSteps.getAllGeoFeatures().should('have.length', 0);
    GeoPluginSteps.getAllMarkers().should('have.length', 1);
  });

  it('should render no features for an unsupported geocode URI scheme or a GeoURI with wrong component count', () => {
    // GIVEN: I visit the geo plugin page.
    YasrGeoPluginPageSteps.visit();
    // AND: The query returns two geoCodeLiteral entries that cannot be decoded:
    //   1. An unknown geocode URI (falls through all branches → null).
    //   2. A GeoURI with only one coordinate component (invalid, guard returns null).
    QueryStubs.stubGeoCodeUnsupportedResponse();

    // WHEN: I execute a query and open the geo tab (no wait – result will fall back).
    YasqeSteps.executeQueryWithoutWaitResult();
    YasrSteps.openGeoPluginTab();

    // THEN: No features should be rendered on the map.
    GeoPluginSteps.getAllGeoFeatures().should('have.length', 0);
    GeoPluginSteps.getAllMarkers().should('have.length', 0);
  });

  it('should render no features for a dggsLiteral with an unsupported (non-H3) URI prefix', () => {
    // GIVEN: I visit the geo plugin page.
    YasrGeoPluginPageSteps.visit();
    // AND: The query returns a dggsLiteral whose URI prefix is not an H3 resolution URI,
    // so parseDGGS returns null and the entry is silently skipped.
    QueryStubs.stubGeoDggsUnsupportedUriResponse();

    // WHEN: I execute a query and open the geo tab (no wait – result will fall back).
    YasqeSteps.executeQueryWithoutWaitResult();
    YasrSteps.openGeoPluginTab();

    // THEN: No features should be rendered on the map.
    GeoPluginSteps.getAllGeoFeatures().should('have.length', 0);
    GeoPluginSteps.getAllMarkers().should('have.length', 0);
  });

  it('should skip malformed geoJSONLiteral and render only valid GeoJSON features', () => {
    // GIVEN: I visit the geo plugin page.
    YasrGeoPluginPageSteps.visit();
    // AND: The query returns two geoJSONLiteral entries – one with invalid JSON and one valid Point.
    QueryStubs.stubGeoInvalidGeoJsonResponse();

    // WHEN: I execute a query and open the geo tab.
    YasqeSteps.executeQuery();
    YasrSteps.openGeoPluginTab();

    // THEN: Only the valid GeoJSON point should be rendered; the malformed JSON entry is silently skipped.
    GeoPluginSteps.getAllGeoFeatures().should('have.length', 0);
    GeoPluginSteps.getAllMarkers().should('have.length', 1);
  });

  it('should gracefully handle malformed URI prefixes without throwing and render no features', () => {
    // GIVEN: I visit the geo plugin page.
    YasrGeoPluginPageSteps.visit();
    // AND: The query returns literals whose angle-bracket URI prefix is malformed:
    //   - a dggsLiteral where the '<' has no matching '>' (unclosed bracket)
    //   - a geoCodeLiteral where the '<' also has no matching '>' (unclosed bracket),
    //     so extractUriPrefix falls back to {uri: '', value: input} and no branch matches.
    QueryStubs.stubGeoMalformedPrefixResponse();

    // WHEN: I execute a query and open the geo tab.
    YasqeSteps.executeQueryWithoutWaitResult();
    YasrSteps.openGeoPluginTab();

    // THEN: The map should render no features (the malformed literals are silently skipped)
    // and no uncaught error should crash the page.
    GeoPluginSteps.getAllGeoFeatures().should('have.length', 0);
    GeoPluginSteps.getAllMarkers().should('have.length', 0);
  });

  it('should render geo features when result contains multiple geometry columns', () => {
    // GIVEN: I visit the geo plugin page.
    YasrGeoPluginPageSteps.visit();
    // AND: The query returns data with two geometry columns (primaryLocation and secondaryLocation).
    QueryStubs.stubGeoMultiColumnResponse();

    // WHEN: I execute a query and open the geo tab.
    YasqeSteps.executeQuery();
    YasrSteps.openGeoPluginTab();

    // THEN: Features from both geometry columns should be rendered on the map.
    // 2 rows × 2 geometry columns = 4 circle markers
    GeoPluginSteps.getAllGeoFeatures().should('have.length', 0);
    GeoPluginSteps.getAllMarkers().should('have.length', 4);
  });
});
