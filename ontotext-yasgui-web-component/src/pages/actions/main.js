let ontoElement = document.querySelector('ontotext-yasgui');
ontoElement.config = {
  endpoint: '/repositories/test-repo',
  yasqeActionButtons: []
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

ontoElement.addEventListener('createSavedQuery', (event) => {
  textAreaElement.value = JSON.stringify(event.detail);
});

