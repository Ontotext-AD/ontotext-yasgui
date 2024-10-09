import {YasrCustomElementPageSteps} from '../../../steps/pages/yasr-custom-element-page-steps';
import {YasrCustomElementSteps} from '../../../steps/yasr-custom-element-steps';
import {YasqeSteps} from '../../../steps/yasqe-steps';
import {YasrSteps} from '../../../steps/yasr-steps';

describe('YASR toolbar', () => {
  beforeEach(() => {
    YasrCustomElementPageSteps.visit();
  });

  it('Should display a custom button configured by user', {
    retries: {
      runMode: 1,
      openMode: 0
    }
  }, () => {
    // When I visit a page with "ontotext-yasgui-web-component",
    // and configured a yasr toolbar button.
    // When I execute a query, so yasr (yasr toolbar) to be visible.
    YasqeSteps.executeQuery();

    // Then I expect to see the custom button visible,
    YasrCustomElementSteps.getYasrCustomButton().should('be.visible');
    // and update method to be called.
    YasrCustomElementSteps.getElementCreatedOnUpdate().should('be.visible');

    // When I click on the custom button.
    YasrCustomElementSteps.clickOnYasrCustomButton();

    // Then I expect the button to bee clicked.
    YasrCustomElementSteps.getElementCreatedAfterButtonClicked().should('be.visible');
  });

  it('Should render ordered plugins', () => {
    // Given I have opened a page with a yasgui and configured yasr toolbar button.
    // When I execute a query, so yasr toolbar to become visible.
    YasqeSteps.executeQuery();

    YasrCustomElementSteps.getYasrToolbarElement(0).contains('Download as');
    // hidden pivot table download button
    YasrCustomElementSteps.getYasrToolbarElement(1).should('have.class', 'hidden');
    // hidden chart download button
    YasrCustomElementSteps.getYasrToolbarElement(2).should('have.class', 'hidden');
    YasrCustomElementSteps.getYasrToolbarElement(3).contains('Second described Element that have to be first');
    YasrCustomElementSteps.getYasrToolbarElement(4).contains('Custom button');

    // When I open "Pivot Table" tab.
    YasrSteps.openPivotPluginTab();

    // Then I expect pivot download button to be visible download
    YasrCustomElementSteps.getYasrToolbarElement(0).should('have.class', 'hidden');
    YasrCustomElementSteps.getYasrToolbarElement(1).contains('Download result');
    // hidden chart download button
    YasrCustomElementSteps.getYasrToolbarElement(2).should('have.class', 'hidden');
    YasrCustomElementSteps.getYasrToolbarElement(3).contains('Second described Element that have to be first');
    YasrCustomElementSteps.getYasrToolbarElement(4).contains('Custom button');
  });
});
