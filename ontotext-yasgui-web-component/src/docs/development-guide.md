
# Ontotext Yasgui Web Component

## Approach for the component implementation
- For every change, patch or configuration in the library there must be a unit or UI test which covers the case except for changes in the styling.
- Applying a fix means: for every needed change, find a way to apply it in an unobtrusive way first.
  1. Try to configure the YASGUI/YASQE/YASR using their configuration;
  2. Try to change the needed behaviour by YASGUI/YASQE/YASR using their public api;
  3. Тry to do some runtime monkey-patching:
  4. In the end, if the change is impossible to be introduced in an unobtrusive way, then apply the change in the respective file in the library, then create a patch file following proper naming convention which includes the date/timestamp and include it in the source code with the WB so that it can be easier to be applied to newer versions of the library.


"ontotex-yasgui-web-component" component is build with Stencil compiler.

## Stencil

Stencil is a compiler for building fast web apps using Web Components.

Stencil combines the best concepts of the most popular frontend frameworks into a compile-time rather than run-time tool.  Stencil takes TypeScript, JSX, a tiny virtual DOM layer, efficient one-way data binding, an asynchronous rendering pipeline (similar to React Fiber), and lazy-loading out of the box, and generates 100% standards-based Web Components that run in any browser supporting the Custom Elements v1 spec.

Stencil components are just Web Components, so they work in any major framework or with no framework at all.

Need help with stensiljs? Check out stenciljs docs [here](https://stenciljs.com/docs/my-first-component).

When component is built it can be used everywhere but there are difference if it used in angulajs version before 1.7.3.

# Development tips

## Properties

| Stencil                             | angularjs version before 1.7.3 template                                      | html template                                         | Description                   |
|-------------------------------------|------------------------------------------------------------------------------|-------------------------------------------------------|-------------------------------|
| ```@Prop() configProperty: {};``` | ```<ontotex-yasgui ng-custom-element ngce-prop-config_property="config"/>``` | ```<ontotex-yasgui [configProperty]="config"/>```     | config is controller property |
| ```@Prop() configProperty: string;``` | ```<ontotex-yasgui config-property="stringValue"/>```                        | ```<ontotex-yasgui config-property="stringValue"/>``` |                               |

## Output events
| Stencil                                    | Angularjs version before 1.7.3 template                                                     | Html template                                      | Descriptions  |
|--------------------------------------------|---------------------------------------------------------------------------------------------|----------------------------------------------------|---------------|
| ```@Event() yasguiOutput: EventEmitter;``` | ```<ontotex-yasgui ng-custom-element ngce-on-yasgui_output="controlerFunction($event)"/>``` | ```(yasguiOutput)="controlerFunction($event)"/>``` |               |

## Watch decorator
@Watch() is a decorator that is applied to a method of a Stencil component. The decorator accepts a single argument, the name of a class member that is decorated with @Prop() or @State().
<br>**<span style="color:red">The @Watch() decorator does not fire when a component initially loads.</style>**
<br>if we want method to be called we have to use the "componentDidLoad" of component lifecycle methods.

```
  componentDidLoad() {
    this.configurationChanged(this.config);
  }

  @Watch('config')
  configurationChanged(newConfig: YasguiConfiguration) {
    this.init(newConfig);
  }
```
