/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { YasguiConfiguration } from "./models/yasgui-configuration";
export namespace Components {
    interface OntotextYasgui {
        "config": YasguiConfiguration;
        "draw": () => Promise<string>;
    }
}
export interface OntotextYasguiCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLOntotextYasguiElement;
}
declare global {
    interface HTMLOntotextYasguiElement extends Components.OntotextYasgui, HTMLStencilElement {
    }
    var HTMLOntotextYasguiElement: {
        prototype: HTMLOntotextYasguiElement;
        new (): HTMLOntotextYasguiElement;
    };
    interface HTMLElementTagNameMap {
        "ontotext-yasgui": HTMLOntotextYasguiElement;
    }
}
declare namespace LocalJSX {
    interface OntotextYasgui {
        "config"?: YasguiConfiguration;
        "onYasguiOutput"?: (event: OntotextYasguiCustomEvent<any>) => void;
    }
    interface IntrinsicElements {
        "ontotext-yasgui": OntotextYasgui;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "ontotext-yasgui": LocalJSX.OntotextYasgui & JSXBase.HTMLAttributes<HTMLOntotextYasguiElement>;
        }
    }
}
