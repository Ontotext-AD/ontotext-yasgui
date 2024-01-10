let ontoElement = getOntotextYasgui();

function changeActionButtonVisibility(actionButtonName, hide) {
  if (hide) {
    ontoElement.hideYasqeActionButton(actionButtonName);
  } else {
    ontoElement.showYasqeActionButton(actionButtonName);
  }
}

function changeRenderMode(renderMode) {
  ontoElement.changeRenderMode(renderMode);
}

function resetResults() {
  ontoElement.resetResults();
}
