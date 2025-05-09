export const DEFAULT_SPARQL_QUERY = 'select * where {\n    ?s ?p ?o .\n} limit 100';

export const DEFAULT_SPARQL_QUERY_FROM_LOG = '\n"select * where {\\n    ?s ?p ?o .\\n} limit 100"';

export const SAVED_QUERY_PAYLOAD = '{"queryName":"Query","query":"select * where {\\n    ?s ?p ?o .\\n} limit 100","isPublic":false,"originalQueryName":"Query"}';
export const SAVED_QUERY2_PAYLOAD = '{"queryName":"Query two","query":"select * where {\\n    ?s ?p ?o .\\n} limit 100","isPublic":false,"originalQueryName":"Query"}';

export const SHARE_QUERY_LINK = 'http://localhost:3333/pages/actions?name=Query&query=select%20*%20where%20%7B%0A%20%20%20%20%3Fs%20%3Fp%20%3Fo%20.%0A%7D%20limit%20100&infer=true&sameAs=true';

export const DOWNLOAD_AS_CSV_QUERY = '{"TYPE":"downloadAs","payload":{"value":"text/csv","pluginName":"extended_table","query":"select * where {\\n ?s ?p ?o .\\n} limit 100","infer":true,"sameAs":true}}';
export const DOWNLOAD_AS_JSON_QUERY = '{"TYPE":"downloadAs","payload":{"value":"application/sparql-results+json","pluginName":"extended_response","query":"select * where {\\n ?s ?p ?o .\\n} limit 100","infer":true,"sameAs":true}}';
