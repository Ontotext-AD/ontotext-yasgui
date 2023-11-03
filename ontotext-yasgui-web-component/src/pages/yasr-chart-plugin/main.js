const ontoElement = getOntotextYasgui('yasr-plugins', '/repositories/chart-data');

function loadFullData() {
  ontoElement.config = {...ontoElement.config, endpoint: () => { return "/repositories/chart-data" }}
}

function loadSmallData() {
  ontoElement.config = {...ontoElement.config, endpoint: () => { return "/repositories/chart-data-small-set" }}
}
