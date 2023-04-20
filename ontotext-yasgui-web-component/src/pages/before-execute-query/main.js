let ontoElement = getOntotextYasgui('before-execute-query');

function setupErrorResult() {
  ontoElement.config = {
    ...ontoElement.config,
    i18n: {
      en: {
        'test.error.message': 'Before Update Query {{status}} Result.'
      }
    },
    beforeUpdateQuery: () => Promise.resolve({
      status: 'error',
      messageLabelKey: 'test.error.message',
      parameters: [{key: 'status', value: 'Error'}]
    })
  };
}


function setupSuccessResult() {
  ontoElement.config = {
    ...ontoElement.config,
    i18n: {
      en: {
        'test.error.message': 'Before Update Query {{status}} Result.'
      }
    },
    beforeUpdateQuery: () => Promise.resolve({
      status: 'success',
      messageLabelKey: 'test.error.message',
      parameters: [{key: 'status', value: 'Success'}]
    })
  };
}

