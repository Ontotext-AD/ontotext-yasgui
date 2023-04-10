import {YasrSteps} from './yasr-steps';

export class YasrCustomElementSteps {

  static getYasrCustomButton() {
    return cy.get('.yasr-custom-button');
  }

  static getElementCreatedAfterButtonClicked() {
    return cy.get('.element-created-after-button-clicked');
  }

  static getElementCreatedOnUpdate() {
    return cy.get('.element-created-on-update');
  }

  static clickOnYasrCustomButton() {
    this.getYasrCustomButton().realClick();
  }

  static getSecondElement() {
    return cy.get('.custom-button-wrapper-two');
  }

  static getYasrToolbarElement(indexOfElement: number) {
    return YasrSteps.getYasrToolbar().find('.yasr-toolbar-element').eq(indexOfElement);
  }
}
