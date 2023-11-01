const namespacesEndpoints = []

module.exports = function (req, res, next) {
  if (req.url === '/repositories/test-repo') {
    // custom response overriding the dev server
    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify(queryResponse));
  } else if (req.url === '/repositories/chart-data') {
    // custom response overriding the dev server
    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify(chartDataResponse));
  } else if (req.url.endsWith('/repositories/test-repo/namespaces')) {
    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify(namespacesResponse));
  } else if (req.url.includes('/autocomplete/query')) {
    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify(autocompleteResponse));
  } else if (req.url === 'https://lov.linkeddata.es/dataset/lov/api/v2/autocomplete/terms?q=rdf&page_size=50&type=property') {
    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify(localNamesResponse));
  } else {
    // pass request on to the default dev server
    next();
  }
};

const autocompleteResponse = {
  "suggestions": [{
    "type": "uri",
    "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#li",
    "description": "http://www.w3.org/1999/02/22-rdf-syntax-ns#li"
  }, {
    "type": "uri",
    "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#_1",
    "description": "http://www.w3.org/1999/02/22-rdf-syntax-ns#_1"
  }, {
    "type": "uri",
    "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#nil",
    "description": "http://www.w3.org/1999/02/22-rdf-syntax-ns#nil"
  }, {
    "type": "uri",
    "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Seq",
    "description": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Seq"
  }, {
    "type": "uri",
    "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Bag",
    "description": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Bag"
  }, {
    "type": "uri",
    "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Alt",
    "description": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Alt"
  }, {
    "type": "uri",
    "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
    "description": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
  }, {
    "type": "uri",
    "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#rest",
    "description": "http://www.w3.org/1999/02/22-rdf-syntax-ns#rest"
  }, {
    "type": "uri",
    "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#List",
    "description": "http://www.w3.org/1999/02/22-rdf-syntax-ns#List"
  }, {
    "type": "uri",
    "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#HTML",
    "description": "http://www.w3.org/1999/02/22-rdf-syntax-ns#HTML"
  }, {
    "type": "uri",
    "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#value",
    "description": "http://www.w3.org/1999/02/22-rdf-syntax-ns#value"
  }, {
    "type": "uri",
    "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#first",
    "description": "http://www.w3.org/1999/02/22-rdf-syntax-ns#first"
  }, {
    "type": "uri",
    "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#object",
    "description": "http://www.w3.org/1999/02/22-rdf-syntax-ns#object"
  }, {
    "type": "uri",
    "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#subject",
    "description": "http://www.w3.org/1999/02/22-rdf-syntax-ns#subject"
  }, {
    "type": "uri",
    "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property",
    "description": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"
  }, {
    "type": "uri",
    "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#predicate",
    "description": "http://www.w3.org/1999/02/22-rdf-syntax-ns#predicate"
  }, {
    "type": "uri",
    "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Statement",
    "description": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Statement"
  }, {
    "type": "uri",
    "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString",
    "description": "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString"
  }, {
    "type": "uri",
    "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral",
    "description": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral"
  }]
};

const localNamesResponse = {
  "suggestions": [{
    "type": "prefix",
    "value": "rdf",
    "description": "PREFIX <b>rdf</b>: &lt;http://www.w3.org/1999/02/22-rdf-syntax-ns#&gt;"
  }, {
    "type": "prefix",
    "value": "rdfs",
    "description": "PREFIX <b>rdf</b>s: &lt;http://www.w3.org/2000/01/rdf-schema#&gt;"
  }, {
    "type": "prefix",
    "value": "rdf4j",
    "description": "PREFIX <b>rdf</b>4j: &lt;http://rdf4j.org/schema/rdf4j#&gt;"
  }, {
    "type": "uri",
    "value": "http://www.w3.org/ns/ldp#RDFSource",
    "description": "http://www.w3.org/ns/ldp#<b>RDF</b>Source"
  }, {
    "type": "uri",
    "value": "http://www.w3.org/ns/ldp#NonRDFSource",
    "description": "http://www.w3.org/ns/ldp#Non<b>RDF</b>Source"
  }]
}

