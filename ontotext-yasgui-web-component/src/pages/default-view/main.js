let ontoElement = document.querySelector("ontotext-yasgui");
ontoElement.config = {
  endpoint: "/repositories/test-repo"
};

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
