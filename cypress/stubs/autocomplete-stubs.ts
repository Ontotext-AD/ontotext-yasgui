export class AutocompleteStubs {
  static stubNamespacesResponse(withDelay: number = 0) {
    cy.intercept('*/repositories/test-repo/namespaces', {
      fixture: '/namespaces/namespaces-response.json',
      delay: withDelay
    }).as('getNamespaces');
  }

  static stubSesamePrefixesResponse() {
    cy.intercept({
      url: /^https:\/\/lov\.linkeddata.es\/.*$/
    }, { fixture: '/namespaces/sesame-prefixes-response.json' })
  }

  static stubLocalNamesResponse() {
    cy.intercept({
      url: /^https:\/\/lov\.linkeddata.es\/.*$/
    }, { fixture: '/namespaces/local-names-response.json' })
  }
}
