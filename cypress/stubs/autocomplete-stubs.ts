const LOV_URL = /^https:\/\/lov\.linkeddata.es\/.*$/;

export class AutocompleteStubs {
  static stubNamespacesResponse(withDelay: number = 0) {
    cy.intercept('*/repositories/test-repo/namespaces', {
      fixture: '/namespaces/namespaces-response.json',
      delay: withDelay
    }).as('getNamespaces');
  }

  static stubSesamePrefixesResponse() {
    cy.intercept({
      url: LOV_URL
    }, { fixture: '/namespaces/sesame-prefixes-response.json' })
  }

  static stubLocalNamesResponse() {
    cy.intercept({
      url: LOV_URL
    }, { fixture: '/namespaces/local-names-response.json' })
  }

  static stubLovNoSuggestions() {
    cy.intercept({
      url: LOV_URL
    }, { statusCode: 404 }).as('getLovSuggestions');
  }

  static stubLovError() {
    cy.intercept({
      url: LOV_URL
    }, { statusCode: 500 }).as('getLovSuggestions');
  }
}
