const ontoElement = document.querySelector("ontotext-yasgui");
ontoElement.config = {
  endpoint: "/repositories/test-repo",
  showToolbar: true
};

function changeLanguage(lang) {
  ontoElement.language = lang;
}

function setTranslation() {
  ontoElement.config = {...ontoElement.config,
    i18n: {
      en: {
        "btn.mode-yasqe": "Editor only passed from external configuration",
        "yasr.name.raw_response": "Raw Response",
        "yasr.headers.columns": "Columns",
        "yasr.headers.rows": "Rows",
      },
      bg: {
        "btn.mode-yasqe": "Само едитор",
      }
    }
  }
}
