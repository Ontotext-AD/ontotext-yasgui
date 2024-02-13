let ontoElement = getOntotextYasgui();

setOutputEventListener(ontoElement);

function changeComponentId(componentId) {
  ontoElement.config =  {...ontoElement.config, componentId};
}

function turnOffPagination() {
  ontoElement.config =  {...ontoElement.config, paginationOn: false};
}
