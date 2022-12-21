let ontoElement = document.querySelector('ontotext-yasgui');
ontoElement.config = {
  defaultYasguiConfiguration: {
    requestConfig: {
      endpoint: '/repositories/test-repo'
    }
  }
};

ontoElement.addEventListener("queryExecuted", () => {
  console.log('>>>queryExecuted', );
  const div = document.createElement('div');
  div.innerHTML = '<div id="queryRan">Query was Executed</div>';
  document.body.appendChild(div);
});

ontoElement.addEventListener('queryResponse', () => {
  console.log('>>>>queryResponse', );
  const div = document.createElement('div');
  div.innerHTML = '<div id="queryResponse">Query response</div>';
  document.body.appendChild(div);
});
