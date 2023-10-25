import {YasrSteps} from './yasr-steps';
import {ErrorPluginSteps} from './error-plugin-steps';
import {LoaderSteps} from './loader-steps';

export class YasqeSteps {
  static getYasqe() {
    return cy.get('.yasqe');
  }

  static getQueryTabs() {
    return cy.get('.tabsList');
  }

  static getTabs() {
    return YasqeSteps.getQueryTabs().find('.tab');
  }

  static getTabWithProgressBar() {
    return cy.get('.tab.active.querying');
  }

  static getEditor() {
    return cy.get(".yasqe:visible");
  }

  static getActionsToolbar() {
    return this.getEditor().find('.yasqe_buttons');
  }

  static setQueryInEditor(query: string) {
    cy.get('ontotext-yasgui')
      .then((el: JQuery<any>) => {
        el.get(0).setQuery(query);
      });
  }

  static getActionButtons() {
    return this.getActionsToolbar().find('.custom-button');
  }

  static getActionButton(index: number) {
    return this.getActionButtons().eq(index);
  }

  static getActionButtonsTooltips() {
    return this.getActionsToolbar().find('yasgui-tooltip');
  }

  static getActionButtonTooltip(index: number) {
    return this.getActionButtonsTooltips().eq(index);
  }

  static getRunQueryButton() {
    return cy.get('.yasqe_queryButton');
  }
  static getExecuteQueryButton(index = 0) {
    return YasqeSteps.getRunQueryButton().eq(index);
  }

  static executeQuery(index = 0) {
    this.getExecuteQueryButton(index).click();
    LoaderSteps.getLoader(index).should('not.be.visible');
    // Wait a wile for the response information to be present.
    YasrSteps.getResponseInfo(index)
      .should('not.have.class', 'hidden')
      .should('not.have.class', 'empty')
      .should('be.visible');
  }

  static executeQueryWithoutWaiteResult(index = 0) {
    this.getExecuteQueryButton(index).click();
  }

  static executeErrorQuery(index = 0) {
    this.getExecuteQueryButton(index).click();
    // Wait a wile for the response information to be present.
    ErrorPluginSteps.getErrorPlugin().should('be.visible');
  }

  static getExecuteQueryButtonTooltip() {
    return this.getExecuteQueryButton().parent();
  }

  static getCreateSavedQueryButton() {
    return cy.get('.yasqe_createSavedQueryButton');
  }

  static createSavedQuery(index = 0) {
    this.getCreateSavedQueryButton().eq(index).click();
  }

  static getSaveQueryDialog() {
    return cy.get('.dialog');
  }

  static closeSaveQueryDialog() {
    this.getSaveQueryDialog().find('.close-button').click();
  }

  static cancelSaveQuery() {
    this.getSaveQueryDialog().find('.cancel-button').click();
  }

  static getSaveQueryButton() {
    return this.getSaveQueryDialog().find('.ok-button');
  }

  static saveQuery() {
    this.getSaveQueryButton().click();
  }

  static getQueryField() {
    return this.getSaveQueryDialog().find('#query');
  }

  static writeQuery(query: string) {
    this.getQueryField().type(query, {parseSpecialCharSequences: false});
  }

  static clearQueryField() {
    this.getQueryField().clear();
  }

  static getErrorsPane() {
    return this.getSaveQueryDialog().find('.alert-danger');
  }

  static getErrors() {
    return this.getErrorsPane().find('.error-message');
  }

  static getQueryNameField() {
    return this.getSaveQueryDialog().find('#queryName');
  }

  static writeQueryName(queryName: string) {
    this.getQueryNameField().type(queryName);
  }

  static clearQueryNameField() {
    this.getQueryNameField().clear();
  }

  static getIsPublicField() {
    return this.getSaveQueryDialog().find('#publicQuery');
  }

  static toggleIsPublic() {
    this.getIsPublicField().click();
  }

  static getControlBar() {
    return cy.get('.controlbar');
  }

  static getShowSavedQueriesButton() {
    return cy.get('.yasqe_showSavedQueriesButton');
  }

  static showSavedQueries(index = 0) {
    // When more than one yasgui tabs are opened, then these buttons are the same number as the tabs
    this.getShowSavedQueriesButton().eq(index).click();
  }

  static getSavedQueriesPopup() {
    return cy.get('.saved-queries-popup');
  }

  static getSavedQueries() {
    return this.getSavedQueriesPopup().find('.saved-query');
  }

