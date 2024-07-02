let ontoElement = getOntotextYasgui();

function clearState() {
  ontoElement.config = {...ontoElement.config, clearState: true};
  console.log(ontoElement.config);
}
