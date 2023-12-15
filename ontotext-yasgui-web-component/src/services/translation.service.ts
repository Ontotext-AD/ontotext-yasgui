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

type TranslationCallback = (translation: string) => void;

interface TranslationObserver {
  parameters: TranslationParameter[];
  callback: TranslationCallback;
}

/**
 * Service responsible for translation operations in the component.
 */
export class TranslationService {
  private currentLang = DEFAULT_LANG;

  private bundle = {en, fr}

  private languageChangeObservers: LanguageChangeObserver[] = [];
  private translationChangedObservers: Record<string, TranslationObserver[]> = {};

  public getCurrentLang(): string {
    return this.currentLang;
  }

  /**
   * Translates the <code>messageLabelKey</code> with <code>translationParameter</code> and call <code>translationCallback</code> with translation of current language.
   * The <code>translationCallback</code> is called upon subscription and whenever the selected language is changed.
   *
   * @param messageLabelKey - The label key for the translation.
   * @param translationCallback - A function to be called when translating the `messageLabelKey`.
   * @param translationParameter - Parameters, if needed, for translation.
   * @returns A function that, when called, unsubscribes the provided callback from further translation updates.
   */
  public onTranslate(messageLabelKey: string, translationCallback: TranslationCallback = () => {/*do nothing*/}, translationParameter: TranslationParameter[] = []) {
    this.translationChangedObservers[messageLabelKey] = this.translationChangedObservers[messageLabelKey] || [];

    const observer: TranslationObserver = {parameters: translationParameter, callback: translationCallback};
    this.translationChangedObservers[messageLabelKey].push(observer);

    translationCallback(this.translate(messageLabelKey, translationParameter));

    return () => {
      const index = this.translationChangedObservers[messageLabelKey].indexOf(observer);
      if (index !== -1) {
        this.translationChangedObservers[messageLabelKey].splice(index, 1);
      }
    };
  }

  private notifyTranslationsChanged(): void {
    Object.keys(this.translationChangedObservers).forEach((eventName) => {
      const observers = this.translationChangedObservers[eventName] || [];
      observers.forEach((observer) => observer.callback(this.translate(eventName, observer.parameters)));
    });
  }


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
    this.notifyTranslationsChanged();
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
    const bundle = this.bundle[this.currentLang];
    let translation = bundle && bundle[key];
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

