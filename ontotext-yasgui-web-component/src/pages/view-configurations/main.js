const ontoElement = document.querySelector("ontotext-yasgui");
ontoElement.config = {
  query: '',
  endpoint: "/repositories/test-repo"
};

ontoElement.addEventListener("queryExecuted", () => {
  const div = document.createElement('div');
  div.innerHTML = '<div id="queryRan">Query was Executed</div>';
  document.body.appendChild(div);
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
