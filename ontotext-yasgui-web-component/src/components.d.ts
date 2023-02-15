/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { ServiceFactory } from "./services/service-factory";
import { ConfirmationDialogConfig } from "./components/confirmation-dialog/confirmation-dialog";
import { CopyLinkDialogConfig, CopyLinkObserver } from "./components/copy-link-dialog/copy-link-dialog";
import { DialogConfig } from "./components/ontotext-dialog-web-component/ontotext-dialog-web-component";
import { TranslationService } from "./services/translation.service";
import { DropdownOption } from "./models/dropdown-option";
import { InternalDownloadAsEvent } from "./models/internal-events/internal-download-as-event";
import { InternalDropdownValueSelectedEvent } from "./models/internal-events/internal-dropdown-value-selected-event";
import { ExternalYasguiConfiguration, TabQueryModel } from "./models/external-yasgui-configuration";
import { SavedQueriesData, SavedQueryConfig, SaveQueryData, UpdateQueryData } from "./models/saved-query-configuration";
import { QueryEvent, QueryResponseEvent } from "./models/event";
import { OutputEvent } from "./models/output-events/output-event";
import { ShareQueryDialogConfig } from "./components/share-query-dialog/share-query-dialog";
export namespace Components {
    interface ConfirmationDialog {
        "config": ConfirmationDialogConfig;
        "serviceFactory": ServiceFactory;
    }
    interface CopyLinkDialog {
        "classes": string;
        "config": CopyLinkDialogConfig;
        "copyLinkEventsObserver": CopyLinkObserver;
        "serviceFactory": ServiceFactory;
    }
    interface CopyResourceLinkButton {
        "classes": string;
        "uri": string;
    }
    interface CopyResourceLinkDialog {
        "resourceLink": string;
        "serviceFactory": ServiceFactory;
    }
    interface OntotextDialogWebComponent {
        "config": DialogConfig;
    }
    interface OntotextDownloadAs {
        "infer": boolean;
        "items": DropdownOption[];
        "nameLabelKey": string;
        "pluginName": string;
        "query": string;
        "sameAs": boolean;
        "translationService": TranslationService;
    }
    interface OntotextDropdown {
        "items": DropdownOption[];
        "nameLabelKey": string;
        "translationService": TranslationService;
    }
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
     * configuration builder which use it to override and extend the yasgui library defaults.
     * After the configuration is ready, then a yasgui instance is created with it.
     * After the yasgui instance is ready, then a post initialization phase begins. During the phase the
     * yasgui can be tweaked using the values from the configuration.
     */
    interface OntotextYasgui {
        /**
          * An input object property containing the yasgui configuration.
         */
        "config": ExternalYasguiConfiguration;
        "getEmbeddedResultAsCSV": () => Promise<unknown>;
        "getEmbeddedResultAsJson": () => Promise<unknown>;
        /**
          * Utility method allowing the client to get the mode of the query which is written in the current editor tab. The query mode can be either `query` or `update` regarding the query mode. This method just exposes the similar utility method from the yasqe component.
          * @return A promise which resolves with a string representing the query mode.
         */
        "getQueryMode": () => Promise<string>;
        /**
          * Utility method allowing the client to get the type of the query which is written in the current editor tab. The query mode can be `INSERT`, `LOAD`, `CLEAR`, `DELETE`, etc. This method just exposes the similar utility method from the yasqe component.
          * @return A promise which resolves with a string representing the query type.
         */
        "getQueryType": () => Promise<string>;
        /**
          * An input property containing the chosen translation language.
         */
        "language": string;
        /**
          * Allows the client to init the editor using a query model. When the query and query name are found in any existing opened tab, then it'd be focused. Otherwise a new tab will be created and initialized using the provided query model.
          * @param queryModel The query model.
         */
        "openTab": (queryModel: TabQueryModel) => Promise<void>;
        /**
          * A configuration model related with all the saved queries actions.
         */
        "savedQueryConfig"?: SavedQueryConfig;
        /**
          * Allows the client to set a query in the current opened tab.
          * @param query The query that should be set in the current focused tab.
         */
        "setQuery": (query: string) => Promise<void>;
    }
    interface SaveQueryDialog {
        /**
          * Input holding the saved query data if available. This data is used to initialize the form.
         */
        "data": SaveQueryData;
        "serviceFactory": ServiceFactory;
    }
    interface SavedQueriesPopup {
        "config": SavedQueriesData;
    }
    interface ShareQueryDialog {
        "config": ShareQueryDialogConfig;
        "serviceFactory": ServiceFactory;
    }
    interface YasguiTooltip {
        "dataTooltip": string;
        "placement": string;
        "showOnClick": false;
    }
}
export interface ConfirmationDialogCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLConfirmationDialogElement;
}
export interface CopyResourceLinkDialogCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLCopyResourceLinkDialogElement;
}
export interface OntotextDownloadAsCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLOntotextDownloadAsElement;
}
export interface OntotextDropdownCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLOntotextDropdownElement;
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
export interface ShareQueryDialogCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLShareQueryDialogElement;
}
declare global {
    interface HTMLConfirmationDialogElement extends Components.ConfirmationDialog, HTMLStencilElement {
    }
    var HTMLConfirmationDialogElement: {
        prototype: HTMLConfirmationDialogElement;
        new (): HTMLConfirmationDialogElement;
    };
    interface HTMLCopyLinkDialogElement extends Components.CopyLinkDialog, HTMLStencilElement {
    }
    var HTMLCopyLinkDialogElement: {
        prototype: HTMLCopyLinkDialogElement;
        new (): HTMLCopyLinkDialogElement;
    };
    interface HTMLCopyResourceLinkButtonElement extends Components.CopyResourceLinkButton, HTMLStencilElement {
    }
    var HTMLCopyResourceLinkButtonElement: {
        prototype: HTMLCopyResourceLinkButtonElement;
        new (): HTMLCopyResourceLinkButtonElement;
    };
    interface HTMLCopyResourceLinkDialogElement extends Components.CopyResourceLinkDialog, HTMLStencilElement {
    }
    var HTMLCopyResourceLinkDialogElement: {
        prototype: HTMLCopyResourceLinkDialogElement;
        new (): HTMLCopyResourceLinkDialogElement;
    };
    interface HTMLOntotextDialogWebComponentElement extends Components.OntotextDialogWebComponent, HTMLStencilElement {
    }
    var HTMLOntotextDialogWebComponentElement: {
        prototype: HTMLOntotextDialogWebComponentElement;
        new (): HTMLOntotextDialogWebComponentElement;
    };
    interface HTMLOntotextDownloadAsElement extends Components.OntotextDownloadAs, HTMLStencilElement {
    }
    var HTMLOntotextDownloadAsElement: {
        prototype: HTMLOntotextDownloadAsElement;
        new (): HTMLOntotextDownloadAsElement;
    };
    interface HTMLOntotextDropdownElement extends Components.OntotextDropdown, HTMLStencilElement {
    }
    var HTMLOntotextDropdownElement: {
        prototype: HTMLOntotextDropdownElement;
        new (): HTMLOntotextDropdownElement;
    };
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
     * configuration builder which use it to override and extend the yasgui library defaults.
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
    interface HTMLShareQueryDialogElement extends Components.ShareQueryDialog, HTMLStencilElement {
    }
    var HTMLShareQueryDialogElement: {
        prototype: HTMLShareQueryDialogElement;
        new (): HTMLShareQueryDialogElement;
    };
    interface HTMLYasguiTooltipElement extends Components.YasguiTooltip, HTMLStencilElement {
    }
    var HTMLYasguiTooltipElement: {
        prototype: HTMLYasguiTooltipElement;
        new (): HTMLYasguiTooltipElement;
    };
    interface HTMLElementTagNameMap {
        "confirmation-dialog": HTMLConfirmationDialogElement;
        "copy-link-dialog": HTMLCopyLinkDialogElement;
        "copy-resource-link-button": HTMLCopyResourceLinkButtonElement;
        "copy-resource-link-dialog": HTMLCopyResourceLinkDialogElement;
        "ontotext-dialog-web-component": HTMLOntotextDialogWebComponentElement;
        "ontotext-download-as": HTMLOntotextDownloadAsElement;
        "ontotext-dropdown": HTMLOntotextDropdownElement;
        "ontotext-yasgui": HTMLOntotextYasguiElement;
        "save-query-dialog": HTMLSaveQueryDialogElement;
        "saved-queries-popup": HTMLSavedQueriesPopupElement;
        "share-query-dialog": HTMLShareQueryDialogElement;
        "yasgui-tooltip": HTMLYasguiTooltipElement;
    }
}
declare namespace LocalJSX {
    interface ConfirmationDialog {
        "config"?: ConfirmationDialogConfig;
        /**
          * Event fired when confirmation is rejected and the dialog should be closed.
         */
        "onInternalConfirmationApprovedEvent"?: (event: ConfirmationDialogCustomEvent<any>) => void;
        /**
          * Event fired when confirmation is rejected and the dialog should be closed.
         */
        "onInternalConfirmationRejectedEvent"?: (event: ConfirmationDialogCustomEvent<any>) => void;
        "serviceFactory"?: ServiceFactory;
    }
    interface CopyLinkDialog {
        "classes"?: string;
        "config"?: CopyLinkDialogConfig;
        "copyLinkEventsObserver"?: CopyLinkObserver;
        "serviceFactory"?: ServiceFactory;
    }
    interface CopyResourceLinkButton {
        "classes"?: string;
        "uri"?: string;
    }
    interface CopyResourceLinkDialog {
        /**
          * Internal event fired when resource link is copied to the clipboard.
         */
        "onInternalResourceLinkCopiedEvent"?: (event: CopyResourceLinkDialogCustomEvent<any>) => void;
        /**
          * Event fired when the dialog is closed by triggering one of the close controls, e.g. close or cancel button as well as clicking outside the dialog.
         */
        "onInternalResourceLinkDialogClosedEvent"?: (event: CopyResourceLinkDialogCustomEvent<any>) => void;
        "resourceLink"?: string;
        "serviceFactory"?: ServiceFactory;
    }
    interface OntotextDialogWebComponent {
        "config"?: DialogConfig;
    }
    interface OntotextDownloadAs {
        "infer"?: boolean;
        "items"?: DropdownOption[];
        "nameLabelKey"?: string;
        "onInternalDownloadAsEvent"?: (event: OntotextDownloadAsCustomEvent<InternalDownloadAsEvent>) => void;
        "pluginName"?: string;
        "query"?: string;
        "sameAs"?: boolean;
        "translationService"?: TranslationService;
    }
    interface OntotextDropdown {
        "items"?: DropdownOption[];
        "nameLabelKey"?: string;
        "onValueChanged"?: (event: OntotextDropdownCustomEvent<InternalDropdownValueSelectedEvent>) => void;
        "translationService"?: TranslationService;
    }
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
     * configuration builder which use it to override and extend the yasgui library defaults.
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
          * Event emitted when a saved query should be deleted. In result the client must perform a query delete.
         */
        "onDeleteSavedQuery"?: (event: OntotextYasguiCustomEvent<SaveQueryData>) => void;
        /**
          * Event emitted when saved queries is expected to be loaded by the component client and provided back in order to be displayed.
         */
        "onLoadSavedQueries"?: (event: OntotextYasguiCustomEvent<boolean>) => void;
        /**
          * Event emitter used to send message to the clients of component.
         */
        "onOutput"?: (event: OntotextYasguiCustomEvent<OutputEvent>) => void;
        /**
          * Event emitted when before query to be executed.
         */
        "onQueryExecuted"?: (event: OntotextYasguiCustomEvent<QueryEvent>) => void;
        /**
          * Event emitted when after query response is returned.
         */
        "onQueryResponse"?: (event: OntotextYasguiCustomEvent<QueryResponseEvent>) => void;
        /**
          * Event emitted when query share link gets copied in the clipboard.
         */
        "onQueryShareLinkCopied"?: (event: OntotextYasguiCustomEvent<any>) => void;
        /**
          * Event emitted when saved query share link has to be build by the client.
         */
        "onShareQuery"?: (event: OntotextYasguiCustomEvent<TabQueryModel>) => void;
        /**
          * Event emitted when saved query share link has to be build by the client.
         */
        "onShareSavedQuery"?: (event: OntotextYasguiCustomEvent<SaveQueryData>) => void;
        /**
          * Event emitted when a query payload is updated and the query name is the same as the one being edited. In result the client must perform a query update.
         */
        "onUpdateSavedQuery"?: (event: OntotextYasguiCustomEvent<SaveQueryData>) => void;
        /**
          * A configuration model related with all the saved queries actions.
         */
        "savedQueryConfig"?: SavedQueryConfig;
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
        /**
          * Event fired when the create button in the dialog is triggered and the query name is the same as the one that was initially provided a.k.a. the query is updated. The event payload holds the updated query data.
         */
        "onInternalUpdateQueryEvent"?: (event: SaveQueryDialogCustomEvent<UpdateQueryData>) => void;
        "serviceFactory"?: ServiceFactory;
    }
    interface SavedQueriesPopup {
        "config"?: SavedQueriesData;
        /**
          * Event fired when the saved queries popup should be closed.
         */
        "onInternalCloseSavedQueriesPopupEvent"?: (event: SavedQueriesPopupCustomEvent<any>) => void;
        /**
          * Event fired when the edit saved query button is triggered.
         */
        "onInternalEditSavedQueryEvent"?: (event: SavedQueriesPopupCustomEvent<SaveQueryData>) => void;
        /**
          * Event fired when a saved query is selected from the list.
         */
        "onInternalSaveQuerySelectedEvent"?: (event: SavedQueriesPopupCustomEvent<SaveQueryData>) => void;
        /**
          * Event fired when the delete saved query button is triggered.
         */
        "onInternalSavedQuerySelectedForDeleteEvent"?: (event: SavedQueriesPopupCustomEvent<SaveQueryData>) => void;
        /**
          * Event fired when the share saved query button is triggered.
         */
        "onInternalSavedQuerySelectedForShareEvent"?: (event: SavedQueriesPopupCustomEvent<SaveQueryData>) => void;
    }
    interface ShareQueryDialog {
        "config"?: ShareQueryDialogConfig;
        /**
          * Internal event fired when saved query share link is copied in the clipboard.
         */
        "onInternalQueryShareLinkCopiedEvent"?: (event: ShareQueryDialogCustomEvent<any>) => void;
        /**
          * Event fired when the dialog is closed by triggering one of the close controls, e.g. close or cancel button as well as clicking outside of the dialog.
         */
        "onInternalShareQueryDialogClosedEvent"?: (event: ShareQueryDialogCustomEvent<any>) => void;
        "serviceFactory"?: ServiceFactory;
    }
    interface YasguiTooltip {
        "dataTooltip"?: string;
        "placement"?: string;
        "showOnClick"?: false;
    }
    interface IntrinsicElements {
        "confirmation-dialog": ConfirmationDialog;
        "copy-link-dialog": CopyLinkDialog;
        "copy-resource-link-button": CopyResourceLinkButton;
        "copy-resource-link-dialog": CopyResourceLinkDialog;
        "ontotext-dialog-web-component": OntotextDialogWebComponent;
        "ontotext-download-as": OntotextDownloadAs;
        "ontotext-dropdown": OntotextDropdown;
        "ontotext-yasgui": OntotextYasgui;
        "save-query-dialog": SaveQueryDialog;
        "saved-queries-popup": SavedQueriesPopup;
        "share-query-dialog": ShareQueryDialog;
        "yasgui-tooltip": YasguiTooltip;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "confirmation-dialog": LocalJSX.ConfirmationDialog & JSXBase.HTMLAttributes<HTMLConfirmationDialogElement>;
            "copy-link-dialog": LocalJSX.CopyLinkDialog & JSXBase.HTMLAttributes<HTMLCopyLinkDialogElement>;
            "copy-resource-link-button": LocalJSX.CopyResourceLinkButton & JSXBase.HTMLAttributes<HTMLCopyResourceLinkButtonElement>;
            "copy-resource-link-dialog": LocalJSX.CopyResourceLinkDialog & JSXBase.HTMLAttributes<HTMLCopyResourceLinkDialogElement>;
            "ontotext-dialog-web-component": LocalJSX.OntotextDialogWebComponent & JSXBase.HTMLAttributes<HTMLOntotextDialogWebComponentElement>;
            "ontotext-download-as": LocalJSX.OntotextDownloadAs & JSXBase.HTMLAttributes<HTMLOntotextDownloadAsElement>;
            "ontotext-dropdown": LocalJSX.OntotextDropdown & JSXBase.HTMLAttributes<HTMLOntotextDropdownElement>;
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
             * configuration builder which use it to override and extend the yasgui library defaults.
             * After the configuration is ready, then a yasgui instance is created with it.
             * After the yasgui instance is ready, then a post initialization phase begins. During the phase the
             * yasgui can be tweaked using the values from the configuration.
             */
            "ontotext-yasgui": LocalJSX.OntotextYasgui & JSXBase.HTMLAttributes<HTMLOntotextYasguiElement>;
            "save-query-dialog": LocalJSX.SaveQueryDialog & JSXBase.HTMLAttributes<HTMLSaveQueryDialogElement>;
            "saved-queries-popup": LocalJSX.SavedQueriesPopup & JSXBase.HTMLAttributes<HTMLSavedQueriesPopupElement>;
            "share-query-dialog": LocalJSX.ShareQueryDialog & JSXBase.HTMLAttributes<HTMLShareQueryDialogElement>;
            "yasgui-tooltip": LocalJSX.YasguiTooltip & JSXBase.HTMLAttributes<HTMLYasguiTooltipElement>;
        }
    }
}
