let ontoElement = document.querySelector("ontotext-yasgui");
ontoElement.config = {
  endpoint: "/repositories/test-repo",
  prefixes: getPrefixes(),
  yasqeAutocomplete: getYasqeAutocompleter()
};
