const namespacesEndpoints = []

module.exports = function (req, res, next) {
  if (req.url === '/repositories/test-repo') {
    // custom response overriding the dev server
    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify(queryResponse));
  } else if (req.url.endsWith('/repositories/test-repo/namespaces')) {
    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify(namespacesResponse));
  } else {
    // pass request on to the default dev server
    next();
  }
};

const namespacesResponse = {
  "head" : {
    "vars" : [
      "prefix",
      "namespace"
    ]
  },
  "results" : {
    "bindings" : [
      {
        "prefix" : {
          "type" : "literal",
          "value" : "path"
        },
        "namespace" : {
          "type" : "literal",
          "value" : "http://www.ontotext.com/path#"
        }
      },
      {
        "prefix" : {
          "type" : "literal",
          "value" : "wgs"
        },
        "namespace" : {
          "type" : "literal",
          "value" : "http://www.w3.org/2003/01/geo/wgs84_pos#"
        }
      },
      {
        "prefix" : {
          "type" : "literal",
          "value" : "rdf"
        },
        "namespace" : {
          "type" : "literal",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#"
        }
      },
      {
        "prefix" : {
          "type" : "literal",
          "value" : "owl"
        },
        "namespace" : {
          "type" : "literal",
          "value" : "http://www.w3.org/2002/07/owl#"
        }
      },
      {
        "prefix" : {
          "type" : "literal",
          "value" : "gn"
        },
        "namespace" : {
          "type" : "literal",
          "value" : "http://www.geonames.org/ontology#"
        }
      },
      {
        "prefix" : {
          "type" : "literal",
          "value" : "xsd"
        },
        "namespace" : {
          "type" : "literal",
          "value" : "http://www.w3.org/2001/XMLSchema#"
        }
      },
      {
        "prefix" : {
          "type" : "literal",
          "value" : "fn"
        },
        "namespace" : {
          "type" : "literal",
          "value" : "http://www.w3.org/2005/xpath-functions#"
        }
      },
      {
        "prefix" : {
          "type" : "literal",
          "value" : "rdfs"
        },
        "namespace" : {
          "type" : "literal",
          "value" : "http://www.w3.org/2000/01/rdf-schema#"
        }
      },
      {
        "prefix" : {
          "type" : "literal",
          "value" : "sesame"
        },
        "namespace" : {
          "type" : "literal",
          "value" : "http://www.openrdf.org/schema/sesame#"
        }
      },
      {
        "prefix" : {
          "type" : "literal",
          "value" : "dc"
        },
        "namespace" : {
          "type" : "literal",
          "value" : "http://purl.org/dc/elements/1.1/"
        }
      },
      {
        "prefix" : {
          "type" : "literal",
          "value" : "rdf4j"
        },
        "namespace" : {
          "type" : "literal",
          "value" : "http://rdf4j.org/schema/rdf4j#"
        }
      }
    ]
  }
};

