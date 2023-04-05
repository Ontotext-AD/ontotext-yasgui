let ontoElement = getOntotextYasgui('abort-query');

function onQueryAborted(req) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve();
    }, 1000);
  });
}


ontoElement.config = {
  ...ontoElement.config,
  onQueryAborted: (req) => {
    return new Promise(function (resolve) {
      setTimeout(function () {
        resolve();
      }, 1000);
    })
  }
}
