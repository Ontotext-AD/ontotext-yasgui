import AutocompletePageSteps from "../../steps/pages/autocomplete-page-steps";
import { YasqeSteps } from "../../steps/yasqe-steps";

describe("Geo SPARQL variables autocomplete", () => {

  beforeEach(() => {
    AutocompletePageSteps.visit();
  });

  it("Should show all geo variable suggestions when typing a variable with underscore", () => {
    YasqeSteps.clearEditor();
    YasqeSteps.writeInEditor("select * where {{} ?geo_");
    cy.get(".CodeMirror-hints").should("be.visible");
    cy.get(".CodeMirror-hints .CodeMirror-hint").should("have.length", 7);
    cy.get(".CodeMirror-hints .CodeMirror-hint").eq(0).should("contain", "?geo_color");
    cy.get(".CodeMirror-hints .CodeMirror-hint").eq(1).should("contain", "?geo_fillColor");
    cy.get(".CodeMirror-hints .CodeMirror-hint").eq(2).should("contain", "?geo_fillOpacity");
    cy.get(".CodeMirror-hints .CodeMirror-hint").eq(3).should("contain", "?geo_opacity");
    cy.get(".CodeMirror-hints .CodeMirror-hint").eq(4).should("contain", "?geo_popup");
    cy.get(".CodeMirror-hints .CodeMirror-hint").eq(5).should("contain", "?geo_tooltip");
    cy.get(".CodeMirror-hints .CodeMirror-hint").eq(6).should("contain", "?geo_weight");
  });

  it("Should filter suggestions based on partial suffix", () => {
    YasqeSteps.clearEditor();
    YasqeSteps.writeInEditor("select * where {{} ?geo_pop");
    cy.get(".CodeMirror-hints").should("be.visible");
    cy.get(".CodeMirror-hints .CodeMirror-hint").should("have.length", 1);
    cy.get(".CodeMirror-hints .CodeMirror-hint").eq(0).should("contain", "?geo_popup");
  });

  it("Should not show suggestions for variables with multiple underscores", () => {
    YasqeSteps.clearEditor();
    YasqeSteps.writeInEditor("select * where {{} ?geo_node_");
    cy.get(".CodeMirror-hints").should("not.exist");
  });

  it("Should not show suggestions for variables with multiple underscores and partial suffix", () => {
    YasqeSteps.clearEditor();
    YasqeSteps.writeInEditor("select * where {{} ?geo_layer_pop");
    cy.get(".CodeMirror-hints").should("not.exist");
  });

  it("Should apply selected geo variable suggestion", () => {
    YasqeSteps.clearEditor();
    YasqeSteps.writeInEditor("select * where {{} ?geo_pop");
    cy.get(".CodeMirror-hints").should("be.visible");
    cy.get(".CodeMirror-hints .CodeMirror-hint").eq(0).click();
    YasqeSteps.getQuery().should("contain", "?geo_popup");
  });

  it("Should show all geo variable suggestions when typing a variable with $ prefix and underscore", () => {
    YasqeSteps.clearEditor();
    YasqeSteps.writeInEditor("select * where {{} $geo_");
    cy.get(".CodeMirror-hints").should("be.visible");
    cy.get(".CodeMirror-hints .CodeMirror-hint").should("have.length", 7);
    cy.get(".CodeMirror-hints .CodeMirror-hint").eq(0).should("contain", "$geo_color");
    cy.get(".CodeMirror-hints .CodeMirror-hint").eq(1).should("contain", "$geo_fillColor");
    cy.get(".CodeMirror-hints .CodeMirror-hint").eq(2).should("contain", "$geo_fillOpacity");
    cy.get(".CodeMirror-hints .CodeMirror-hint").eq(3).should("contain", "$geo_opacity");
    cy.get(".CodeMirror-hints .CodeMirror-hint").eq(4).should("contain", "$geo_popup");
    cy.get(".CodeMirror-hints .CodeMirror-hint").eq(5).should("contain", "$geo_tooltip");
    cy.get(".CodeMirror-hints .CodeMirror-hint").eq(6).should("contain", "$geo_weight");
  });

  it("Should filter suggestions matching fill prefix", () => {
    YasqeSteps.clearEditor();
    YasqeSteps.writeInEditor("select * where {{} ?geo_fill");
    cy.get(".CodeMirror-hints").should("be.visible");
    cy.get(".CodeMirror-hints .CodeMirror-hint").should("have.length", 2);
    cy.get(".CodeMirror-hints .CodeMirror-hint").eq(0).should("contain", "?geo_fillColor");
    cy.get(".CodeMirror-hints .CodeMirror-hint").eq(1).should("contain", "?geo_fillOpacity");
  });

  it("Should not show autocomplete for variables without underscore", () => {
    YasqeSteps.clearEditor();
    YasqeSteps.writeInEditor("select * where {{} ?geo");
    cy.get(".CodeMirror-hints").should("not.exist");
  });
});