const namespacesResponse = {
  "head": {
    "vars": [
      "prefix",
      "namespace"
    ]
  },
  "results": {
    "bindings": [
      {
        "prefix": {
          "type": "literal",
          "value": "path"
        },
        "namespace": {
          "type": "literal",
          "value": "http://www.ontotext.com/path#"
        }
      },
      {
        "prefix": {
          "type": "literal",
          "value": "wgs"
        },
        "namespace": {
          "type": "literal",
          "value": "http://www.w3.org/2003/01/geo/wgs84_pos#"
        }
      },
      {
        "prefix": {
          "type": "literal",
          "value": "rdf"
        },
        "namespace": {
          "type": "literal",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#"
        }
      },
      {
        "prefix": {
          "type": "literal",
          "value": "owl"
        },
        "namespace": {
          "type": "literal",
          "value": "http://www.w3.org/2002/07/owl#"
        }
      },
      {
        "prefix": {
          "type": "literal",
          "value": "gn"
        },
        "namespace": {
          "type": "literal",
          "value": "http://www.geonames.org/ontology#"
        }
      },
      {
        "prefix": {
          "type": "literal",
          "value": "xsd"
        },
        "namespace": {
          "type": "literal",
          "value": "http://www.w3.org/2001/XMLSchema#"
        }
      },
      {
        "prefix": {
          "type": "literal",
          "value": "fn"
        },
        "namespace": {
          "type": "literal",
          "value": "http://www.w3.org/2005/xpath-functions#"
        }
      },
      {
        "prefix": {
          "type": "literal",
          "value": "rdfs"
        },
        "namespace": {
          "type": "literal",
          "value": "http://www.w3.org/2000/01/rdf-schema#"
        }
      },
      {
        "prefix": {
          "type": "literal",
          "value": "sesame"
        },
        "namespace": {
          "type": "literal",
          "value": "http://www.openrdf.org/schema/sesame#"
        }
      },
      {
        "prefix": {
          "type": "literal",
          "value": "dc"
        },
        "namespace": {
          "type": "literal",
          "value": "http://purl.org/dc/elements/1.1/"
        }
      },
      {
        "prefix": {
          "type": "literal",
          "value": "rdf4j"
        },
        "namespace": {
          "type": "literal",
          "value": "http://rdf4j.org/schema/rdf4j#"
        }
      }
    ]
  }
};

const chartDataResponse = {
  "head" : {
    "vars" : [
      "country",
      "temperature"
    ]
  },
  "results" : {
    "bindings" : [
      {
        "country" : {
          "type" : "uri",
          "value" : "http://example/book1"
        },
        "temperature" : {
          "datatype" : "http://www.w3.org/2001/XMLSchema#integer",
          "type" : "literal",
          "value" : "2"
        }
      },
      {
        "country" : {
          "type" : "uri",
          "value" : "http://example/book1"
        },
        "temperature" : {
          "datatype" : "http://www.w3.org/2001/XMLSchema#integer",
          "type" : "literal",
          "value" : "1"
        }
      },
      {
        "country" : {
          "type" : "uri",
          "value" : "http://example/book1"
        },
        "temperature" : {
          "datatype" : "http://www.w3.org/2001/XMLSchema#integer",
          "type" : "literal",
          "value" : "3"
        }
      },
      {
        "country" : {
          "type" : "uri",
          "value" : "http://example/book1"
        },
        "temperature" : {
          "datatype" : "http://www.w3.org/2001/XMLSchema#integer",
          "type" : "literal",
          "value" : "11"
        }
      },
      {
        "country" : {
          "type" : "uri",
          "value" : "http://example/book1"
        },
        "temperature" : {
          "datatype" : "http://www.w3.org/2001/XMLSchema#integer",
          "type" : "literal",
          "value" : "50"
        }
      },
      {
        "country" : {
          "type" : "uri",
          "value" : "http://example/book2"
        },
        "temperature" : {
          "datatype" : "http://www.w3.org/2001/XMLSchema#integer",
          "type" : "literal",
          "value" : "1"
        }
      },
      {
        "country" : {
          "type" : "uri",
          "value" : "http://example/book2"
        },
        "temperature" : {
          "datatype" : "http://www.w3.org/2001/XMLSchema#integer",
          "type" : "literal",
          "value" : "12"
        }
      },
      {
        "country" : {
          "type" : "uri",
          "value" : "http://example/book2"
        },
        "temperature" : {
          "datatype" : "http://www.w3.org/2001/XMLSchema#integer",
          "type" : "literal",
          "value" : "123"
        }
      }
    ]
  }
}

