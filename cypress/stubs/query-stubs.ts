export class QueryStubs {
    static stubDefaultQueryResponse(withDelay: number = 0) {
        cy.intercept('/repositories/test-repo', {fixture: '/queries/default-query-response.json', delay: withDelay}).as('getGuides');
    }
}
