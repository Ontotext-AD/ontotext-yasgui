import DefaultViewPageSteps from '../../steps/default-view-page-steps';
import {EditableTabElement, TabContextMenu, YasguiSteps} from '../../steps/yasgui-steps';

describe('Rename tab functionality', () => {
  beforeEach(() => {
    DefaultViewPageSteps.visit();
  });

  it('should not save changed name of tab when cancel operation', () => {
    YasguiSteps.getTabName(0).should('have.text', 'Unnamed');
    // When I open a tab name editor,
    openTabNameEditor('Unnamed');
    // and change the name of the tab,
    EditableTabElement.getValueInput().invoke('val', '').type('New Value');
    // and click on cancel button
    EditableTabElement.cancel();

    // Then I expect the tab name do not be changed,
    verifyEditorClosed('Unnamed');

    // When I click on rename tab from context menu.
    YasguiSteps.openTabContextMenu(0);
    TabContextMenu.renameTabs();

    // Then I expect to see an input with value the tab name
    verifyEditorOpen('Unnamed');

    // When I change the name of the tab,
    EditableTabElement.getValueInput().invoke('val', '').type('New Value');
    // and click outside the tab name editor.
    cy.get('body').click();

    // Then I expect the tab name to be changed.
    verifyEditorClosed('New Value');
  });

  it('should not save changed name of tab when "Escape" button is pressed', () => {
    YasguiSteps.getTabName(0).should('have.text', 'Unnamed');
    // When I open a tab name editor,
    openTabNameEditor('Unnamed');
    // and change the name of the tab,
    EditableTabElement.getValueInput().invoke('val', '').type('New Value');
    // and click on cancel button
    EditableTabElement.pressEscape();

    // Then I expect the tab name do not be changed,
    verifyEditorClosed('Unnamed');
  });

  it('should rename tab when click on save button', () => {
    // When I open the tab name editor,
    YasguiSteps.getTabName(0).should('have.text', 'Unnamed');
    YasguiSteps.dblClickTab(0);
    // and change tab name,
    EditableTabElement.getValueInput().invoke('val', '').type('New Value');
    // and click on save button.
    EditableTabElement.save();

    // Then I expect the tab name has been renamed.
    YasguiSteps.getTabName(0).should('have.text', 'New Value');
  });

  it('should rename the tab when I click on enter key', () => {
    // When I open the tab name editor,
    YasguiSteps.getTabName(0).should('have.text', 'Unnamed');
    YasguiSteps.dblClickTab(0);
    // and change tab name,
    EditableTabElement.getValueInput().invoke('val', '').type('New Value');
    // and press the enter keyboard key.
    EditableTabElement.pressEnter();

    // Then I expect the tab name has been renamed.
    YasguiSteps.getTabName(0).should('have.text', 'New Value');
  });
});

const openTabNameEditor = (tabName: string) => {
  // When I double-click on a Tab.
  YasguiSteps.dblClickTab(0);
  verifyEditorOpen(tabName);
}

const verifyEditorOpen = (tabName: string) => {
  EditableTabElement.getValueInput().should('be.visible');
  EditableTabElement.getValueInput().should('have.value', tabName);
  EditableTabElement.getSaveButton().should('be.visible');
  EditableTabElement.getCancelButton().should('be.visible');
}

const verifyEditorClosed = (tabName: string) => {
  // Then I expect the tab name do not be changed,
  YasguiSteps.getTabName(0).should('have.text', tabName);
  EditableTabElement.getValueInput().should('not.exist');
  EditableTabElement.getSaveButton().should('not.exist');
  EditableTabElement.getCancelButton().should('not.exist');
}
