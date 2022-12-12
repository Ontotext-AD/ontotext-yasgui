const ontoElement = document.querySelector("ontotext-yasgui");
ontoElement.config = {
  query: '',
  yasguiConfig: {
    requestConfig: {
      endpoint: "/repositories/test-repo"
    }
  }
};

ontoElement.addEventListener("queryExecuted", () => {
  const div = document.createElement('div');
  div.innerHTML = '<div id="queryRan">Query was Executed</div>';
  document.body.appendChild(div);
});

function setShowEditorTabs(hideEditorTab) {
  ontoElement.config = {
    showEditorTabs: hideEditorTab,
    query: '',
    yasguiConfig: {
      requestConfig: {
        endpoint: "/repositories/test-repo"
      }
    }
  }
}

function setHowResultTabs(showResultTabs) {
  ontoElement.config = {
    showResultTabs: showResultTabs,
    query: '',
    yasguiConfig: {
      requestConfig: {
        endpoint: "/repositories/test-repo"
      }
    }
  }
}

function setDefaultQuery(query) {
  ontoElement.config = {
    query: query,
    yasguiConfig: {
      requestConfig: {
        endpoint: "/repositories/test-repo"
      }
    }
  }
}

function  setInitialQuery(initialQuery) {
  ontoElement.config = {
    initialQuery: initialQuery,
    query: '',
    yasguiConfig: {
      requestConfig: {
        endpoint: "/repositories/test-repo"
      }
    }
  }
}
