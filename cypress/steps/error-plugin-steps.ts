export class ErrorPluginSteps {

  static getErrorPlugin() {
    return cy.get('.error-response-plugin');
  }

  static getErrorPluginHeader() {
    return ErrorPluginSteps.getErrorPlugin().find('.error-response-plugin-header');
  }

  static getErrorPluginErrorStatus() {
    return ErrorPluginSteps.getErrorPluginHeader().find('.error-response-plugin-error-status');
  }

  static getErrorPluginErrorTimeMessage() {
    return ErrorPluginSteps.getErrorPluginHeader().find('.error-response-plugin-error-time-message');
  }

  static getErrorPluginBody() {
    return ErrorPluginSteps.getErrorPlugin().find('.error-response-plugin-body');
  }
}
