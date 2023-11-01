export class ChartsStubs {

  static stubLoader() {
    cy.intercept({
      url: 'https://www.gstatic.com/charts/loader.js'
    }, {fixture: '/charts/loader'})
  }

  static stub_jsapi_compiled_annotatedtimeline_module() {
    cy.intercept({
      url: 'https://www.gstatic.com/charts/51/js/jsapi_compiled_annotatedtimeline_module.js'
    }, {fixture: '/charts/jsapi_compiled_annotatedtimeline_module'})
  }

  static stub_jsapi_compiled_annotationchart_module() {
    cy.intercept({
      url: 'https://www.gstatic.com/charts/51/js/jsapi_compiled_annotationchart_module.js'
    }, {fixture: '/charts/jsapi_compiled_annotationchart_module'})
  }

  static stub_jsapi_compiled_charteditor_module() {
    cy.intercept({
      url: 'https://www.gstatic.com/charts/51/js/jsapi_compiled_charteditor_module.js'
    }, {fixture: '/charts/jsapi_compiled_charteditor_module'})
  }

  static stub_jsapi_compiled_controls_module() {
    cy.intercept({
      url: 'https://www.gstatic.com/charts/51/js/jsapi_compiled_controls_module.js'
    }, {fixture: '/charts/jsapi_compiled_controls_module'})
  }

  static stub_jsapi_compiled_corechart_module() {
    cy.intercept({
      url: 'https://www.gstatic.com/charts/51/js/jsapi_compiled_corechart_module.js'
    }, {fixture: '/charts/jsapi_compiled_corechart_module'})
  }

  static stub_jsapi_compiled_default_module() {
    cy.intercept({
      url: 'https://www.gstatic.com/charts/51/js/jsapi_compiled_default_module.js'
    }, {fixture: '/charts/jsapi_compiled_default_module'})
  }

  static stub_jsapi_compiled_flashui_module() {
    cy.intercept({
      url: 'https://www.gstatic.com/charts/51/js/jsapi_compiled_flashui_module.js'
    }, {fixture: '/charts/jsapi_compiled_flashui_module'})
  }

  static stub_jsapi_compiled_gauge_module() {
    cy.intercept({
      url: 'https://www.gstatic.com/charts/51/js/jsapi_compiled_gauge_module.js'
    }, {fixture: '/charts/jsapi_compiled_gauge_module'})
  }

  static stub_jsapi_compiled_geo_module() {
    cy.intercept({
      url: 'https://www.gstatic.com/charts/51/js/jsapi_compiled_geo_module.js'
    }, {fixture: '/charts/jsapi_compiled_geo_module'})
  }

  static stub_jsapi_compiled_geochart_module() {
    cy.intercept({
      url: 'https://www.gstatic.com/charts/51/js/jsapi_compiled_geochart_module.js'
    }, {fixture: '/charts/jsapi_compiled_geochart_module'})
  }

  static stub_jsapi_compiled_graphics_module() {
    cy.intercept({
      url: 'https://www.gstatic.com/charts/51/js/jsapi_compiled_graphics_module.js'
    }, {fixture: '/charts/jsapi_compiled_graphics_module'})
  }

  static stub_jsapi_compiled_imagechart_module() {
    cy.intercept({
      url: 'https://www.gstatic.com/charts/51/js/jsapi_compiled_imagechart_module.js'
    }, {fixture: '/charts/jsapi_compiled_imagechart_module'})
  }

  static stub_jsapi_compiled_motionchart_module() {
    cy.intercept({
      url: 'https://www.gstatic.com/charts/51/js/jsapi_compiled_motionchart_module.js'
    }, {fixture: '/charts/jsapi_compiled_motionchart_module'})
  }

  static stub_jsapi_compiled_orgchart_module() {
    cy.intercept({
      url: 'https://www.gstatic.com/charts/51/js/jsapi_compiled_orgchart_module.js'
    }, {fixture: '/charts/jsapi_compiled_orgchart_module'})
  }

  static stub_jsapi_compiled_table_module() {
    cy.intercept({
      url: 'https://www.gstatic.com/charts/51/js/jsapi_compiled_table_module.js'
    }, {fixture: '/charts/jsapi_compiled_table_module'})
  }

  static stub_jsapi_compiled_ui_module() {
    cy.intercept({
      url: 'https://www.gstatic.com/charts/51/js/jsapi_compiled_ui_module.js'
    }, {fixture: '/charts/jsapi_compiled_ui_module'})
  }
}
