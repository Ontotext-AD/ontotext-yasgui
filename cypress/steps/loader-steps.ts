export class LoaderSteps {

  static getLoader(index = 0) {
    return cy.get('loader-component').eq(index);
  }
}
