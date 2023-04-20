import {YasrCustomElementPageSteps} from '../../../steps/pages/yasr-custom-element-page-steps';
import {YasrCustomElementSteps} from '../../../steps/yasr-custom-element-steps';
import {YasqeSteps} from '../../../steps/yasqe-steps';

describe('Configuration of yasr toolbar custom element.', () => {
  beforeEach(() => {
    YasrCustomElementPageSteps.visit();
  });

  it('should display a custom button configured by user .', {
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

  it('should elements be ordered', () => {
    // When I visit a page with "ontotext-yasgui-web-component",
    // and configured a yasr toolbar button.
    // When I execute a query, so yasr (yasr toolbar) to be visible.
    YasqeSteps.executeQuery();


    YasrCustomElementSteps.getYasrToolbarElement(0).contains('Download as');
    YasrCustomElementSteps.getYasrToolbarElement(1).contains('Second described Element that have to be first');
    YasrCustomElementSteps.getYasrToolbarElement(2).contains('Custom button');
  });
});
