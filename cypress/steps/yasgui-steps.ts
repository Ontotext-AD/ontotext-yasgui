export class YasguiSteps {
  static getYasguiTag() {
    return cy.get('ontotext-yasgui');
  }

  static getYasgui() {
    return cy.get('.yasgui');
  }

  static getTabs() {
    return cy.get('.tab');
  }

  static getCurrentTab() {
    return cy.get('.tab.active');
  }

  static getCurrentTabTitle() {
    return this.getCurrentTab().find('[role=tab] > div');
  }

  static openANewTab() {
    cy.get('button.addTab').click();
  }

  static getTab(index: number) {
    return this.getTabs().eq(index);
  }

  static openTab(index: number) {
    this.getTab(index).click();
  }

  static closeTab(index: number, withShift = false) {
    this.getTabs().eq(index).find('.closeTab').click({shiftKey: withShift});
  }

  static openTabContextMenu(index: number) {
    this.getTabs().eq(index).rightclick();
    return TabContextMenu.getContextMenu();
  }

  static isVerticalOrientation() {
    this.getYasguiTag().should('have.class', 'orientation-vertical');
  }

  static isHorizontalOrientation() {
    this.getYasguiTag().should('have.class', 'orientation-horizontal');
  }

  static getTooltipRoot() {
    return cy.get('div[data-tippy-root]');
  }

  static getTabName(tabIndex = 0) {
    return YasguiSteps.getTab(tabIndex).get('.preview-value');
  }

  static dblClickTab(tabIndex = 0) {
    YasguiSteps.getTabName(tabIndex).dblclick();
  }
}

export class EditableTabElement {

  static getSaveButton() {
    return cy.get('.save-btn');
  }

  static save() {
    EditableTabElement.getSaveButton().click();
  }

  static getCancelButton() {
    return cy.get('.cancel-btn');
  }

  static cancel() {
    EditableTabElement.getCancelButton().click();
  }

  static getValueInput() {
    return cy.get('.editable-text-field');
  }
}

export class TabContextMenu {
  static getContextMenu() {
    return cy.get('.yasgui .context-menu');
  }

  static closeTab() {
    this.getContextMenu().contains('Close Tab').click();
  }

  static closeOtherTabs() {
    this.getContextMenu().contains('Close other tabs').click();
  }

  static renameTabs() {
    this.getContextMenu().contains('Rename Tab').click();
  }
}
