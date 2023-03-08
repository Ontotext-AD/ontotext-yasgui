import * as Autocompleter from "./";

//Taken from http://www.w3.org/TR/sparql11-query/#grammar BuiltInCall
const functions = ['COUNT', 'SUM', 'MIN', 'MAX', 'AVG', 'SAMPLE', 'STR', 'LANG', 'LANGMATCHES', 'DATATYPE', 'BOUND', 'IRI', 'URI',
  'BNODE', 'RAND', 'ABS', 'CEIL', 'FLOOR', 'ROUND', 'CONCAT', 'SUBSTR', 'STRLEN', 'REPLACE', 'UCASE', 'LCASE', 'ENCODE_FOR_URI',
  'CONTAINS', 'STRSTARTS', 'STRENDS', 'STRBEFORE', 'STRAFTER', 'YEAR', 'MONTH', 'DAY', 'HOURS', 'MINUTES', 'SECONDS', 'TIMEZONE',
  'TZ', 'NOW', 'UUID', 'STRUUID', 'MD5', 'SHA1', 'SHA256', 'SHA384', 'SHA512', 'COALESCE', 'IF', 'STRLANG', 'STRDT', 'sameTerm',
  'isIRI', 'isURI', 'isBLANK', 'isLITERAL', 'isNUMERIC', 'REGEX', 'EXISTS', 'FILTER'
];

const conf: Autocompleter.CompleterConfig = {
    isValidCompletionPosition: function (yasqe) {
        let token = yasqe.getTokenAt(yasqe.getCursor());
        if (token.type !== "ws") {
            token = yasqe.getCompleteToken();
            if (token.string.length > 1) {
                return true;
            }
        }
        return false;
    },
    get: function (_yasqe, token) {
        const lowercaseToken = token?.string.toLowerCase() || '';
        const res = functions.filter((func) => func.toLowerCase().indexOf(lowercaseToken) === 0)
            .map((func) => `${func}(`)
            .sort();
        return Promise.resolve(res);
    },
    bulk: false,
    autoShow: true,
    name: "sparql-functions"
};
export default conf;