const queryResponse = {
  "head": {
    "vars": [
      "s",
      "p",
      "o"
    ]
  },
  "results": {
    "bindings": [
      {
        "s": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "p": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "o": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#subPropertyOf"
        },
        "p": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "o": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#subPropertyOf"
        },
        "p": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "o": {
          "type": "uri",
          "value": "http://www.w3.org/2002/07/owl#TransitiveProperty"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#subClassOf"
        },
        "p": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "o": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#subClassOf"
        },
        "p": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "o": {
          "type": "uri",
          "value": "http://www.w3.org/2002/07/owl#TransitiveProperty"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#domain"
        },
        "p": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "o": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#range"
        },
        "p": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "o": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://www.w3.org/2002/07/owl#equivalentProperty"
        },
        "p": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "o": {
          "type": "uri",
          "value": "http://www.w3.org/2002/07/owl#SymmetricProperty"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://www.w3.org/2002/07/owl#equivalentProperty"
        },
        "p": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "o": {
          "type": "uri",
          "value": "http://www.w3.org/2002/07/owl#TransitiveProperty"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://www.w3.org/2002/07/owl#equivalentClass"
        },
        "p": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "o": {
          "type": "uri",
          "value": "http://www.w3.org/2002/07/owl#SymmetricProperty"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://www.w3.org/2002/07/owl#equivalentClass"
        },
        "p": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "o": {
          "type": "uri",
          "value": "http://www.w3.org/2002/07/owl#TransitiveProperty"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://proton.semanticweb.org/protonsys#transitiveOver"
        },
        "p": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "o": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://www.w3.org/2002/07/owl#inverseOf"
        },
        "p": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "o": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://www.w3.org/2002/07/owl#inverseOf"
        },
        "p": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "o": {
          "type": "uri",
          "value": "http://www.w3.org/2002/07/owl#SymmetricProperty"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#subject"
        },
        "p": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "o": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#predicate"
        },
        "p": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "o": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#object"
        },
        "p": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "o": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#first"
        },
        "p": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "o": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#rest"
        },
        "p": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "o": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#value"
        },
        "p": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "o": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#nil"
        },
        "p": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "o": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#List"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral"
        },
        "p": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "o": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#Class"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral"
        },
        "p": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "o": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#Datatype"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://www.w3.org/2002/07/owl#differentFrom"
        },
        "p": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "o": {
          "type": "uri",
          "value": "http://www.w3.org/2002/07/owl#SymmetricProperty"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://www.w3.org/2001/XMLSchema#nonNegativeInteger"
        },
        "p": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "o": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#Class"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://www.w3.org/2001/XMLSchema#nonNegativeInteger"
        },
        "p": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "o": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#Datatype"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://www.w3.org/2001/XMLSchema#string"
        },
        "p": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "o": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#Class"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://www.w3.org/2001/XMLSchema#string"
        },
        "p": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "o": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#Datatype"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#_1"
        },
        "p": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "o": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#_1"
        },
        "p": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "o": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#ContainerMembershipProperty"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://purl.org/dc/elements/1.1/title"
        },
        "p": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "o": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://purl.org/dc/elements/1.1/creator"
        },
        "p": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "o": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "p": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#subPropertyOf"
        },
        "o": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#subPropertyOf"
        },
        "p": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#subPropertyOf"
        },
        "o": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#subPropertyOf"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#subClassOf"
        },
        "p": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#subPropertyOf"
        },
        "o": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#subClassOf"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#domain"
        },
        "p": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#subPropertyOf"
        },
        "o": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#domain"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#range"
        },
        "p": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#subPropertyOf"
        },
        "o": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#range"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://www.w3.org/2002/07/owl#equivalentProperty"
        },
        "p": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#subPropertyOf"
        },
        "o": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#subPropertyOf"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://www.w3.org/2002/07/owl#equivalentClass"
        },
        "p": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#subPropertyOf"
        },
        "o": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#subClassOf"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://proton.semanticweb.org/protonsys#transitiveOver"
        },
        "p": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#subPropertyOf"
        },
        "o": {
          "type": "uri",
          "value": "http://proton.semanticweb.org/protonsys#transitiveOver"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://www.w3.org/2002/07/owl#inverseOf"
        },
        "p": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#subPropertyOf"
        },
        "o": {
          "type": "uri",
          "value": "http://www.w3.org/2002/07/owl#inverseOf"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#isDefinedBy"
        },
        "p": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#subPropertyOf"
        },
        "o": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#seeAlso"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://purl.org/dc/elements/1.1/title"
        },
        "p": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#subPropertyOf"
        },
        "o": {
          "type": "uri",
          "value": "http://purl.org/dc/elements/1.1/title"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://purl.org/dc/elements/1.1/creator"
        },
        "p": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#subPropertyOf"
        },
        "o": {
          "type": "uri",
          "value": "http://purl.org/dc/elements/1.1/creator"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Alt"
        },
        "p": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#subClassOf"
        },
        "o": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#Container"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Bag"
        },
        "p": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#subClassOf"
        },
        "o": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#Container"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Seq"
        },
        "p": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#subClassOf"
        },
        "o": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#Container"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#ContainerMembershipProperty"
        },
        "p": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#subClassOf"
        },
        "o": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral"
        },
        "p": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#subClassOf"
        },
        "o": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#Literal"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral"
        },
        "p": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#subClassOf"
        },
        "o": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#Datatype"
        },
        "p": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#subClassOf"
        },
        "o": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#Class"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://www.w3.org/2001/XMLSchema#nonNegativeInteger"
        },
        "p": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#subClassOf"
        },
        "o": {
          "type": "uri",
          "value": "http://www.w3.org/2001/XMLSchema#nonNegativeInteger"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://www.w3.org/2001/XMLSchema#string"
        },
        "p": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#subClassOf"
        },
        "o": {
          "type": "uri",
          "value": "http://www.w3.org/2001/XMLSchema#string"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#subClassOf"
        },
        "p": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#domain"
        },
        "o": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#Class"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#subject"
        },
        "p": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#domain"
        },
        "o": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Statement"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#predicate"
        },
        "p": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#domain"
        },
        "o": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Statement"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#object"
        },
        "p": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#domain"
        },
        "o": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#Statement"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#first"
        },
        "p": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#domain"
        },
        "o": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#List"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#rest"
        },
        "p": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#domain"
        },
        "o": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#List"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#subClassOf"
        },
        "p": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#range"
        },
        "o": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#Class"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#domain"
        },
        "p": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#range"
        },
        "o": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#Class"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#range"
        },
        "p": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#range"
        },
        "o": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#Class"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#rest"
        },
        "p": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#range"
        },
        "o": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#List"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#comment"
        },
        "p": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#range"
        },
        "o": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#Literal"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#label"
        },
        "p": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#range"
        },
        "o": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#Literal"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "p": {
          "type": "uri",
          "value": "http://proton.semanticweb.org/protonsys#transitiveOver"
        },
        "o": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#subClassOf"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#subPropertyOf"
        },
        "p": {
          "type": "uri",
          "value": "http://proton.semanticweb.org/protonsys#transitiveOver"
        },
        "o": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#subPropertyOf"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#subClassOf"
        },
        "p": {
          "type": "uri",
          "value": "http://proton.semanticweb.org/protonsys#transitiveOver"
        },
        "o": {
          "type": "uri",
          "value": "http://www.w3.org/2000/01/rdf-schema#subClassOf"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://www.w3.org/2002/07/owl#equivalentProperty"
        },
        "p": {
          "type": "uri",
          "value": "http://proton.semanticweb.org/protonsys#transitiveOver"
        },
        "o": {
          "type": "uri",
          "value": "http://www.w3.org/2002/07/owl#equivalentProperty"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://www.w3.org/2002/07/owl#equivalentClass"
        },
        "p": {
          "type": "uri",
          "value": "http://proton.semanticweb.org/protonsys#transitiveOver"
        },
        "o": {
          "type": "uri",
          "value": "http://www.w3.org/2002/07/owl#equivalentClass"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://www.w3.org/2002/07/owl#equivalentProperty"
        },
        "p": {
          "type": "uri",
          "value": "http://www.w3.org/2002/07/owl#inverseOf"
        },
        "o": {
          "type": "uri",
          "value": "http://www.w3.org/2002/07/owl#equivalentProperty"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://www.w3.org/2002/07/owl#equivalentClass"
        },
        "p": {
          "type": "uri",
          "value": "http://www.w3.org/2002/07/owl#inverseOf"
        },
        "o": {
          "type": "uri",
          "value": "http://www.w3.org/2002/07/owl#equivalentClass"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://www.w3.org/2002/07/owl#inverseOf"
        },
        "p": {
          "type": "uri",
          "value": "http://www.w3.org/2002/07/owl#inverseOf"
        },
        "o": {
          "type": "uri",
          "value": "http://www.w3.org/2002/07/owl#inverseOf"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://www.w3.org/2002/07/owl#differentFrom"
        },
        "p": {
          "type": "uri",
          "value": "http://www.w3.org/2002/07/owl#inverseOf"
        },
        "o": {
          "type": "uri",
          "value": "http://www.w3.org/2002/07/owl#differentFrom"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://example/book1"
        },
        "p": {
          "type": "uri",
          "value": "http://purl.org/dc/elements/1.1/title"
        },
        "o": {
          "type": "literal",
          "value": "A new book"
        }
      },
      {
        "s": {
          "type": "uri",
          "value": "http://example/book1"
        },
        "p": {
          "type": "uri",
          "value": "http://purl.org/dc/elements/1.1/creator"
        },
        "o": {
          "type": "literal",
          "value": "A.N.Other"
        }
      }
    ]
  }
};
