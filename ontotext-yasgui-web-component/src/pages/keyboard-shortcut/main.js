let ontoElement = getOntotextYasgui();

function switchOffKeyboardShortcuts() {
  ontoElement.config = {...ontoElement.config, keyboardShortcutEnabled: false}
}
