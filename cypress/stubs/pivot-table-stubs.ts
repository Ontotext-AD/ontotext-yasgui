export class PivotTableStubs {

  static stubD3JavaScript() {
    cy.intercept({
      url: 'https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3.min.js'
    }, { fixture: '/pivot-table/d3' })
  }

  static stubJqueryJavaScript() {
    cy.intercept({
      url: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.2/jquery.min.js'
    }, { fixture: '/pivot-table/jquery' })
  }

  static stubJqueryUiJavaScript() {
    cy.intercept({
      url: 'https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js'
    }, { fixture: '/pivot-table/jquery-ui' })
  }

  static stubJsapiJavaScript() {
    cy.intercept({
      url: 'https://www.google.com/jsapi'
    }, { fixture: '/pivot-table/jsapi' })
  }

  static stubLoaderJavaScript() {
    cy.intercept({
      url: 'https://www.gstatic.com/charts/loader.js'
    }, { fixture: '/pivot-table/loader' })
  }

  static stubPivotJavaScript() {
    cy.intercept({
      url: 'https://pivottable.js.org/dist/pivot.js'
    }, { fixture: '/pivot-table/pivot' })
  }
}
