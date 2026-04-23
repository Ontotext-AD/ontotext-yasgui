import {SanitizeGeoBindingValuesPageSteps} from '../../../../steps/pages/sanitize-geo-binding-values-page-steps';
import {GeoPluginSteps} from '../../../../steps/geo-plugin-steps';
import {YasqeSteps} from '../../../../steps/yasqe-steps';
import {YasrSteps} from '../../../../steps/yasr-steps';

describe('Sanitize Geo Binding Values', () => {
  beforeEach(() => {
    SanitizeGeoBindingValuesPageSteps.visit();
  });

  it('should sanitize geo binding values', () => {
    // WHEN: I execute a query and open Geo plugin.
    YasqeSteps.executeQuery();
    YasrSteps.openGeoPluginTab();

    // THEN: I expect correct number of features and markers are rendered
    GeoPluginSteps.getAllGeoFeatures().should('have.length', 2);
    GeoPluginSteps.getAllMarkers().should('have.length', 12);

    // AND: I expect the width to be set to the geo_weight binding value because "2.5" is a valid number.
    GeoPluginSteps.getGeoFeature(0)
      .should('have.attr', 'stroke-width', '2.5');

    // AND: I expect the width to be set to the default value, because the geo_weight binding value "abc" is not valid number.
    GeoPluginSteps.getGeoFeature(1)
      .should('have.attr', 'stroke-width', '3');

    // AND: I expect the color to be set to the geo_color binding value because "#1a2b3c" is a valid value.
    GeoPluginSteps.getMarkerIcon(0)
      .should('have.attr', 'style')
      .and('include', 'color: #1a2b3c;');

    // AND: I expect the color to be set to the default value, because the geo_color binding value "expression(alert(1))" is not valid number.
    GeoPluginSteps.getMarkerIcon(1)
      .should('have.attr', 'style')
      .and('include', 'color: #3388ff;');

    // AND: I expect the color to be set to the geo_color binding value because "rgb(255, 0, 128)" is a valid value.
    GeoPluginSteps.getMarkerIcon(2)
      .should('have.attr', 'style')
      .and('include', 'color: rgb(255, 0, 128);');

    // AND: I expect the opacity to be set to 1, because the geo_opacity value "5" is out of range.
    GeoPluginSteps.getMarkerIcon(3)
      .should('have.attr', 'style')
      .and('include', 'opacity: 1;');

    // AND: I expect the opacity to be set to 0, because the geo_opacity value "-0.5" is out of range.
    GeoPluginSteps.getMarkerIcon(4)
      .should('have.attr', 'style')
      .and('include', 'opacity: 0;');

    // AND: I expect the opacity to be set to the geo_opacity binding value, because "0.7" is within the valid range.
    GeoPluginSteps.getMarkerIcon(5)
      .should('have.attr', 'style')
      .and('include', 'opacity: 0.7;');

    // AND: I expect only "valid-class" and "ri-home-smile-line" are applied as icon classes.
    // AND: invalid class value "invalid@class" from geo_markerClass is filtered out as it is not a valid CSS class.
    GeoPluginSteps.getMarkerIcon(6)
      .should('have.attr', 'class')
      .and('include', 'valid-class ri-home-smile-line');

    // AND: I expect an <img> marker to be rendered for the PNG from geo_markerUrl because it is safe.
    GeoPluginSteps.getMarkerImageBySrc('https://example.com/icon.png').should('be.visible');

    // AND: I expect the SVG marker is rejected due to unsafe content
    GeoPluginSteps.getMarkerImageBySrc('https://example.com/file.svg').should('not.exist');

    // AND: I expect the javascript URLs are rejected as invalid marker sources
    GeoPluginSteps.getMarkerImageBySrc('javascript:alert(1)').should('not.exist');

    // WHEN: I click on a marker with injected content
    GeoPluginSteps.clickMarker(10);

    // THEN: I expect popup content to be sanitized and unsafe scripts removed
    GeoPluginSteps.getLeafletPopupContent().should('have.html', '<div style="color: red">Content</div><button>Click me</button>');

    // WHEN: I hover a marker with unsafe tooltip content
    GeoPluginSteps.hoverMarker(11);

    // THEN: tooltip content is sanitized and safe content is rendered
    GeoPluginSteps.getTooltip().should('contain.html', 'Tooltip');
  });
});
