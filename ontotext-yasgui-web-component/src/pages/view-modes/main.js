let ontoElement = document.querySelector("ontotext-yasgui");
ontoElement.config = {
  endpoint: "/repositories/test-repo",
  render: 'mode-yasgui',
  orientation: 'orientation-vertical',
  showToolbar: false,
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

function renderMode(mode) {
  ontoElement.config = {...ontoElement.config, render: mode};
}

function renderOrientation(mode) {
  ontoElement.config = {...ontoElement.config, orientation: mode};
}

function showToolbar() {
  ontoElement.config = {...ontoElement.config, showToolbar: true};
}

function hideToolbar() {
  ontoElement.config = {...ontoElement.config, showToolbar: false};
}

function executeQueryAndGoToYasgui() {
  ontoElement.query('mode-yasgui');
}

function executeQueryAndGoToYasr() {
  ontoElement.query('mode-yasr');
}
