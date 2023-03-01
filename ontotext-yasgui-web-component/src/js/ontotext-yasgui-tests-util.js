function getOntotextYasgui() {
  let ontoElement = document.querySelector("ontotext-yasgui");
  ontoElement.config = {
    endpoint: "/repositories/test-repo",
    prefixes: getPrefixes()
  };
  return ontoElement;
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
