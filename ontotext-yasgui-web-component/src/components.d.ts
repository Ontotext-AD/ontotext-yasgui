/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { ExternalYasguiConfiguration } from "./models/external-yasgui-configuration";
import { QueryEvent, QueryResponseEvent } from "./models/event";
import { SavedQueriesData, SaveQueryData } from "./models/model";
export namespace Components {
    /**
     * This is the custom web component which is adapter for the yasgui library. It allows as to
     * configure and extend the library without potentially breaking the component clients.
     * The component have some sane defaults for most of its configurations. So, in practice, it can be
     * used as is by providing just the sparql endpoint config.
     * For other customizations, the default configurations can be overridden by providing an external
     * configuration object compliant with the <code>ExternalYasguiConfiguration</code> interface to the
     * component.
     * There is a configuration watcher which triggers the initialization again after a change is
     * detected.
     * During the component initialization, the provided external configuration is passed down to a
     * configuration builder which use it to override and extend the the yasgui library defaults.
     * After the configuration is ready, then a yasgui instance is created with it.
     * After the yasgui instance is ready, then a post initialization phase begins. During the phase the
     * yasgui can be tweaked using the values from the configuration.
     */
    interface OntotextYasgui {
        /**
          * An input object property containing the yasgui configuration.
         */
        "config": ExternalYasguiConfiguration;
        /**
          * An input property containing the chosen translation language.
         */
        "language": string;
        "setQuery": (query: string) => Promise<void>;
    }
    interface SaveQueryDialog {
        /**
          * Input holding the saved query data if available. This data is used to initialize the form.
         */
        "data": SaveQueryData;
    }
    interface SavedQueriesPopup {
        "data": SavedQueriesData;
    }
    interface YasguiTooltip {
        "dataTooltip": string;
        "placement": string;
        "showOnClick": false;
    }
}
export interface OntotextYasguiCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLOntotextYasguiElement;
}
export interface SaveQueryDialogCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLSaveQueryDialogElement;
}
export interface SavedQueriesPopupCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLSavedQueriesPopupElement;
}
declare global {
    /**
     * This is the custom web component which is adapter for the yasgui library. It allows as to
     * configure and extend the library without potentially breaking the component clients.
     * The component have some sane defaults for most of its configurations. So, in practice, it can be
     * used as is by providing just the sparql endpoint config.
     * For other customizations, the default configurations can be overridden by providing an external
     * configuration object compliant with the <code>ExternalYasguiConfiguration</code> interface to the
     * component.
     * There is a configuration watcher which triggers the initialization again after a change is
     * detected.
     * During the component initialization, the provided external configuration is passed down to a
     * configuration builder which use it to override and extend the the yasgui library defaults.
     * After the configuration is ready, then a yasgui instance is created with it.
     * After the yasgui instance is ready, then a post initialization phase begins. During the phase the
     * yasgui can be tweaked using the values from the configuration.
     */
    interface HTMLOntotextYasguiElement extends Components.OntotextYasgui, HTMLStencilElement {
    }
    var HTMLOntotextYasguiElement: {
        prototype: HTMLOntotextYasguiElement;
        new (): HTMLOntotextYasguiElement;
    };
    interface HTMLSaveQueryDialogElement extends Components.SaveQueryDialog, HTMLStencilElement {
    }
    var HTMLSaveQueryDialogElement: {
        prototype: HTMLSaveQueryDialogElement;
        new (): HTMLSaveQueryDialogElement;
    };
    interface HTMLSavedQueriesPopupElement extends Components.SavedQueriesPopup, HTMLStencilElement {
    }
    var HTMLSavedQueriesPopupElement: {
        prototype: HTMLSavedQueriesPopupElement;
        new (): HTMLSavedQueriesPopupElement;
    };
    interface HTMLYasguiTooltipElement extends Components.YasguiTooltip, HTMLStencilElement {
    }
    var HTMLYasguiTooltipElement: {
        prototype: HTMLYasguiTooltipElement;
        new (): HTMLYasguiTooltipElement;
    };
    interface HTMLElementTagNameMap {
        "ontotext-yasgui": HTMLOntotextYasguiElement;
        "save-query-dialog": HTMLSaveQueryDialogElement;
        "saved-queries-popup": HTMLSavedQueriesPopupElement;
        "yasgui-tooltip": HTMLYasguiTooltipElement;
    }
}
declare namespace LocalJSX {
    /**
     * This is the custom web component which is adapter for the yasgui library. It allows as to
     * configure and extend the library without potentially breaking the component clients.
     * The component have some sane defaults for most of its configurations. So, in practice, it can be
     * used as is by providing just the sparql endpoint config.
     * For other customizations, the default configurations can be overridden by providing an external
     * configuration object compliant with the <code>ExternalYasguiConfiguration</code> interface to the
     * component.
     * There is a configuration watcher which triggers the initialization again after a change is
     * detected.
     * During the component initialization, the provided external configuration is passed down to a
     * configuration builder which use it to override and extend the the yasgui library defaults.
     * After the configuration is ready, then a yasgui instance is created with it.
     * After the yasgui instance is ready, then a post initialization phase begins. During the phase the
     * yasgui can be tweaked using the values from the configuration.
     */
    interface OntotextYasgui {
        /**
          * An input object property containing the yasgui configuration.
         */
        "config"?: ExternalYasguiConfiguration;
        /**
          * An input property containing the chosen translation language.
         */
        "language"?: string;
        /**
          * Event emitted when saved query payload is collected and the query should be saved by the component client.
         */
        "onCreateSavedQuery"?: (event: OntotextYasguiCustomEvent<SaveQueryData>) => void;
        /**
          * Event emitted when saved queries is expected to be loaded by the component client and provided back in order to be displayed.
         */
        "onLoadSavedQueries"?: (event: OntotextYasguiCustomEvent<boolean>) => void;
        /**
          * Event emitted when before query to be executed.
         */
        "onQueryExecuted"?: (event: OntotextYasguiCustomEvent<QueryEvent>) => void;
        /**
          * Event emitted when after query response is returned.
         */
        "onQueryResponse"?: (event: OntotextYasguiCustomEvent<QueryResponseEvent>) => void;
    }
    interface SaveQueryDialog {
        /**
          * Input holding the saved query data if available. This data is used to initialize the form.
         */
        "data"?: SaveQueryData;
        /**
          * Event fired when the dialog is closed by triggering one of the close controls, e.g. close or cancel button.
         */
        "onInternalSaveQueryDialogClosedEvent"?: (event: SaveQueryDialogCustomEvent<any>) => void;
        /**
          * Event fired when the create button in the dialog is triggered. The event payload holds the new saved query data.
         */
        "onInternalSaveQueryEvent"?: (event: SaveQueryDialogCustomEvent<SaveQueryData>) => void;
    }
    interface SavedQueriesPopup {
        "data"?: SavedQueriesData;
        /**
          * Event fired when the saved queries popup should be closed.
         */
        "onInternalCloseSavedQueriesPopupEvent"?: (event: SavedQueriesPopupCustomEvent<any>) => void;
        /**
          * Event fired when a saved query is selected from the list.
         */
        "onInternalSaveQuerySelectedEvent"?: (event: SavedQueriesPopupCustomEvent<SaveQueryData>) => void;
    }
    interface YasguiTooltip {
        "dataTooltip"?: string;
        "placement"?: string;
        "showOnClick"?: false;
    }
    interface IntrinsicElements {
        "ontotext-yasgui": OntotextYasgui;
        "save-query-dialog": SaveQueryDialog;
        "saved-queries-popup": SavedQueriesPopup;
        "yasgui-tooltip": YasguiTooltip;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            /**
             * This is the custom web component which is adapter for the yasgui library. It allows as to
             * configure and extend the library without potentially breaking the component clients.
             * The component have some sane defaults for most of its configurations. So, in practice, it can be
             * used as is by providing just the sparql endpoint config.
             * For other customizations, the default configurations can be overridden by providing an external
             * configuration object compliant with the <code>ExternalYasguiConfiguration</code> interface to the
             * component.
             * There is a configuration watcher which triggers the initialization again after a change is
             * detected.
             * During the component initialization, the provided external configuration is passed down to a
             * configuration builder which use it to override and extend the the yasgui library defaults.
             * After the configuration is ready, then a yasgui instance is created with it.
             * After the yasgui instance is ready, then a post initialization phase begins. During the phase the
             * yasgui can be tweaked using the values from the configuration.
             */
            "ontotext-yasgui": LocalJSX.OntotextYasgui & JSXBase.HTMLAttributes<HTMLOntotextYasguiElement>;
            "save-query-dialog": LocalJSX.SaveQueryDialog & JSXBase.HTMLAttributes<HTMLSaveQueryDialogElement>;
            "saved-queries-popup": LocalJSX.SavedQueriesPopup & JSXBase.HTMLAttributes<HTMLSavedQueriesPopupElement>;
            "yasgui-tooltip": LocalJSX.YasguiTooltip & JSXBase.HTMLAttributes<HTMLYasguiTooltipElement>;
        }
    }
}
