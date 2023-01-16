# saved-queries-popup



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description | Type               | Default     |
| -------- | --------- | ----------- | ------------------ | ----------- |
| `data`   | --        |             | `SavedQueriesData` | `undefined` |


## Events

| Event                                 | Description                                                | Type                         |
| ------------------------------------- | ---------------------------------------------------------- | ---------------------------- |
| `internalCloseSavedQueriesPopupEvent` | Event fired when the saved queries popup should be closed. | `CustomEvent<any>`           |
| `internalSaveQuerySelectedEvent`      | Event fired when a saved query is selected from the list.  | `CustomEvent<SaveQueryData>` |


## Dependencies

### Used by

 - [ontotext-yasgui](../ontotext-yasgui-web-component)

### Graph
```mermaid
graph TD;
  ontotext-yasgui --> saved-queries-popup
  style saved-queries-popup fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*