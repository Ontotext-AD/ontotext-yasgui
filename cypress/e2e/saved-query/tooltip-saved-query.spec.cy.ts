import ActionsPageSteps from '../../steps/pages/actions-page-steps';
import {YasqeSteps} from '../../steps/yasqe-steps';
import {YasguiFloatingTooltipSteps} from '../../steps/yasgui-floating-tooltip-steps';

describe('Saved query tooltip', () => {
  it('should show tooltip with saved query name', () => {
    // GIVEN: I have opened a page containing the YASGUI component.
    ActionsPageSteps.visit();

    // WHEN: I hover over a saved query.
    YasqeSteps.showSavedQueries();
    YasqeSteps.hoverSavedQuery();
    // THEN: I see a tooltip displaying the query name.
    YasguiFloatingTooltipSteps.getTooltipElement().should('be.visible');
    YasguiFloatingTooltipSteps.getTooltipElement().should('have.text', 'Add statements');

    // WHEN: I hover over another saved query.
    YasqeSteps.hoverSavedQuery(1);
    // THEN: I see a tooltip displaying the second query name.
    YasguiFloatingTooltipSteps.getTooltipElement().should('have.text', 'Clear graph');
  });
});
