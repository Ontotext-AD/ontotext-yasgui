let ontoElement = getOntotextYasgui('yasgui-component', "/repositories/rdf-star");

setOutputEventListener(ontoElement);

let textAreaElement = document.createElement('textarea');
textAreaElement.id = 'output';
document.body.appendChild(textAreaElement);
