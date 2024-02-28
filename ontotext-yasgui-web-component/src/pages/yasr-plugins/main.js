const ontoElement = getOntotextYasgui('yasr-plugins');

setOutputEventListener(ontoElement);

let textAreaElement = document.createElement('textarea');
textAreaElement.id = 'output';
document.body.appendChild(textAreaElement);

function attachMessageHandler() {
  ontoElement.addEventListener('output', (event) => {
    if ('notificationMessage' === event.detail.TYPE) {
      const div = document.createElement('div');
      div.innerHTML = `<div id="copy-resourc-link-successfully-message">${JSON.stringify(event.detail)}</div>`;
      document.body.appendChild(div);
    }
  });
}

function configureSmallResizableColumns() {
  ontoElement.config = {
    ...ontoElement.config,
    maxResizableResultsColumns: 3
  }
}
