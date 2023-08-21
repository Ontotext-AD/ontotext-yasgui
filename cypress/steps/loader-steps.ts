import {YasrSteps} from './yasr-steps';

export class LoaderSteps {
  static getLoaderMessage() {
    return YasrSteps.getYasr().find('.loaderMessage');
  }

  static getAdditionalLoaderMessage() {
    return YasrSteps.getYasr().shadow().find('.additional-loader-message');
  }
}
