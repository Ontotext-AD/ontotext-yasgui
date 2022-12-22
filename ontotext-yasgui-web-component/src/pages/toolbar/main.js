let ontoElement = document.querySelector("ontotext-yasgui");
ontoElement.config = {
  endpoint: "/repositories/test-repo",
  showToolbar: true
};

function showToolbar() {
  ontoElement.config = {...ontoElement.config, showToolbar: true};
}

function hideToolbar() {
  ontoElement.config = {...ontoElement.config, showToolbar: false};
}
