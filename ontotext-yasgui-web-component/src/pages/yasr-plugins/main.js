const ontoElement = getOntotextYasgui();

setQueryListener(ontoElement);

function attachMessageHandler() {
  ontoElement.addEventListener('output', (event) => {
    if ('notificationMessage' === event.detail.TYPE) {
      const div = document.createElement('div');
      div.innerHTML = `<div id="copy-resourc-link-successfully-message">${JSON.stringify(event.detail)}</div>`;
      document.body.appendChild(div);
    }
  });
}
