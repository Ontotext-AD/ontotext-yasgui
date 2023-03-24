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

    static openANewTab() {
        cy.get('button.addTab').click();
    }

    static openTab(index: number) {
        this.getTabs().eq(index).click();
    }

    static closeTab(index: number) {
        this.getTabs().eq(index).find('.closeTab').click();
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
}

export class TabContextMenu {
  static getContextMenu() {
    return cy.get('.yasgui .context-menu');
  }

  static closeTab() {
    this.getContextMenu().contains('Close Tab').click();
  }
}
