import en from '../i18n/locale-en.json'
import fr from '../i18n/locale-fr.json'
import {DEFAULT_LANG} from '../configurations/constants';
import {Translations} from '../models/yasgui-configuration';

export type LanguageChangeObserver = {
  name: string;
  notify: (language: string) => void;
}

export interface TranslationParameter {
  key: string;
  value: string;
}

/**
 * Service responsible for translation operations in the component.
 */
export class TranslationService {
  private currentLang = DEFAULT_LANG;

  private bundle = {en, fr}

  private languageChangeObservers: LanguageChangeObserver[] = [];

  /**
   * Sets the language which should be used for registered labels. If there is no registered bundle
   * for the provided language, then the default language will be set and used.
   * This method also notifies all registered LanguageChangeObserver's.
   *
   * @param lang The language to be set.
   */
  setLanguage(lang: string = DEFAULT_LANG): void {
    if (!this.bundle || !this.bundle[this.currentLang]) {
      console.warn(`Missing locale file for [${this.currentLang}]`);
      this.currentLang = DEFAULT_LANG;
    } else {
      this.currentLang = lang;
    }
    this.notifyLanguageChangeObservers(this.currentLang);
  }

  /**
   * Subscribes the observer for further language change events.
   *
   * @param observer The observer to be registered for the language change events.
   * @return Returns an unsubscribe function which can be called by the observer to unsubscribe
   * itself.
   */
  subscribeForLanguageChange(observer: LanguageChangeObserver): () => void {
    const existingObserverIndex = this.languageChangeObservers.findIndex((subscription) => subscription.name === observer.name);
    if (existingObserverIndex === -1) {
      this.languageChangeObservers.push(observer);
    }
    return () => this.unsubscribeFromLanguageChange(observer);
  }

  /**
   * Unsubscribes the observer from the language change events.
   * @param observer The observer to be unsubscribed.
   */
  unsubscribeFromLanguageChange(observer: LanguageChangeObserver): void {
    const existingObserverIndex = this.languageChangeObservers.findIndex((subscription) => subscription.name === observer.name);
    if (existingObserverIndex !== -1) {
      this.languageChangeObservers.splice(existingObserverIndex, 1);
    }
  }

  private notifyLanguageChangeObservers(currentLang: string) {
    this.languageChangeObservers.forEach((observer) => observer.notify(currentLang));
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

  /**
   * Translates the provided key using the currently selected language by applying the parameters if
   * provided.
   * @param key The key for the label which needs to be translated.
   * @param parameters Optional parameters which to be applied during the translation.
   */
  translate(key: string, parameters?: TranslationParameter[]): string {
    let translation = this.bundle[this.currentLang][key];
    if (!translation) {
      // Fallback to the default language
      translation = this.bundle[DEFAULT_LANG][key];
    }

    if (translation) {
      translation = this.applyParameters(translation, parameters);
      return translation;
    }

    console.warn(`Missing translation for [${key}] key in [${this.currentLang}] locale`);
    return key;
  }

  private applyParameters(translation: string, parameters: TranslationParameter[]): string {
    if (parameters) {
      return parameters.reduce(
        // replace all occurrence of parameter key with parameter value.
        (translation, parameter) => TranslationService.replaceAll(translation, parameter),
        translation);
    }
    return translation;
  }

  private static replaceAll(translation: string, parameter: TranslationParameter): string {
    return parameter ? translation.split(`{{${parameter.key}}}`).join(parameter.value) : translation;
  }
}

