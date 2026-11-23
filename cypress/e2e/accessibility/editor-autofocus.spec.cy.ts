import DefaultViewPageSteps from '../../steps/default-view-page-steps';
import {AutofocusPageSteps} from '../../steps/pages/autofocus-page-steps';
import {YasguiSteps} from '../../steps/yasgui-steps';
import {YasqeSteps} from '../../steps/yasqe-steps';

describe('Editor autofocus', () => {

  describe('When autofocus is turned off', () => {
    beforeEach(() => {
      AutofocusPageSteps.visit();
      YasqeSteps.getEditor().should('be.visible');
    });

    it('should not focus the editor when the component loads', () => {
      // Then I expect the focus not to be in the editor
      YasqeSteps.getFocusedElementInEditor().should('not.exist');
    });

    it('should keep the focus on the tab when a tab is selected', () => {
      // Given I have opened a second tab
      YasguiSteps.openANewTab();
      YasguiSteps.getTabs().should('have.length', 2);

      // When I click on the first tab
      YasguiSteps.getTabListTab(0).click();

      // Then I expect the first tab to be selected
      YasguiSteps.getTabListTab(0).should('have.attr', 'aria-selected', 'true');
      // And the focus to stay on it
      YasguiSteps.getTabListTab(0).should('be.focused');
      YasqeSteps.getFocusedElementInEditor().should('not.exist');
    });
  });

  it('should focus the editor when the component loads by default', () => {
    // When I open a page with the default configuration
    DefaultViewPageSteps.visit();

    // Then I expect the editor to be focused
    YasqeSteps.getEditorInput().should('be.focused');
  });
});
