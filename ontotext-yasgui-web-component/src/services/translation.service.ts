import en from '../i18n/locale-en.json'
import fr from '../i18n/locale-fr.json'
import {DEFAULT_LANG} from '../configurations/constants';
import {Translations} from '../models/yasgui-configuration';

export class TranslationService {
  private currentLang = DEFAULT_LANG;

  private bundle = {en, fr}

  setLanguage(lang: string = DEFAULT_LANG) {
    if (!this.bundle || !this.bundle[this.currentLang]) {
      console.warn('Missing locale file for [' + this.currentLang + ']');
      this.currentLang = DEFAULT_LANG;
    } else {
      this.currentLang = lang;
    }
  }

  /**
   * Merges external i18e  configuration with bundled one.
   * * @param translations - external i18e configuration.
   * Key -> value translations as JSON. If the language is supported, then not needed to pass all label values.
   * If pass a new language then all label's values have to be present, otherwise they will be translated to the default English language.
   * Example:
   * {
   *   en: {
   *     "yasgui.toolbar.orientation.btn.tooltip.switch_orientation_horizontal": "Switch to horizontal view",
   *     "yasgui.toolbar.orientation.btn.tooltip.switch_orientation_vertical": "Switch to vertical view",
   *     "yasgui.toolbar.mode_yasqe.btn.label": "Editor only",
   *     "yasgui.toolbar.mode_yasgui.btn.label": "Editor and results",
   *     "yasgui.toolbar.mode_yasr.btn.label": "Results only",
   *   }
   *   fr: {
   *     "yasgui.toolbar.orientation.btn.tooltip.switch_orientation_vertical": "Basculer vers verticale voir",
   *     "yasgui.toolbar.mode_yasqe.btn.label": "Éditeur seulement",
   *   }
   * }
   */
  addTranslations(translations: Translations) {
    Object.keys(translations).forEach((language) => {
      // If is new language add it all
      if (!this.bundle[language]) {
        this.bundle[language] = translations[language];
      } else {
        // merge passed key -> values
        Object.assign(this.bundle[language], translations[language]);
      }
    });
  }

  translate(key: string, parameters?: TranslationParameter[]): string {
    let translation = this.bundle[this.currentLang][key];
    if (!translation) {
      // Fallback to English
      translation = this.bundle[DEFAULT_LANG][key];
    }

    if (translation) {
      translation = this.applyParameters(translation, parameters);
      return translation;
    }

    console.warn('Missing translation for [' + key + '] key in [' + this.currentLang + '] locale');
    return key;
  }

  private applyParameters(translation: string, parameters: TranslationParameter[]): string {
    if (parameters) {
      return parameters.reduce(
        // replace all occurrence of parameter key with parameter value.
        (translation, parameter) => this.replaceAll(translation, parameter),
        translation);
    }
    return translation;
  }

  private replaceAll(translation: string, parameter: TranslationParameter): string {
    return parameter ? translation.split(`{{${parameter.key}}}`).join(parameter.value) : translation;
  }
}

export interface TranslationParameter {
  key: string;
  value: string;
}
