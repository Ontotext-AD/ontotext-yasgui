export class YasqeThemesSteps {
  static visit() {
    cy.visit('/pages/themes');
  }

  static getConfigurOceanicNextThemeBtn() {
    return cy.get('#configurOceanicNextTheme');
  }

  static configureOceanicNextTheme() {
    YasqeThemesSteps.getConfigurOceanicNextThemeBtn().click();
  }

  static getSetDraculaThemeButton() {
    return cy.get('#setDraculaTheme');
  }

  static setDraculaTheme() {
    YasqeThemesSteps.getSetDraculaThemeButton().click();
  }

  static getSetUndefinedThemeButton() {
    return cy.get('#setUndefinedTheme');
  }

  static setUndefinedTheme() {
    YasqeThemesSteps.getSetUndefinedThemeButton().click();
  }
}
