let ontoElement = document.querySelector('ontotext-yasgui');
ontoElement.config = {
  endpoint: '/repositories/test-repo',
  yasqeActionButtons: [],
  defaultTabName: 'Query'
};

let textAreaElement = document.createElement('textarea');
textAreaElement.id = 'saveQueryPayload';
document.body.appendChild(textAreaElement);

function hideSaveQueryAction() {
  ontoElement.config = {
    ...ontoElement.config,
    yasqeActionButtons: [
      {
        name: 'createSavedQuery',
        visible: false
      }
    ]
  };
}

function showSaveQueryAction() {
  ontoElement.config = {
    ...ontoElement.config,
    yasqeActionButtons: [
      {
        name: 'createSavedQuery',
        visible: true
      }
    ]
  };
}

function hideLoadSavedQueriesAction() {
  ontoElement.config = {
    ...ontoElement.config,
    yasqeActionButtons: [
      {
        name: 'showSavedQueries',
        visible: false
      }
    ]
  };
}

function showLoadSavedQueriesAction() {
  ontoElement.config = {
    ...ontoElement.config,
    yasqeActionButtons: [
      {
        name: 'showSavedQueries',
        visible: true
      }
    ]
  };
}

function openNewQueryAction() {
  ontoElement.openTab({
    queryName: 'Clear graph',
    query: 'CLEAR GRAPH <http://example>',
    isPublic: false,
    owner: 'admin'
  });
}

ontoElement.addEventListener("queryExecuted", () => {
  const div = document.createElement('div');
  div.innerHTML = '<div id="queryRan">Query was Executed</div>';
  document.body.appendChild(div);
});

ontoElement.addEventListener('queryResponse', () => {
  const div = document.createElement('div');
  div.innerHTML = '<div id="queryResponse">Query response</div>';
  document.body.appendChild(div);
});

const savedQueryStorage = {
  'q2': {
    'queryName': 'q2',
    'query': "select * where { \n\t?s ?p ?o .\n} limit 100 \n",
    'isPublic': false,
    'owner': 'admin'
  }
};

function saveQuery(event) {
  let data = event.detail;
  textAreaElement.value = JSON.stringify(data);
  // emulate duplicated query name error
  if (savedQueryStorage[data.queryName]) {
    ontoElement.savedQueryConfig = {
      saveSuccess: false,
      errorMessage: ['Query name already exist!']
    };
  } else {
    savedQueryStorage[data.queryName] = data;
    ontoElement.savedQueryConfig = {
      saveSuccess: true
    };
  }
}

ontoElement.addEventListener('createSavedQuery', (event) => {
  saveQuery(event);
});

ontoElement.addEventListener('updateSavedQuery', (event) => {
  saveQuery(event);
});

ontoElement.addEventListener('loadSavedQueries', (event) => {
  ontoElement.savedQueryConfig = {
    savedQueries: savedQueries
  };
});

ontoElement.addEventListener('deleteSavedQuery', (event) => {
  let selectedQuery = event.detail;
  savedQueries = savedQueries.filter((savedQuery) => savedQuery.queryName !== selectedQuery.queryName);
  ontoElement.savedQueryConfig = {
    savedQueries: savedQueries
  };
});

ontoElement.addEventListener('shareSavedQuery', (event) => {
  let selectedQuery = event.detail;
  const url = [location.protocol, '//', location.host, location.pathname];
  if (selectedQuery.queryName) {
    url.push(...['?savedQueryName=', encodeURIComponent(selectedQuery.queryName)]);
  }
  if (selectedQuery.owner) {
    url.push(...['&owner=', encodeURIComponent(selectedQuery.owner)]);
  }
  ontoElement.savedQueryConfig = {
    shareQueryLink: url.join('')
  };
});

ontoElement.addEventListener('savedQueryShareLinkCopied', () => {
  navigator.clipboard.readText().then((clipText) => {
    textAreaElement.value = clipText;
  });
});

let savedQueries = [
  {
    "queryName": "Add statements",
    "query": "PREFIX dc: <http://purl.org/dc/elements/1.1/>\nINSERT DATA\n      {\n      GRAPH <http://example> {\n          <http://example/book1> dc:title \"A new book\" ;\n                                 dc:creator \"A.N.Other\" .\n          }\n      }",
    "isPublic": false,
    "owner": "admin"
  },
  {
    "queryName": "Clear graph",
    "query": "CLEAR GRAPH <http://example>",
    "isPublic": false,
    "owner": "admin"
  },
  {
    "queryName": "new query",
    "query": "select *",
    "isPublic": true,
    "owner": "admin"
  },
  {
    "queryName": "q1",
    "query": "select * where { \n\t?s ?p ?o .\n} limit 100 \n",
    "isPublic": false,
    "owner": "admin"
  },
  {
    "queryName": "q2",
    "query": "select * where { \n\t?s ?p ?o .\n} limit 100 \n",
    "isPublic": false,
    "owner": "admin"
  },
  {
    "queryName": "q3",
    "query": "select * where { \n\t?s ?p ?o .\n} limit 100 \n",
    "isPublic": false,
    "owner": "admin"
  },
  {
    "queryName": "q4",
    "query": "select * where { \n\t?s ?p ?o .\n} limit 100 \n",
    "isPublic": false,
    "owner": "admin"
  },
  {
    "queryName": "q5",
    "query": "select * where { \n\t?s ?p ?o .\n} limit 100 \n",
    "isPublic": false,
    "owner": "admin"
  },
  {
    "queryName": "q6",
    "query": "select * where { \n\t?s ?p ?o .\n} limit 100 \n",
    "isPublic": false,
    "owner": "admin"
  },
  {
    "queryName": "q7",
    "query": "select * where { \n\t?s ?p ?o .\n} limit 100 \n",
    "isPublic": false,
    "owner": "admin"
  },
  {
    "queryName": "q8",
    "query": "select * where { \n\t?s ?p ?o .\n} limit 100 \n",
    "isPublic": false,
    "owner": "admin"
  },
  {
    "queryName": "q9",
    "query": "select * where { \n\t?s ?p ?o .\n} limit 100 \n",
    "isPublic": false,
    "owner": "admin"
  },
];
