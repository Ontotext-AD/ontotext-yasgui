let ontoElement = document.querySelector('ontotext-yasgui');
ontoElement.config = {
  endpoint: '/repositories/test-repo',
  yasqeActionButtons: [],
  defaultTabName: 'Query',
  prefixes: {
    "gn": "http://www.geonames.org/ontology#",
    "path": "http://www.ontotext.com/path#",
    "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
    "xsd": "http://www.w3.org/2001/XMLSchema#",
    "owl": "http://www.w3.org/2002/07/owl#",
    "wgs": "http://www.w3.org/2003/01/geo/wgs84_pos#",
    "xml": "http://www.w3.org/XML/1998/namespace",
    "voc": "https://swapi.co/vocabulary/",
    "psys": "http://proton.semanticweb.org/protonsys#transitiveOver"
  },
  componentId: 'actions'
};

setQueryListener(ontoElement);

let textAreaElement = document.createElement('textarea');
textAreaElement.id = 'saveQueryPayload';
document.body.appendChild(textAreaElement);

let eventLog = document.createElement('textarea');
eventLog.id = 'eventLog';
document.body.appendChild(eventLog);

const urlString = window.location;
const url = new URL(urlString);
const query = url.searchParams.get('query');
const savedQueryName = url.searchParams.get('savedQueryName');
const name = url.searchParams.get('name');
if (query) {
  ontoElement.openTab({
    query: query,
    queryName: name
  });
} else if (savedQueryName) {
  ontoElement.openTab({
    query: query,
    queryName: savedQueryName
  });
}


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

function hideShareQueryAction() {
  ontoElement.config = {
    ...ontoElement.config,
    yasqeActionButtons: [
      {
        name: 'shareQuery',
        visible: false
      }
    ]
  };
}

function showShareQueryAction() {
  ontoElement.config = {
    ...ontoElement.config,
    yasqeActionButtons: [
      {
        name: 'shareQuery',
        visible: true
      }
    ]
  };
}

function showIncludeInferredAction() {
  ontoElement.config = {
    ...ontoElement.config,
    yasqeActionButtons: [
      {
        name: 'includeInferredStatements',
        visible: true
      }
    ]
  };
}

function hideIncludeInferredAction() {
  ontoElement.config = {
    ...ontoElement.config,
    yasqeActionButtons: [
      {
        name: 'includeInferredStatements',
        visible: false
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

ontoElement.addEventListener("output", (evt) => {
  if ("query" === evt.detail.TYPE) {
    eventLog.value = eventLog.value + '\n' + JSON.stringify(evt.detail.payload.query);
  }
});

ontoElement.addEventListener('queryResponse', (data) => {
  // eventLog.value = eventLog.value + '\n' + JSON.stringify(data.details);
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

ontoElement.addEventListener('shareQuery', (event) => {
  let selectedQuery = event.detail;
  const url = [location.protocol, '//', location.host, location.pathname];
  url.push(...[
    '?',
    `name=${encodeURIComponent(selectedQuery.queryName)}`,
    `&query=${encodeURIComponent(selectedQuery.query)}`,
    `&infer=true`,
    `&sameAs=true`,
  ])
  ontoElement.savedQueryConfig = {
    shareQueryLink: url.join('')
  };
  console.log('URL', url.join(''));
});

ontoElement.addEventListener('queryShareLinkCopied', () => {
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
