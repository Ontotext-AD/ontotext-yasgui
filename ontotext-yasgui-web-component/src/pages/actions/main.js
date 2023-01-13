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

const savedQueryStorage = {};

ontoElement.addEventListener('createSavedQuery', (event) => {
  let data = event.detail;
  textAreaElement.value = JSON.stringify(data);

  // emulate duplicated query name error
  if (savedQueryStorage[data.queryName]) {
    ontoElement.config = {
      ...ontoElement.config,
      savedQuery: {
        saveSuccess: false,
        errorMessage: ['Query name already exist!']
      }
    };
  } else {
    savedQueryStorage[data.queryName] = data;
    ontoElement.config = {
      ...ontoElement.config,
      savedQuery: {
        saveSuccess: true
      }
    };
  }
});

ontoElement.addEventListener('loadSavedQueries', (event) => {
  console.log('loadSavedQueries event', event);
  ontoElement.config = {
    ...ontoElement.config,
    savedQueries: {
      data: savedQueries
    }
  };
});

const savedQueries = [
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
    "query": "slect * where { \n\t?s ?p ?o .\n} limit 100 \n",
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
