import { default as Yasqe, Config, RequestConfig, CustomResultMessage, QueryResponseStatus } from "./";
import * as superagent from "superagent";
import { merge, isFunction } from "lodash-es";
import * as queryString from "query-string";
import { QueryError } from "@triply/yasgui-utils";
export type YasqeAjaxConfig = Config["requestConfig"];
export interface PopulatedAjaxConfig {
  url: string;
  reqMethod: "POST" | "GET";
  headers: { [key: string]: string };
  accept: string;
  args: RequestArgs;
  withCredentials: boolean;
}
function getRequestConfigSettings(yasqe: Yasqe, conf?: Partial<Config["requestConfig"]>): RequestConfig<Yasqe> {
  return isFunction(conf) ? conf(yasqe) : conf;
}
// type callback = AjaxConfig.callbacks['complete'];
export function getAjaxConfig(
  yasqe: Yasqe,
  _config: Partial<Config["requestConfig"]> = {}
): PopulatedAjaxConfig | undefined {
  const config: RequestConfig<Yasqe> = merge(
    {},
    getRequestConfigSettings(yasqe, yasqe.config.requestConfig),
    getRequestConfigSettings(yasqe, _config)
  );
  if (!config.endpoint || config.endpoint.length == 0) return; // nothing to query!

  var queryMode = yasqe.getQueryMode();
  /**
   * initialize ajax config
   */
  const endpoint = isFunction(config.endpoint) ? config.endpoint(yasqe) : config.endpoint;
  var reqMethod: "GET" | "POST" =
    queryMode == "update" ? "POST" : isFunction(config.method) ? config.method(yasqe) : config.method;
  const headers = isFunction(config.headers) ? config.headers(yasqe) : config.headers;
  // console.log({headers})
  const withCredentials = isFunction(config.withCredentials) ? config.withCredentials(yasqe) : config.withCredentials;
  return {
    reqMethod,
    url: endpoint,
    args: getUrlArguments(yasqe, config),
    headers: headers,
    accept: getAcceptHeader(yasqe, config),
    withCredentials,
  };
  /**
   * merge additional request headers
   */
}

export async function executeQuery(yasqe: Yasqe, config?: YasqeAjaxConfig): Promise<any> {
  if (yasqe.isUpdateQuery()) {
    return executeUpdateModeQuery(yasqe, config);
  }
  return executeQueryModeQuery(yasqe, config);
}

export async function executeUpdateModeQuery(yasqe: Yasqe, config?: YasqeAjaxConfig): Promise<any> {
  const queryStarted = Date.now();
  let initialRepositoryStatementsCount: number;
  let beforeUpdateQueryResult: CustomResultMessage;
  const checkQueryPreconditions = (): Promise<CustomResultMessage> => {
    return yasqe.config.beforeUpdateQuery(yasqe.getValue(), yasqe.getTabId()).then((result) => {
      beforeUpdateQueryResult = result;

      if (beforeUpdateQueryResult && QueryResponseStatus.ERROR === beforeUpdateQueryResult.status) {
        const error = new QueryError();
        error.messageLabelKey = beforeUpdateQueryResult.messageLabelKey;
        error.parameters = beforeUpdateQueryResult.parameters;
        error.message = beforeUpdateQueryResult.message || "";
        return Promise.reject(error);
      }
      return result;
    });
  };

  const getRepositoryStatementsCountBeforeQuery = (): Promise<number> => {
    return yasqe.config.getRepositoryStatementsCount().then((initialCount: number) => {
      initialRepositoryStatementsCount = initialCount;
      return initialCount;
    });
  };

  const executeQuery = (): Promise<any> => {
    return executeQueryModeQuery(yasqe, config, queryStarted, beforeUpdateQueryResult);
  };

  const calculateAffectedStatementsCount = () => {
    yasqe.config.getRepositoryStatementsCount().then((repositoryStatementsCount) => {
      if (initialRepositoryStatementsCount !== undefined && repositoryStatementsCount !== undefined) {
        const affectedStatementsCount = repositoryStatementsCount - initialRepositoryStatementsCount;
        yasqe.emit("countAffectedRepositoryStatementsChanged", affectedStatementsCount);
        yasqe.emit("countAffectedRepositoryStatementsPersisted");
      }
    });
  };

  return checkQueryPreconditions()
    .then(getRepositoryStatementsCountBeforeQuery)
    .then(executeQuery)
    .then(calculateAffectedStatementsCount)
    .catch((error) => {
      yasqe.emit(
        "queryResponse",
        error,
        Date.now() - queryStarted,
        queryStarted,
        undefined,
        undefined,
        beforeUpdateQueryResult
      );
      yasqe.emit("error", error);
    });
}

