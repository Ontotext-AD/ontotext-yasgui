# ontotext-yasgui-download-as



<!-- Auto Generated Below -->


## Properties

| Property             | Attribute        | Description | Type                 | Default     |
| -------------------- | ---------------- | ----------- | -------------------- | ----------- |
| `items`              | --               |             | `DropdownOption[]`   | `undefined` |
| `nameLabelKey`       | `name-label-key` |             | `string`             | `undefined` |
| `pluginName`         | `plugin-name`    |             | `string`             | `undefined` |
| `query`              | `query`          |             | `string`             | `undefined` |
| `translationService` | --               |             | `TranslationService` | `undefined` |


## Events

| Event                     | Description | Type                                   |
| ------------------------- | ----------- | -------------------------------------- |
| `internalDownloadAsEvent` |             | `CustomEvent<InternalDownloadAsEvent>` |


## Dependencies

### Depends on

- [ontotext-dropdown](../dropdown)

### Graph
```mermaid
graph TD;
  ontotext-download-as --> ontotext-dropdown
  style ontotext-download-as fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*