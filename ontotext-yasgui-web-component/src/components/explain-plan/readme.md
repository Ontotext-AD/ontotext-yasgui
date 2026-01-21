# ontotext-explain-plan



<!-- Auto Generated Below -->


## Properties

| Property             | Attribute  | Description                                                                                                                                                                                                            | Type                                  | Default     |
| -------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- | ----------- |
| `binding`            | --         | The SPARQL results binding cell that contains the explain-plan literal. Expected shape: `{ type: 'literal', value: string }`. If undefined or not containing the explain marker, component will render an empty query. | `{ type: "literal"; value: string; }` | `undefined` |
| `forHtml`            | `for-html` | When `true` the explain-plan is rendered as HTML (with CodeMirror styling applied). When `false` the component renders a plain string representation. Default: `true`                                                  | `boolean`                             | `true`      |
| `translationService` | --         | Optional translation service used to get localized labels/messages                                                                                                                                                     | `TranslationService`                  | `undefined` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