export async function executeQueryModeQuery(
  yasqe: Yasqe,
  config?: YasqeAjaxConfig,
  queryStarted?: number,
  beforeUpdateQueryResult?: CustomResultMessage
): Promise<any> {
  var req: superagent.SuperAgentRequest;
  try {
    const populatedConfig = getAjaxConfig(yasqe, config);
    if (!populatedConfig) {
      //nothing to query
      return;
    }
    var queryStart = queryStarted || Date.now();

    if (populatedConfig.reqMethod === "POST") {
      req = superagent.post(populatedConfig.url).type("form").send(populatedConfig.args);
    } else {
      req = superagent.get(populatedConfig.url).query(populatedConfig.args);
    }
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    req.accept(populatedConfig.accept).set(populatedConfig.headers || {});

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    if (populatedConfig.withCredentials) req.withCredentials();
    yasqe.emit("query", req, populatedConfig);
    return await req.then(
      (result) => {
        let hasMorePages = false;
        let totalElements;
        if (result.body && !isNaN(result.body.totalElements)) {
          totalElements = parseInt(result.body.totalElements);
        }
        let possibleElementsCount;

        // if response contains total elements then don't need to execute count Query.
        // Also count query is skipped for update and ask query.
        if (!totalElements && !yasqe.isUpdateQuery() && !yasqe.isAskQuery() && yasqe.config.paginationOn) {
          const pageSize = yasqe.getPageSize();
          const pageNumber = yasqe.getPageNumber();
          if (pageSize && pageNumber) {
            hasMorePages = result.body.results.bindings.length > pageSize;
            possibleElementsCount = pageSize * (pageNumber - 1) + result.body.results.bindings.length;
            if (hasMorePages) {
              result.body.results.bindings.pop();
              executeCountQuery(yasqe, config);
            } else {
              totalElements = possibleElementsCount;
            }
          }
        }

        yasqe.emit(
          "queryResponse",
          result,
          Date.now() - queryStart,
          queryStart,
          hasMorePages,
          possibleElementsCount,
          beforeUpdateQueryResult
        );
        yasqe.emit("queryResults", result.body, Date.now() - queryStart);
        if (totalElements) {
          yasqe.emit("totalElementsChanged", totalElements);
          yasqe.emit("totalElementsPersisted", totalElements);
        }
        return result.body;
      },
      (e) => {
        if (e instanceof Error && e.message === "Aborted") {
          //The query was aborted. We should not do or draw anything
        } else {
          yasqe.emit(
            "queryResponse",
            e,
            Date.now() - queryStart,
            queryStart,
            undefined,
            undefined,
            beforeUpdateQueryResult
          );
        }
        yasqe.emit("error", e);
        throw e;
      }
    );
  } catch (e) {
    console.error(e);
  }
}

export function executeCountQuery(yasqe: Yasqe, config?: YasqeAjaxConfig): void {
  let req: superagent.SuperAgentRequest;
  const populatedConfig = getAjaxConfig(yasqe, config);
  if (!populatedConfig) {
    //nothing to query
    return;
  }
  if (populatedConfig.reqMethod === "POST") {
    req = superagent.post(populatedConfig.url).type("form").send(populatedConfig.args);
  } else {
    req = superagent.get(populatedConfig.url).query(populatedConfig.args);
  }
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  req.accept(populatedConfig.accept).set(populatedConfig.headers || {});

  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  if (populatedConfig.withCredentials) req.withCredentials();

  yasqe.emit("countQuery", req, populatedConfig);
  const payload = {
    request: req,
    query: yasqe.getValue(),
    queryMode: yasqe.getQueryMode(),
    queryType: yasqe.getQueryType(),
    pageSize: yasqe.getPageSize(),
  };
  yasqe.emitEvent("internalCountQueryEvent", payload);
  req.then(
    (countResponse) => {
      yasqe.emitEvent("internalCountQueryResponseEvent", { response: countResponse });
      yasqe.emit("totalElementsChanged", parseInt(countResponse.body.totalElements));
      yasqe.emit("totalElementsPersisted", parseInt(countResponse.body.totalElements));
    },
    (error) => {
      // Nothing to do. In tab persistence "totalElements" will stay undefined.
      // This will be taken into account when generating information message about the results.
      console.log(error);
    }
  ).finally(() => yasqe.emit("countQueryFinished"));
}

