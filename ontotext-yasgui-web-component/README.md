# ontotext-yasgui-web-component

The `ontotext-yasgui-web-component` component extends and customizes the `Yasgui` component as well
as providing a common interface for integration by component clients like the GraphDB workbench for
example.

The `ontotext-yasgui-web-component` component is implemented and build with the help of the 
[Stencil](https://stenciljs.com/) framework.

## Installation

```
npm install ontotext-yasgui-web-component
```

If the component will be used in an angularjs project where the angularjs version is `< 1.7.3` then
an additional custom directive must be installed in the client application. The directive can be 
found here [ng-custom-element](https://www.npmjs.com/package/ng-custom-element). Install it in the 
client angularjs application like this:

```
npm install ng-custom-element
```

# Setup for different client applications

## SPA with angularjs

If angularjs version is less than 1.7.3, then import the `ng-custom-element.umd.js` into its main 
file (for example `vendor.js`).

```
import ng-custom-element/dist/ng-custom-element.umd';
```

Import the `defineCustomElementOntotextYasgui` function and call it in the `app.js`

```
import {defineCustomElementOntotextYasgui} from 'ontotext-yasgui-web-component/dist/components/index';

defineCustomElementOntotextYasgui();
```

Then the component can be used in html templates like this:

```
  <ontotext-yasgui
    ng-custom-element
    ngce-prop-config="config">
  </ontotext-yasgui>
```

## SPA with Angular

Import the `defineCustomElements` function and call it in `main.js`

```
import {defineCustomElements} from 'ontotext-yasgui-web-component/loader/index'

defineCustomElements(window);
```

Then the component can be used in html templates like this:

```
<ontotext-yasgui
  [config]="config">
</ontotext-yasgui>
```
'ontotext-yasgui' is a web component, so it needs to configure NgModule to allow custom element schema.
Add "CUSTOM_ELEMENTS_SCHEMA" to "@NgModule.schemas" in the module where component is used.
```
@NgModule({
  declarations: [
    ...
  ],
  imports: [
    ...
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
```

## Configuration

The "config" value of "ngce-prop-config" or "[config]" is an object with following options:
- <b>yasguiConfig</b>: this is yasgui original configuration as it is. [See how can be used it](https://triply.cc/docs/yasgui-api#yasgui-config)
- <b>render</b>: Configure what part of the yasgui should be rendered. Supported values are:
   - mode-yasgui: default configuration. Shows the query editor and the results;
   - mode-yasqe: shows the query editor only;
   - mode-yasr: shows the results only.
- <b>orientation</b>: Configure the yasgui layout orientation. Supported values are:
   - orientation-vertical - the results will be appeared under the query editor;
   - orientation-horizontal - the results will be appeared next to the query editor.
- <b>query</b>: Default query when a tab is opened;
- <b>initialQuery?</b>: Initial query when yasgui is rendered if not set the default query will be set;
- <b>defaultTabName?</b>: The default tab name when a new tab is created;
- <b>showEditorTabs</b>: If the query editor tabs should be rendered or not;
- <b>showResultTabs</b>: If the results tabs should be rendered or not;
- <b>showToolbar</b>: If the toolbar with render mode buttons should be rendered or not;
- <b>yasqePluginButtons</b>: Plugin definitions configurations for yasqe action buttons; 
- <b>componentId</b>: Unique identifier of an instance of the component. This config is optional.
  A unique identifier of the component instance. This configuration is optional. A unique value should be passed only if the component's internal state (open tabs, completed requests, etc.) should not be shared with its other instances.
# License
TODO: