
# Ontotext Yasgui Web Component

## Approach for the component implementation and YASGUI customization

- For every change, patch or configuration in the library there must be a unit or UI test which 
  covers the case except for changes in the styling.
- Applying a fix means: for every needed change, find a way to apply it in an unobtrusive way first.
  1. Try to configure the YASGUI/YASQE/YASR using their configuration;
  2. Try to change the needed behaviour by YASGUI/YASQE/YASR using their public api;
  3. Тry to do some runtime monkey-patching:
  4. In the end, if the change is impossible to be introduced in an unobtrusive way, then apply the
     change in the respective file in the library, then create a patch file following proper naming
     convention which includes the date/timestamp and include it in the source code with the WB so
     that it can be easier to be applied to newer versions of the library.

## Implementation and testing of new features/customizations

For each new feature or extension in the component and/or YASGUI, a new page should be implemented 
in `ontotext-yasgui-web-component/src/pages` where the component should be included with the 
respective configurations and event handlers. The pages are used for manual testing of the features
and by the automated component tests.

In cypress component tests, for any particular feature the respective page is visited first, then
actions and verifications are applied.

## Stencil

"ontotex-yasgui-web-component" component is build with Stencil compiler.

Check out stenciljs docs [here](https://stenciljs.com/docs/my-first-component).

When component is built it can be used in any supported by stenciljs environment or in native 
javascript web application, but there might be differences, e.g. if it's used in angulajs version 
before 1.7.3, then additional custom directive must be installed on the client application.

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

# Components
## OntotextTooltipWebComponent
 ### Usage
```
<yasgui-tooltip data-tooltip={this.orientationButtonTooltip} placement="left" show-on-click={true}>
  <div class="btn-orientation icon-columns red" onClick={() => this.changeOrientation()}></div>
</yasgui-tooltip>
```
yasgui-tooltip tag have to wrap the element to which tooltip have to be appeared.
### Configuration
- <b>data-tooltip</b>: value of this property will be the content of the tooltip;
- <b>placement</b>: where tooltip to be appeared. default is top:
- <b>show-on-click</b>: if tooltip have to be shown when wrapped element is clicked. Default behaviour is when mouse is over the element.


# Usefull References
1. [State Management with State Tunnel in StencilJS](https://www.joshmorony.com/state-management-with-state-tunnel-in-stencil-js/)
2. [Using Services/Providers to Share Data in a StencilJS Application](https://www.joshmorony.com/using-services-providers-to-share-data-in-a-stencil-js-application/)