export type RequestArgs = { [argName: string]: string | string[] };
export function getUrlArguments(yasqe: Yasqe, _config: Config["requestConfig"]): RequestArgs {
  var queryMode = yasqe.getQueryMode();

  var data: RequestArgs = {};
  const config: RequestConfig<Yasqe> = getRequestConfigSettings(yasqe, _config);
  var queryArg = isFunction(config.queryArgument) ? config.queryArgument(yasqe) : config.queryArgument;
  if (!queryArg) queryArg = yasqe.getQueryMode();
  data[queryArg] = config.adjustQueryBeforeRequest ? config.adjustQueryBeforeRequest(yasqe) : yasqe.getValue();

  const infer = yasqe.getInfer();
  if (infer !== undefined) {
    data["infer"] = `${infer}`;
  }

  const sameAs = yasqe.getSameAs();
  if (sameAs !== undefined) {
    data["sameAs"] = `${sameAs}`;
  }

  const isExplainPlanQuery = yasqe.isExplainPlanQuery();
  if (isExplainPlanQuery) {
    data["explain"] = "true";
    data["explainType"] = yasqe.getExplainPlanQueryType()!;
  }

  if (yasqe.config.paginationOn) {
    const pageSize = yasqe.getPageSize();
    if (pageSize) {
      data["pageSize"] = `${pageSize + 1}`;
    }
    const pageNumber = yasqe.getPageNumber();
    if (pageNumber) {
      data["pageNumber"] = `${isExplainPlanQuery ? 1 : pageNumber}`;
    }
  }

  /**
   * add named graphs to ajax config
   */
  const namedGraphs = isFunction(config.namedGraphs) ? config.namedGraphs(yasqe) : config.namedGraphs;
  if (namedGraphs && namedGraphs.length > 0) {
    let argName = queryMode === "query" ? "named-graph-uri" : "using-named-graph-uri ";
    data[argName] = namedGraphs;
  }
  /**
   * add default graphs to ajax config
   */
  const defaultGraphs = isFunction(config.defaultGraphs) ? config.defaultGraphs(yasqe) : config.defaultGraphs;
  if (defaultGraphs && defaultGraphs.length > 0) {
    let argName = queryMode == "query" ? "default-graph-uri" : "using-graph-uri ";
    data[argName] = namedGraphs;
  }

  /**
   * add additional request args
   */
  const args = isFunction(config.args) ? config.args(yasqe) : config.args;
  if (args && args.length > 0)
    merge(
      data,
      args.reduce((argsObject: { [key: string]: string[] }, arg) => {
        argsObject[arg.name] ? argsObject[arg.name].push(arg.value) : (argsObject[arg.name] = [arg.value]);
        return argsObject;
      }, {})
    );

  return data;
}
export function getAcceptHeader(yasqe: Yasqe, _config: Config["requestConfig"]) {
  const config: RequestConfig<Yasqe> = getRequestConfigSettings(yasqe, _config);
  var acceptHeader = null;
  if (yasqe.getQueryMode() == "update") {
    acceptHeader = isFunction(config.acceptHeaderUpdate) ? config.acceptHeaderUpdate(yasqe) : config.acceptHeaderUpdate;
  } else {
    var qType = yasqe.getQueryType();
    if (qType == "DESCRIBE" || qType == "CONSTRUCT") {
      acceptHeader = isFunction(config.acceptHeaderGraph) ? config.acceptHeaderGraph(yasqe) : config.acceptHeaderGraph;
    } else {
      acceptHeader = isFunction(config.acceptHeaderSelect)
        ? config.acceptHeaderSelect(yasqe)
        : config.acceptHeaderSelect;
    }
  }
  return acceptHeader;
}
export function getAsCurlString(yasqe: Yasqe, _config?: Config["requestConfig"]) {
  let ajaxConfig = getAjaxConfig(yasqe, getRequestConfigSettings(yasqe, _config));
  if (!ajaxConfig) return "";
  let url = ajaxConfig.url;
  if (ajaxConfig.url.indexOf("http") !== 0) {
    //this is either a relative or absolute url, which is not supported by CURL.
    //Add domain, schema, etc etc
    url = `${window.location.protocol}//${window.location.host}`;
    if (ajaxConfig.url.indexOf("/") === 0) {
      //its an absolute path
      url += ajaxConfig.url;
    } else {
      //relative, so append current location to url first
      url += window.location.pathname + ajaxConfig.url;
    }
  }
  const segments: string[] = ["curl"];

  if (ajaxConfig.reqMethod === "GET") {
    url += `?${queryString.stringify(ajaxConfig.args)}`;
    segments.push(url);
  } else if (ajaxConfig.reqMethod === "POST") {
    segments.push(url);
    segments.push("--data", queryString.stringify(ajaxConfig.args));
  } else {
    // I don't expect to get here but let's be sure
    console.warn("Unexpected request-method", ajaxConfig.reqMethod);
    segments.push(url);
  }
  segments.push("-X", ajaxConfig.reqMethod);
  for (const header in ajaxConfig.headers) {
    segments.push(`-H  '${header}: ${ajaxConfig.headers[header]}'`);
  }
  return segments.join(" ");
}
