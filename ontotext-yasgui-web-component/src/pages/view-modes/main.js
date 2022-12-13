let ontoElement = document.querySelector("ontotext-yasgui");
ontoElement.config = {
  yasguiConfig: {
    requestConfig: {
      endpoint: "/repositories/test-repo"
    }
  },
  render: 'mode-yasgui',
  orientation: 'mode-vertical'
};

function renderMode(mode) {
  ontoElement.config = {
    render: mode,
  };
}