  static verifySavedQueries(data: { queryName: string }[]) {
    this.getSavedQueries().each((el, index) => {
      cy.wrap(el).should('contain', data[index].queryName);
    })
  }

  static selectSavedQuery(index: number) {
    this.getSavedQueries().eq(index).find('a').click();
  }

  static getTabQuery(tabIndex: number) {
    return cy.get('.yasqe .CodeMirror').then((el) => {
      return (el[tabIndex] as any).CodeMirror.getValue();
    });
  }

  static setTabQuery(tabIndex: number, query: string) {
    return cy.get('.yasqe .CodeMirror').then((el) => {
      return (el[tabIndex] as any).CodeMirror.setValue(query);
    });
  }

  static editQuery(index: number) {
    this.getSavedQueries().eq(index).realHover().find('.edit-saved-query').click();
  }

  static deleteQuery(index: number) {
    this.getSavedQueries().eq(index).realHover().find('.delete-saved-query').click();
  }

  static shareSavedQuery(index: number) {
    this.getSavedQueries().eq(index).realHover().find('.share-saved-query').click();
  }

  static getShareSavedQueryDialog() {
    return cy.get('.share-saved-query-dialog');
  }

  static getShareSavedQueryDialogTitle() {
    return this.getShareSavedQueryDialog().find('.dialog-title');
  }

  static closeShareSavedQueryDialog() {
    this.getShareSavedQueryDialog().find('.cancel-button').click();
  }

  static copySavedQueryShareLink() {
    this.getShareSavedQueryDialog().find('.copy-button').click();
  }

  static getShareSavedQueryLink() {
    return this.getShareSavedQueryDialog().find('.copy-link-form input')
  }

  static getShareQueryButton() {
    return cy.get('.yasqe_shareQueryButton');
  }

  static shareQuery() {
    this.getShareQueryButton().click();
  }

  static getIncludeInferredStatementsButton() {
    return cy.get('.yasqe_inferStatementsButton');
  }

  static includeInferredStatements() {
    this.getIncludeInferredStatementsButton().click();
  }

  static getExpandResultsOverSameAsButton() {
    return cy.get('.yasqe_expandResultsButton');
  }

  static getExpandResultsOverSameAsButtonTooltip() {
    return cy.get('.yasqe_expandResultsButton').parent();
  }

  static expandResultsOverSameAs() {
    this.getExpandResultsOverSameAsButton().click();
  }

  static toggleIncludeInferred() {
    this.getIncludeInferredStatementsButton().click();
  }

  static toggleExpandResults() {
    this.getExpandResultsOverSameAsButton().click();
  }

  static getCodeMirror() {
    return this.getEditor().find('.CodeMirror').then(($el) => {
      // @ts-ignore
      return $el[0].CodeMirror;
    });
  }

  static getQuery() {
    return this.getCodeMirror().then((cm) => {
      return cm.getValue();
    });
  }

  static clearEditor() {
    this.getCodeMirror().then((cm) => {
      cm.getDoc().setValue('');
    })
  }

  static writeInEditor(text: string, parseSpecialCharSequences = true) {
    this.getEditor().find('textarea').type(text, {force: true, parseSpecialCharSequences})
  }

  static setCursorOnLine(line: number) {
    this.getCodeMirror().then((cm) => {
      cm.getDoc().setCursor(--line);
    });
  }

  static getCursorLine() {
    return this.getCodeMirror().then((cm) => {
      return cm.getCursor().line + 1;
    });
  }

  static setCursorLine(line: number) {
    this.getCodeMirror().then((cm) => {
      const cursor = cm.getCursor();
      if (cursor) {
        cursor.line = line;
        cm.setCursor(cursor);
      }
    });
  }

  static getCursorLinePosition() {
    return this.getCodeMirror().then((cm) => {
      return cm.getCursor().ch;
    });
  }

  static setCursorLinePosition(linePosition: number) {
    this.getCodeMirror().then((cm) => {
      const cursor = cm.getCursor();
      if (cursor) {
        cursor.ch = linePosition;
        cm.setCursor(cursor);
      }
    });
  }

  static getAbortQueryButton() {
    return cy.get('.abort-button');
  }

  static hoverOverAbortQueryButton() {
    YasqeSteps.getAbortQueryButton().realHover();
  }

  static getAbortQueryTooltip() {
    return YasqeSteps.getAbortQueryButton().parent();
  }
}
