export class YasrSteps {
    static getYasr() {
        return cy.get('.yasr');
    }

    static getResultHeader() {
        return cy.get('.yasr_header');
    }

    static getErrorHeader() {
        return cy.get('.errorHeader');
    }

    static getResults() {
        return cy.get('.yasr_results tbody').find('tr');
    }

    static getResultRow(rowNumber: number) {
        return this.getResults().eq(rowNumber);
    }

    static getResultCell(rowNumber: number, cellNumber: number) {
        return this.getResultRow(rowNumber).find('td').eq(cellNumber);
    }

    static hoverCell(rowNumber: number, cellNumber: number) {
        this.getResultCell(rowNumber, cellNumber).realHover();
    }

    static showSharedResourceLink(rowNumber: number, cellNumber: number) {
       return this.getResultCell(rowNumber, cellNumber)
          .realHover()
          .find('.resource-copy-link a');
    }

    static getCopyResourceLink(rowNumber: number, cellNumber: number) {
        return this.getResultCell(rowNumber, cellNumber)
          .find('.resource-copy-link a');
    }

    static clickOnCopyResourceLink(rowNumber: number, cellNumber: number) {
        this.showSharedResourceLink(rowNumber, cellNumber).realClick();
    }

    static clickCopyLinkDialogCloseButton() {
        this.getCopyResourceLinkDialog().find('.close-button').realClick();
    }

    static clickCopyLinkDialogCancelButton() {
        this.getCopyResourceLinkDialog().find('.cancel-button').realClick();
    }

    static clickCopyLinkDialogCopyButton() {
        this.getCopyResourceLinkDialog().find('.copy-button').realClick();
    }

    static clickOutsideCopyLinkDialog() {
        cy.get('body').click(0,0).realClick();
    }

    static attachMessageHandler() {
        cy.get('#attachMessageHandler').realClick();
    }

    static getMessage() {
        return cy.get('#copy-resourc-link-successfully-message');
    }

    static getCopyResourceLinkDialog() {
        return cy.get('.copy-resource-link-dialog');
    }

    static getCopyResourceLinkInput() {
       return this.getCopyResourceLinkDialog().find('input');
    }

    static getResultFilter() {
        return cy.get('.tableFilter');
    }
}
