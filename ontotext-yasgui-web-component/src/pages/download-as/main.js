let ontoElement = document.querySelector("ontotext-yasgui");
ontoElement.config = {
  endpoint: "/repositories/test-repo",
  prefixes: getPrefixes()
};

ontoElement.addEventListener('output', (event) => {
  const div = document.getElementById('download-as-event');
  div.innerText = JSON.stringify(event.detail);
});

function setConfiguration() {
  ontoElement.config = {
    ...ontoElement.config,
    pluginsConfigurations: {
      extended_table: {
        downloadAsConfig: {
          items: {
            'SELECT': [
              {
                labelKey: "yasr.plugin_control.download_as.sparql_results_json.label",
                value: "application/sparql-results+json",
              },
              {
                labelKey: "yasr.plugin_control.download_as.x_sparqlstar_results_json.label",
                value: "application/x-sparqlstar-results+json",
              },
              {
                labelKey: "yasr.plugin_control.download_as.csv.label",
                value: "text/csv",
              },
            ]
          }
        }
      }
    }
  }
}

function turnOffDownloadAs() {
  ontoElement.config = {...ontoElement.config, downloadAsOn: false};
}
