import en from '../i18n/locale-en.json'
import fr from '../i18n/locale-fr.json'
import {DEFAULT_LANG} from '../configurations/constants';

class TranslationServiceDefinition {

  private currentLang = DEFAULT_LANG;

  private bundle = {en, fr}

  setLanguage(lang: string) {
    this.currentLang = lang;
  }

  /**
   * Merges external i18e configuration with bundled one.
   * * @param translations - external i18e configuration.
   * Key -> value translations as JSON. If the language is supported, then not needed to pass all label values.
   * If pass a new language then all label's values have to be present, otherwise they will be translated to the default English language.
   * Example:
   * {
   *   en: {
   *     "tooltip.switch.orientation.horizontal": "Switch to horizontal view",
   *     "tooltip.switch.orientation.vertical": "Switch to vertical view",
   *     "btn.mode-yasqe": "Editor only",
   *     "btn.mode-yasgui": "Editor and results",
   *     "btn.mode-yasr": "Results only",
   *   }
   *   fr: {
   *     "tooltip.switch.orientation.vertical": "Basculer vers verticale voir",
   *     "btn.mode-yasqe": "Éditeur seulement",
   *   }
   * }
   */
  addTranslations(translations: { locale: { key: string, value: string } }) {
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
    let translation = this.getTranslation(key);
    translation = this.applyParameters(translation, parameters);
    return translation ? translation : key;
  }

  private getTranslation(key: string): string {
    let selectedLang = this.currentLang;
    if (!this.bundle || !this.bundle[this.currentLang]) {
      console.warn('Missing locale file for [' + this.currentLang + ']');
      selectedLang = DEFAULT_LANG;
    }

    let translation = this.bundle[selectedLang][key];
    if (!translation) {
      // Fallback to English
      translation = this.bundle[DEFAULT_LANG][key];
    }

    if (translation) {
      return translation;
    }

    console.warn('Missing translation for [' + key + '] key in [' + selectedLang + '] locale');
  }

  private applyParameters(translation: string, parameters: TranslationParameter[]): string {
    if (translation && parameters) {
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

export const TranslationService = new TranslationServiceDefinition();

interface TranslationParameter {
  key: string;
  value: string;
}
