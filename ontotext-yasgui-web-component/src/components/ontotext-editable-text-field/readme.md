# ontotext-editable



<!-- Auto Generated Below -->


## Properties

| Property             | Attribute | Description                                                                      | Type                 | Default     |
| -------------------- | --------- | -------------------------------------------------------------------------------- | -------------------- | ----------- |
| `edit`               | `edit`    | Controls the view mode of component. If true the component will be in Edit mode. | `boolean`            | `false`     |
| `translationService` | --        |                                                                                  | `TranslationService` | `undefined` |
| `value`              | `value`   | The value of the text field.                                                     | `string`             | `undefined` |


## Events

| Event                  | Description                                                           | Type                   |
| ---------------------- | --------------------------------------------------------------------- | ---------------------- |
| `componentModeChanged` | The "componentModeChanged" event is fired when the view mode changes. | `CustomEvent<boolean>` |
| `valueChanged`         | The "valueChanged" event is fired when the text field value changes.  | `CustomEvent<string>`  |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
