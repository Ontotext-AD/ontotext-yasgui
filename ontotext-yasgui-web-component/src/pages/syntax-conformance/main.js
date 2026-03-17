let ontoElement = getOntotextYasgui('syntax-conformance', '/repositories/test-repo');

setOutputEventListener(ontoElement);

let textAreaElement = document.createElement('textarea');
textAreaElement.id = 'output';
document.body.appendChild(textAreaElement);

