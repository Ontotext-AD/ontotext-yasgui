let ontoElement = document.querySelector("ontotext-yasgui");
ontoElement.config = {
  endpoint: "/repositories/test-repo",
  render: 'mode-yasgui',
  orientation: 'orientation-vertical',
  showToolbar: false
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
