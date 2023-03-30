export class QueryStubs {

  static readonly BASE_TRIPLE_QUERY = 'select (<<?s ?p ?o>> as ?t) {?s ?p ?o}';

  static stubDefaultQueryResponse(withDelay: number = 0) {
    QueryStubs.stubQueryResponse('/queries/default-query-response.json', 'getDefaultQueryResponse', withDelay);
  }

  static stubExplainPlanQueryResponse(withDelay: number = 0) {
    QueryStubs.stubQueryResponse('/queries/explain-plan-query-response.json', 'getExplainPlanQueryQueryResponse', withDelay);
  }

  static stubEmptyQueryResponse(withDelay: number = 0) {
    QueryStubs.stubQueryResponse('/queries/empty-query-response.json', 'getEmptyResponse', withDelay);
  }

  static stubDefaultTripleQueryResponse(withDelay: number = 0) {
    QueryStubs.stubQueryResponse('/queries/default-triple-query-response.json', 'getDefaultTripleQueryResponse', withDelay);
  }

  static stubAskTrueQueryResponse(withDelay: number = 0) {
    QueryStubs.stubQueryResponse('/queries/ask-true-query-response.json', 'askTrueQueryResponse', withDelay);
  }

  static stubAskFalseQueryResponse(withDelay: number = 0) {
    QueryStubs.stubQueryResponse('/queries/ask-false-query-response.json', 'askFalseQueryResponse', withDelay);
  }

  static stubQueryResponse(fixture: string, alias: string, withDelay: number = 0) {
    cy.intercept('/repositories/test-repo', {fixture, delay: withDelay}).as(alias);
  }

  static stubLoadQueryErrorResponse() {
    cy.intercept('/repositories/test-repo', {
      statusCode: 500,
      body: '/datasets/bio2rdf/drugbank/bio2rdf-drugbank.nq (No such file or directory)'
    }).as('loadQueryErrorResponse');
  }

  static stubQueryResults(queryDescription: QueryStubDescription) {
    const resultType = queryDescription.resultType;
    const pageSize = queryDescription.pageSize;
    const totalElements = queryDescription.totalElements;
    const countQuery = queryDescription.countQuery;

    const fullyFiledPages = Math.floor(totalElements / pageSize);
    const elementsForLastPage = totalElements % pageSize;
    const limit = countQuery ? pageSize + 1 : pageSize;

    if (totalElements < 1) {
      QueryStubs.stubQueryWithResults(1, 0, limit, 0, resultType);
    } else {
      // Stubs responses for all fully filled pages.
      for (let pageNumber = 0; pageNumber < fullyFiledPages; pageNumber++) {
        const offset = pageNumber * pageSize;
        let returnElements = pageSize;

        if (QueryStubs.isLastPage(pageNumber, fullyFiledPages)) {
          // Check if there are more results, if yes the query must return one more result.
          if (elementsForLastPage > 0 && countQuery) {
            returnElements += 1;
          }
        } else {
          if (countQuery) {
            // If there are more pages the query must return one more result.
            returnElements += 1;
          }
        }
        const page = pageNumber + 1;
        QueryStubs.stubQueryWithResults(page, offset, limit, returnElements, resultType);
      }

      // Stubs the last page with.
      if (elementsForLastPage > 0) {
        const offset = fullyFiledPages * pageSize;
        const page = fullyFiledPages + 1;
        QueryStubs.stubQueryWithResults(page, offset, limit, elementsForLastPage, resultType);
      }
    }

    QueryStubs.stubTotalQueryCount(totalElements, resultType, queryDescription.countQueryError);
  }

  private static isLastPage(currentPage: number, allPage: number): boolean {
    return allPage - currentPage === 1;
  }

  private static stubQueryWithResults(page: number, offset: number, limit: number, returnResult: number, resultType: ResultType) {
    cy.intercept('/repositories/test-repo', (req) => {
      if (req.body.indexOf(`limit=${limit}`) > -1 && req.body.indexOf(`offset=${offset}`) > -1) {
        const result = QueryStubs.createEmptyResponse(resultType);
        result.results.bindings = QueryStubs.createResults(resultType, page, returnResult);
        req.reply(result);
      }
    }).as(`query-${page}_${offset}_${limit}_${returnResult}`);
  }

  private static stubTotalQueryCount(totalElements: number, resultType: ResultType, failed = false) {
    cy.intercept('/repositories/test-repo', (req) => {
      if (req.body.indexOf('count=1') > -1) {
        if (failed) {
          req.reply(500);
        } else {
          const result = QueryStubs.createEmptyResponse(resultType);
          result.results.bindings = [QueryStubs.createTotalResultsCount(resultType, totalElements)];
          req.reply(result);
        }
      }
    }).as(`countQuery-${totalElements}`);
  }

  private static createResults(resultType: ResultType, page: number, count: number) {
    const results = [];
    for (let index = 0; index < count; index++) {
      results.push(QueryStubs.createAnResult(resultType, page, index + 1));
    }
    return results;
  }

  private static createAnResult(resultType: ResultType, page: number, row: number) {
    switch (resultType) {
      case ResultType.URI:
        return this.createAnUriResult(page, row);
      case ResultType.TRIPLE:
        return this.createAnTripleResult(page, row);
    }
  }

  private static createAnTripleResult(page: number, row: number) {
    return {
      t : {
        type : "triple",
        value : {
          s : {
            type : "uri",
            value : QueryStubs.createAnUri(page, row, 1)
          },
          p : {
            type : "uri",
            value : QueryStubs.createAnUri(page, row, 2)
          },
          o : {
            type : "uri",
            value : QueryStubs.createAnUri(page, row, 3)
          }
        }
      }
    }
  }

  private static createAnUriResult(page: number, row: number) {
    return {
      s: {
        type: "uri",
        value: QueryStubs.createAnUri(page, row, 1)
      },
      p: {
        type: "uri",
        value: QueryStubs.createAnUri(page, row, 2)
      },
      o: {
        type: "uri",
        value: QueryStubs.createAnUri(page, row, 3)
      }
    }
  }

  private static createAnUri(page: number, row: number, column: number): string {
    return `http://ontotext-yasgui/generated-yri#page_${page}-row_${row}-column_${column}`
  }

  private static createEmptyResponse(resultType: ResultType) {
    switch (resultType) {
      case ResultType.URI:
        return QueryStubs.createEmptyUriResponse();
      case ResultType.TRIPLE:
        return QueryStubs.createTripleResponse();
    }
  }

  private static createEmptyUriResponse() {
    return {
      head: {
        vars: ["s", "p", "o"]
      },
      results: {
        bindings: []
      }
    }
  }

  private static createTripleResponse() {
    return {
      head: {
        vars: ["t"]
      },
      results: {
        bindings: []
      }
    }
  }

  private static createTotalResultsCount(resultType: ResultType, totalElement: number) {
    switch (resultType) {
      case ResultType.URI:
        return QueryStubs.createUriTotalResultsCount(totalElement);
      case ResultType.TRIPLE:
        return QueryStubs.createTripleTotalResultsCount(totalElement);
    }
  }

  private static createUriTotalResultsCount(totalElement: number) {
    return {
      s: {
        type: "uri",
        value: `${totalElement}`
      },
      p: {
        type: "uri",
        value: `${totalElement}`
      },
      o: {
        type: "uri",
        value: `${totalElement}`
      }
    }
  }

  private static createTripleTotalResultsCount(totalElement: number) {
    return {
      t: {
        datatype: "http://www.w3.org/2001/XMLSchema#int",
        type: "literal",
        value: `${totalElement}`
      }
    }
  }
}

export class QueryStubDescription {
  pageSize: number;
  totalElements: number;
  countQuery = true;
  countQueryError = false;
  resultType = ResultType.URI;

  setPageSize(pageSize: number): QueryStubDescription {
    this.pageSize = pageSize;
    return this;
  }

  setTotalElements(totalElements: number): QueryStubDescription {
    this.totalElements = totalElements;
    return this;
  }

  setCountQuery(countQuery: boolean): QueryStubDescription {
    this.countQuery = countQuery;
    return this;
  }

  setResultType(resultType: ResultType): QueryStubDescription {
    this.resultType = resultType;
    return this;
  }

  setCountQueryFailed(): QueryStubDescription {
    this.countQueryError = true;
    return this;
  }
}

export enum ResultType {
  URI = 'uri',
  TRIPLE = 'triple'
}
