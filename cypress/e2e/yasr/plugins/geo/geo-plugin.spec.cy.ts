import {YasrGeoPluginPageSteps} from '../../../../steps/pages/yasr-geo-plugin-page-steps';
import {YasqeSteps} from '../../../../steps/yasqe-steps';
import {YasrSteps} from '../../../../steps/yasr-steps';
import {GeoPluginSteps} from '../../../../steps/geo-plugin-steps';
import {QueryStubs} from '../../../../stubs/query-stubs';

describe('Geo Plugin', () => {
  it('should be able to display geo plugin', () => {
    // GIVEN: I visit a page containing "ontotex-yasgui-web-component".
    YasrGeoPluginPageSteps.visit();

    // WHEN: I execute a query that returns geo data.
    YasqeSteps.executeQuery();
    // THEN: I should see the geo plugin tab and be able to open it.
    YasrSteps.getGeoPluginTab().should('be.visible');

    // WHEN: I open the geo plugin tab.
    YasrSteps.openGeoPluginTab();
    // THEN: I should see the geo data displayed on the map.
    GeoPluginSteps.getAllGeoFeatures().should('have.length', 10);

    // WHEN: I hover over a geo feature that has the binding variable geo_tooltip.
    GeoPluginSteps.hoverGeoFeature();
    // THEN: I should see the value of the geo_tooltip variable.
    GeoPluginSteps.getTooltip().contains('Simple point tooltip');
    GeoPluginSteps.closeGeoFeaturePopupAndTooltip();

    // WHEN: I click on a geo feature that has the binding variable geo_popup.
    GeoPluginSteps.clickGeoFeature();
    // THEN: I should see the value of the geo_popup variable.
    GeoPluginSteps.getFeaturePopupContent().contains('Simple point popup content');
    GeoPluginSteps.closeGeoFeaturePopupAndTooltip();

    // WHEN: I hover over a geo feature that has no binding variable geo_tooltip.
    GeoPluginSteps.hoverGeoFeature(2);
    // THEN: I should not see any tooltip. The tooltip element exists in the DOM, but it is empty,
    // so we check its text content to ensure that the tooltip does not exist.
    GeoPluginSteps.getTooltip().should('have.text', '');

    // WHEN: I click on a geo feature that has no binding variable geo_popup.
    GeoPluginSteps.clickGeoFeature(2);
    // THEN: I should see the default popup content, which includes all variable bindings except the geo_* variables.
    GeoPluginSteps.getFeaturePopupContent().should('not.contain', 'geo_');
    GeoPluginSteps.getFeaturePopupContent().should('contain', 'featureType');
    // AND: I should see the value of the variable bindings that are not geo_* variables.
    GeoPluginSteps.getFeaturePopupContent().should('contain', 'exampleWKT');
    GeoPluginSteps.closeGeoFeaturePopupAndTooltip();

    // WHEN: I open the control panel.
    GeoPluginSteps.openControlPanel();
    // THEN: I should see the maps we configured.
    GeoPluginSteps.getAllControlPanelMaps().should('have.length', 2);
  });

  it('should display an info message when the Geo plugin is selected and no geo data is returned', () => {
    // GIVEN: I visit a page containing "ontotex-yasgui-web-component" with the Geo plugin selected.
    openGeoPlugin();

    // WHEN: I execute a query that returns no geo data.
    QueryStubs.stubDefaultQueryResponse('yasr-geo-plugin');
    YasqeSteps.executeQueryWithoutWaitResult();

    // THEN: I should see the info message.
    YasrSteps.getFallbackInfo().should('contain', 'Could not render results with the Geo plugin. Please choose another plugin to display the results.');
    // AND: The plugin tabs should be visible.
    YasrSteps.getPluginsButtons().should('be.visible');
  });

  it('should display an info message when the Geo plugin is selected and no data is returned', () => {
    // GIVEN: I visit a page containing "ontotex-yasgui-web-component" with the Geo plugin selected.
    openGeoPlugin();

    // WHEN: I execute a query that returns an empty result.
    QueryStubs.stubEmptyQueryResponse('yasr-geo-plugin');
    YasqeSteps.executeQueryWithoutWaitResult();
    // THEN: I should see the info message.
    YasrSteps.getFallbackInfo().should('contain', 'Could not render results with the Geo plugin. Please choose another plugin to display the results.');
    // AND: The plugin tabs should be visible.
    YasrSteps.getPluginsButtons().should('be.visible');
  });
});

const openGeoPlugin = () => {
  YasrGeoPluginPageSteps.visit();
  YasqeSteps.executeQuery();
  YasrSteps.openGeoPluginTab();
  GeoPluginSteps.getAllGeoFeatures().should('have.length', 10);
};
