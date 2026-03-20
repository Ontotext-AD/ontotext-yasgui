let ontoElement = getOntotextYasgui('yasgui-component', '/repositories/yasr-geo-plugin');

setOutputEventListener(ontoElement);

let textAreaElement = document.createElement('textarea');
textAreaElement.id = 'output';
document.body.appendChild(textAreaElement);

function configureOnClickFeatureHandler() {
  ontoElement.config = {
    ...ontoElement.config,
    pluginsConfigurations: {
      geo: {
        onFeatureClick: (featureProperties) => {
          textAreaElement.value = JSON.stringify(featureProperties);
        }
      }
    }
  }
}
