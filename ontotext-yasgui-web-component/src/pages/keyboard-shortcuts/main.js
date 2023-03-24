let ontoElement = getOntotextYasgui();

ontoElement.addEventListener('output', (evt) => {
  if ('notificationMessage' === evt.detail.TYPE) {
    document.getElementById('actionOutputField').value = JSON.stringify(evt.detail.payload);
  }
});

function setVirtualRepository() {
  ontoElement.config = {... ontoElement.config, isVirtualRepository: true}
}