const queryResponse = {
  "head" : {
    "vars" : [
      "s",
      "p",
      "o"
    ]
  },
  "results" : {
    "bindings" : [
      {
        "s" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#subPropertyOf"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#subPropertyOf"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2002/07/owl#TransitiveProperty"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#subClassOf"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#subClassOf"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2002/07/owl#TransitiveProperty"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#domain"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#range"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2002/07/owl#equivalentProperty"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2002/07/owl#SymmetricProperty"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2002/07/owl#equivalentProperty"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2002/07/owl#TransitiveProperty"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2002/07/owl#equivalentClass"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2002/07/owl#SymmetricProperty"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2002/07/owl#equivalentClass"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2002/07/owl#TransitiveProperty"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://proton.semanticweb.org/protonsys#transitiveOver"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2002/07/owl#inverseOf"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2002/07/owl#inverseOf"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2002/07/owl#SymmetricProperty"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#subject"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#predicate"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#object"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#first"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#rest"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#value"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#nil"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#List"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#Class"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#Datatype"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2002/07/owl#differentFrom"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2002/07/owl#SymmetricProperty"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2001/XMLSchema#nonNegativeInteger"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#Class"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2001/XMLSchema#nonNegativeInteger"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#Datatype"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2001/XMLSchema#string"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#Class"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2001/XMLSchema#string"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#Datatype"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#_1"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#_1"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#ContainerMembershipProperty"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://purl.org/dc/elements/1.1/title"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://purl.org/dc/elements/1.1/creator"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#subPropertyOf"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#subPropertyOf"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#subPropertyOf"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#subPropertyOf"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#subClassOf"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#subPropertyOf"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#subClassOf"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#domain"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#subPropertyOf"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#domain"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#range"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#subPropertyOf"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#range"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2002/07/owl#equivalentProperty"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#subPropertyOf"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#subPropertyOf"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2002/07/owl#equivalentClass"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#subPropertyOf"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#subClassOf"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://proton.semanticweb.org/protonsys#transitiveOver"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#subPropertyOf"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://proton.semanticweb.org/protonsys#transitiveOver"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2002/07/owl#inverseOf"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#subPropertyOf"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2002/07/owl#inverseOf"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#isDefinedBy"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#subPropertyOf"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#seeAlso"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://purl.org/dc/elements/1.1/title"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#subPropertyOf"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://purl.org/dc/elements/1.1/title"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://purl.org/dc/elements/1.1/creator"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#subPropertyOf"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://purl.org/dc/elements/1.1/creator"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#Alt"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#subClassOf"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#Container"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#Bag"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#subClassOf"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#Container"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#Seq"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#subClassOf"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#Container"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#ContainerMembershipProperty"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#subClassOf"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#subClassOf"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#Literal"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#subClassOf"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#Datatype"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#subClassOf"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#Class"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2001/XMLSchema#nonNegativeInteger"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#subClassOf"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2001/XMLSchema#nonNegativeInteger"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2001/XMLSchema#string"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#subClassOf"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2001/XMLSchema#string"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#subClassOf"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#domain"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#Class"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#subject"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#domain"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#Statement"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#predicate"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#domain"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#Statement"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#object"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#domain"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#Statement"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#first"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#domain"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#List"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#rest"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#domain"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#List"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#subClassOf"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#range"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#Class"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#domain"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#range"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#Class"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#range"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#range"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#Class"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#rest"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#range"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#List"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#comment"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#range"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#Literal"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#label"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#range"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#Literal"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://proton.semanticweb.org/protonsys#transitiveOver"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#subClassOf"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#subPropertyOf"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://proton.semanticweb.org/protonsys#transitiveOver"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#subPropertyOf"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#subClassOf"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://proton.semanticweb.org/protonsys#transitiveOver"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2000/01/rdf-schema#subClassOf"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2002/07/owl#equivalentProperty"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://proton.semanticweb.org/protonsys#transitiveOver"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2002/07/owl#equivalentProperty"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2002/07/owl#equivalentClass"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://proton.semanticweb.org/protonsys#transitiveOver"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2002/07/owl#equivalentClass"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2002/07/owl#equivalentProperty"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2002/07/owl#inverseOf"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2002/07/owl#equivalentProperty"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2002/07/owl#equivalentClass"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2002/07/owl#inverseOf"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2002/07/owl#equivalentClass"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2002/07/owl#inverseOf"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2002/07/owl#inverseOf"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2002/07/owl#inverseOf"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2002/07/owl#differentFrom"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2002/07/owl#inverseOf"
        },
        "o" : {
          "type" : "uri",
          "value" : "http://www.w3.org/2002/07/owl#differentFrom"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://example/book1"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://purl.org/dc/elements/1.1/title"
        },
        "o" : {
          "type" : "literal",
          "value" : "A new book"
        }
      },
      {
        "s" : {
          "type" : "uri",
          "value" : "http://example/book1"
        },
        "p" : {
          "type" : "uri",
          "value" : "http://purl.org/dc/elements/1.1/creator"
        },
        "o" : {
          "type" : "literal",
          "value" : "A.N.Other"
        }
      }
    ]
  }
};
