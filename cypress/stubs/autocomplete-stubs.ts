export class AutocompleteStubs {
  static stubNamespacesResponse(withDelay: number = 0) {
    cy.intercept('*/repositories/test-repo/namespaces', {
      fixture: '/namespaces/namespaces-response.json',
      delay: withDelay
    }).as('getNamespaces');
  }

  static stubLocalNamesResponse() {
    cy.intercept({
      url: /^https:\/\/lov\.linkeddata.es\/.*$/
    }, { fixture: '/namespaces/local-names-response.json' })
  }
}
