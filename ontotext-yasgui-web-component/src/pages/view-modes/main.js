let ontoElement = document.querySelector("ontotext-yasgui");
ontoElement.config = {
  defaultYasguiConfiguration: {
    requestConfig: {
      endpoint: "/repositories/test-repo"
    }
  },
  render: 'mode-yasgui',
  orientation: 'orientation-vertical'
};

function renderMode(mode) {
  ontoElement.config = {...ontoElement.config, render: mode};
}

function renderOrientation(mode) {
  ontoElement.config = {...ontoElement.config, orientation: mode};
}
