let ontoElement = document.querySelector("ontotext-yasgui");
ontoElement.config = {
  endpoint: "/repositories/test-repo"
};

function showToolbar() {
  ontoElement.config = {...ontoElement.config, showToolbar: true};
}

function hideToolbar() {
  ontoElement.config = {...ontoElement.config, showToolbar: false};
}
