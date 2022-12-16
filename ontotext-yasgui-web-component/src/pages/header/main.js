let ontoElement = document.querySelector("ontotext-yasgui");
ontoElement.config = {
  yasguiConfig: {
    requestConfig: {
      endpoint: "/repositories/test-repo"
    }
  },
};

function showHeader() {
  ontoElement.config = {...ontoElement.config, showHeader: true};
}

function hideHeader() {
  ontoElement.config = {...ontoElement.config, showHeader: false};
}
