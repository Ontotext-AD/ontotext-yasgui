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

const savedQueries = [
  {
    "name": "Add statements",
    "body": "PREFIX dc: <http://purl.org/dc/elements/1.1/>\nINSERT DATA\n      {\n      GRAPH <http://example> {\n          <http://example/book1> dc:title \"A new book\" ;\n                                 dc:creator \"A.N.Other\" .\n          }\n      }",
    "shared": false,
    "owner": "admin"
  },
  {
    "name": "Clear graph",
    "body": "CLEAR GRAPH <http://example>",
    "shared": false,
    "owner": "admin"
  },
  {
    "name": "new query",
    "body": "select *",
    "shared": true,
    "owner": "admin"
  },
  {
    "name": "q1",
    "body": "select * where { \n\t?s ?p ?o .\n} limit 100 \n",
    "shared": false,
    "owner": "admin"
  }
];
ontoElement.addEventListener('loadSavedQueries', (event) => {
  console.log('loadSavedQueries event', event);
  ontoElement.config = {
    ...ontoElement.config,
    savedQueries: {
      data: savedQueries
    }
  };
});
