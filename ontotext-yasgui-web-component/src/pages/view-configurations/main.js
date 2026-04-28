let ontoElement = getOntotextYasgui(undefined, undefined, {showToolbar: true});

ontoElement.addEventListener("output", (event) => {
  if ('query' === event.detail.TYPE) {
    const div = document.createElement('div');
    div.innerHTML = '<div id="queryRan">Query was Executed</div>';
    document.body.appendChild(div);
  }
});

function setShowEditorTabs(hideEditorTab) {
  ontoElement.config = {...ontoElement.config, showEditorTabs: hideEditorTab}
}

function setShowResultTabs(showResultTabs) {
  ontoElement.config = {...ontoElement.config, showResultTabs: showResultTabs}
}

function setDefaultQuery(query) {
  ontoElement.config = {...ontoElement.config, query: query}
}

function setInitialQuery(initialQuery) {
  ontoElement.config = {...ontoElement.config, initialQuery: initialQuery}
}

function setShowControlBar(showControlBar) {
  ontoElement.config = {...ontoElement.config, showControlBar: showControlBar}
}

function configureYasrFullscreenOn() {
  ontoElement.config = {
    ...ontoElement.config,
    yasrFullscreen: true
  }
}

function configureYasrFullscreenOff() {
  ontoElement.config = {
    ...ontoElement.config,
    yasrFullscreen: false
  }
}

function configureSelectedPluginToResponsePlugin() {
  ontoElement.config = {...ontoElement.config, selectedPlugin: 'extended_response'}
}

function attachMessageHandler() {
  ontoElement.addEventListener('output', (event) => {
    if ('notificationMessage' === event.detail.TYPE) {
      const div = document.createElement('div');
      div.innerHTML = `<div id="output-message">${JSON.stringify(event.detail)}</div>`;
      document.body.appendChild(div);
    }
  });
}

attachMessageHandler();
