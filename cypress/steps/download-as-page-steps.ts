import {YasguiSteps} from './yasgui-steps';

export class DownloadAsPageSteps {

  static visit() {
    cy.visit('/pages/download-as');
  }

  static getDownloadAsDropdown() {
    return YasguiSteps.getYasgui().find('ontotext-yasgui-download-as');
  }

  static openDownloadAsDropdown() {
    DownloadAsPageSteps.getDownloadAsDropdown().click();
  }

  static getDownloadAsOption(label: string) {
    return DownloadAsPageSteps.getDownloadAsDropdown().find(`.ontotext-yasgui-dropdown-menu-item:contains(${label})`)
  }

  static getDownloadAsOptions() {
    return DownloadAsPageSteps.getDownloadAsDropdown().find('.ontotext-yasgui-dropdown-menu-item');
  }

  static getCsvDownloadOption() {
    return DownloadAsPageSteps.getDownloadAsOption('CSV');
  }

  static downloadAsCsv() {
    DownloadAsPageSteps.getCsvDownloadOption().realClick();
  }

  static getJSONDownloadOption() {
    return DownloadAsPageSteps.getDownloadAsOption('JSON');
  }

  static downloadAsJSON() {
    DownloadAsPageSteps.getJSONDownloadOption().realClick();
  }

  static getBinaryResultDownloadOption() {
    return DownloadAsPageSteps.getDownloadAsOption('Binary RDF Results');
  }

  static downloadAsBinary() {
    DownloadAsPageSteps.getBinaryResultDownloadOption().realClick();
  }

  static getDownloadAsEventElement() {
    return cy.get('#download-as-event');
  }

  static configWithExternalConfiguration() {
    cy.get('#external-configuration').realClick();
  }
}
