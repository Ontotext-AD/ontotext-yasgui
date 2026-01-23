let ontoElement = getOntotextYasgui();
ontoElement.config = {
  prefixes: getPrefixes(),
  yasqeAutocomplete: getYasqeAutocompleter()
};

function setDraculaTheme() {
  ontoElement.setTheme('dracula');
}

function setUndefinedTheme() {
  ontoElement.setTheme();
}

function configurOceanicNextTheme() {
  ontoElement.config = {...ontoElement.config, themeName: 'oceanic-next'}
}
