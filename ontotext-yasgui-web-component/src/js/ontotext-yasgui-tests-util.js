function getOntotextYasgui(componentId, endpoint = "/repositories/test-repo") {
  let ontoElement = document.querySelector("ontotext-yasgui");
  ontoElement.config = {
    endpoint: () => {
      return endpoint;
    },
    prefixes: getPrefixes(),
    componentId
  };
  return ontoElement;
}

function getYasqeAutocompleter() {
  return {
    LocalNamesAutocompleter: (term) => {
      const response = autocompleteResponse[term] || {suggestions: []};
      return Promise.resolve(response)
    }
  }
}

function getPrefixes() {
  return {
    "gn": "http://www.geonames.org/ontology#",
    "path": "http://www.ontotext.com/path#",
    "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
    "xsd": "http://www.w3.org/2001/XMLSchema#",
    "owl": "http://www.w3.org/2002/07/owl#",
    "wgs": "http://www.w3.org/2003/01/geo/wgs84_pos#",
    "xml": "http://www.w3.org/XML/1998/namespace",
    "voc": "https://swapi.co/vocabulary/",
    "psys": "http://proton.semanticweb.org/protonsys#transitiveOver",
    "ontogen": "http://ontotext-yasgui/generated-yri#"
  }
}

function setQueryListener(ontoElement) {
  ontoElement.addEventListener('output', (event) => {
    if ('countQuery' === event.detail.TYPE) {
      const request = event.detail.payload.request;
      const data = request['_data'];
      data.pageSize = undefined;
      data.pageNumber = undefined;
      data.count = 1;
    } else if ('countQueryResponse' === event.detail.TYPE) {
      event.detail.payload.response.body.totalElements = getCount(event.detail.payload.response);
    } else if ('query' === event.detail.TYPE) {
      onQuery(event);
    }
  });

  function getCount(countResponse) {
    if (!countResponse || !countResponse.body) {
      return -1;
    }
    const body = countResponse.body;
    if (body["http://www.ontotext.com/"]) {
      return body["http://www.ontotext.com/"]["http://www.ontotext.com/"][0].value;
    }

    if (Number(parseFloat(body)) === body) {
      return body;
    }

    if (body.results && body.results.bindings && body.results.bindings.length > 0) {
      const result = body.results.bindings[0];
      const vars = body.head.vars;
      const bindingVars = Object.keys(result).filter(function (b) {
        return vars.indexOf(b) > -1;
      });
      if (bindingVars.length > 0) {
        return result[bindingVars[0]].value;
      }
    }
    return -1;
  }

  function onQuery(event) {
    const pageNumber = event.detail.payload.request._data['pageNumber'] ? parseInt(event.detail.payload.request._data['pageNumber']) : undefined;
    event.detail.payload.request._data['pageNumber'] = undefined;
    const pageSize = event.detail.payload.request._data['pageSize'] ? parseInt(event.detail.payload.request._data['pageSize']) : undefined;
    event.detail.payload.request._data['pageSize'] = undefined;
    if (pageSize && pageNumber) {
      event.detail.payload.request._data['offset'] = (pageNumber - 1) * (pageSize -1);
      event.detail.payload.request._data['limit'] = pageSize;
    }
  }
}

const autocompleteResponse = {
  'http://www.w3.org/1999/02/22-rdf-syntax-ns#;': {
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
  },
  'rdf': {
    "suggestions":
      [{
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
}
