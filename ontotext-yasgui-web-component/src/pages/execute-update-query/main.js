let ontoElement = getOntotextYasgui();
let repoStatementsCount = 4;

function setupTwoStatementsAffected(numberOfAffectedStatements) {
  ontoElement.config = {
    ...ontoElement.config,
    getRepositoryStatementsCount: () => {
      repoStatementsCount += numberOfAffectedStatements;
      return Promise.resolve(repoStatementsCount);
    }
  }
}


