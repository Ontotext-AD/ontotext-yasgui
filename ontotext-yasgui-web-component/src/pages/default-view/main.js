let ontoElement = getOntotextYasgui();
setOutputEventListener(ontoElement);

let textAreaElement = document.createElement('textarea');
textAreaElement.id = 'output';
document.body.appendChild(textAreaElement);

function getQueryMode() {
  ontoElement.getQueryMode().then((queryMode) => {
    textAreaElement.value = queryMode;
  });
}

function getQueryType() {
  ontoElement.getQueryType().then((queryType) => {
    textAreaElement.value = queryType;
  });
}
