let ontoElement = document.querySelector("ontotext-yasgui");
ontoElement.config = {
  endpoint: "/repositories/test-repo",
  prefixes: {
    "gn": "http://www.geonames.org/ontology#",
    "path": "http://www.ontotext.com/path#",
    "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
    "xsd": "http://www.w3.org/2001/XMLSchema#",
    "owl": "http://www.w3.org/2002/07/owl#",
    "wgs": "http://www.w3.org/2003/01/geo/wgs84_pos#",
    "xml": "http://www.w3.org/XML/1998/namespace",
    "voc": "https://swapi.co/vocabulary/",
    "psys": "http://proton.semanticweb.org/protonsys#transitiveOver"
  }
};

ontoElement.addEventListener('output', (event) => {
  const div = document.getElementById('download-as-event');
  div.innerText = JSON.stringify(event.detail);
});

function setConfiguration() {
  ontoElement.config = {
    ...ontoElement.config,
    pluginsConfigurations: {
      extended_table: {
        downloadAsConfig: {
          items: [
            {
              labelKey: "yasr.plugin_control.download_as.sparql_results_json.label",
              value: "application/sparql-results+json",
            },
            {
              labelKey: "yasr.plugin_control.download_as.x_sparqlstar_results_json.label",
              value: "application/x-sparqlstar-results+json",
            },
            {
              labelKey: "yasr.plugin_control.download_as.csv.label",
              value: "text/csv",
            },
          ]
        }
      }
    }
  }
}
