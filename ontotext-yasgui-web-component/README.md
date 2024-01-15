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

Import the `defineCustomElements` function and call it in the `app.js`

```
import {defineCustomElements} from 'ontotext-yasgui-web-component/loader/index'

defineCustomElements();
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
- **endpoint**: The sparql endpoint which will be used when a query request is made. It is important to note that if the endpoint
  configuration is passed as string, it will be persisted when first time initializes the instance with specific componentId. Subsequent
  query executions will use the endpoint stored in the persistence regardless if the configuration is changed. If the endpoint is defined as
  a function, it will be called before each query execution.
- **render**: Configure what part of the yasgui should be rendered. Supported values are:
   - mode-yasgui: default configuration. Shows the query editor and the results;
   - mode-yasqe: shows the query editor only;
   - mode-yasr: shows the results only.
- **orientation**: Configure the yasgui layout orientation. Supported values are:
   - orientation-vertical - the results will be appeared under the query editor;
   - orientation-horizontal - the results will be appeared next to the query editor.
- **query**: Default query when a tab is opened;
- **initialQuery**>: Initial query when yasgui is rendered if not set the default query will be set;
- **defaultTabNameLabelKey**: The translation label key that should be used to fetch the default tab name when a new tab is created.
- **showEditorTabs**: If the query editor tabs should be rendered or not;
- **showResultTabs**: If the results tabs should be rendered or not;
- **showResultInfo**: If the result information header of YASR should be rendered or not;
- **maxResizableResultsColumns**: The maximum count of columns in YASR that can be resized. When there are too many columns, YASR may slow down and frequently crash the browser. The default value is 19.
- **showQueryLoader**: Flag that controls displaying the loader during the run query process. Default value is true;
- **showToolbar**: If the toolbar with render mode buttons should be rendered or not;
- **yasqePluginButtons**: Plugin definitions configurations for yasqe action buttons; 
- **componentId**: An unique identifier of an instance of the component. This config is optional.
  A unique identifier of the component instance. This configuration is optional. A unique value should be passed only if the component's internal state (open tabs, completed requests, etc.) should not be shared with its other instances.
- **paginationOn**: If true pagination will be used to display results.
- **pageSize**: the size of a page. Default value is 10.
- **downloadAsOn**: if false "Download as" dropdown will not be shown.
- **yasrToolbarPlugins**: "ontotext-yasgui-web-component" has a toolbar on the right next to the plugin buttons. **yasrToolbarPlugins** have to contain elements that implements [YasrToolbarPlugin](src/models/yasr-toolbar-plugin.ts) interface.
- **yasqeMode**: There are three options:
   - WRITE - the query can be edited;
   - READ - the editor is read-only, but the query can be copied;
   - PROTECTED - the editor is read-only and the query can't be copied.
- **showQueryButton**: if false the "Run" query button will be hidden. Default value is true.
- **getCellContent**: function that will be called for every one cell. It must return valid html as string.
- **sparqlResponse**: a response of a sparql query as string. If the parameter is provided, the result will be visualized in YASR.
- **infer**: the value of "infer" parameter when a query is executed. Default value is true.
- **immutableInfer**: if set to true, the 'infer' value cannot be changed. Default value is false.
- **sameAs**: the value of "sameAs" parameter when a query is executed. Default value is true.
- **immutableSameAs**: if set to true, the 'sameAs' value cannot be changed. Default value is false.
- **language**: the language being used when the component is initialized. Default value is "en".
- **keyboardShortcutConfiguration**: This is an object with key-value pairs. The key is the name of the keyboard shortcut, and the value is
  a boolean that controls whether the shortcut should be visible. The shortcut will be visible if it is not set in the configuration or is
  set with a value of true. All possible values for the keys are:
  - trigger_autocompletion
  - delete_current_line
  - comment_selected_line
  - copy_line_down
  - copy_line_up
  - auto_format_selected_line
  - indent_current_line_more
  - indent_current_line_less
  - execute_query_or_update
  - execute_explain_plan_for_query
  - execute_chat_gpt_explain_plan_for_query
  - create_tab
  - create_save_query
  - switch_next_tab
  - switch_previous_tab
  - closes_other_tabs
  - closes_other_tabs_by_left_mouse_click
  - full_screen
  - esc


## Developers guide

The guide can be found [here](./docs/developers-guide.md)

# License
TODO: