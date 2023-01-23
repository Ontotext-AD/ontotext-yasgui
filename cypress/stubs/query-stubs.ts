export class QueryStubs {
    static stubDefaultQueryResponse(withDelay: number = 0) {
        QueryStubs.stubQueryResponse('/queries/default-query-response.json', 'getDefaultQueryResponse', withDelay);
    }

    static stubEmptyQueryResponse(withDelay: number = 0) {
        QueryStubs.stubQueryResponse('/queries/empty-query-response.json', 'getEmptyResponse', withDelay);
    }

    static stubQueryResponse(fixture: string, alias: string, withDelay: number = 0) {
        cy.intercept('/repositories/test-repo', {fixture, delay: withDelay}).as(alias);
    }
}
