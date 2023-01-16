# ontotext-yasgui



<!-- Auto Generated Below -->


## Overview

This is the custom web component which is adapter for the yasgui library. It allows as to
configure and extend the library without potentially breaking the component clients.

The component have some sane defaults for most of its configurations. So, in practice, it can be
used as is by providing just the sparql endpoint config.
For other customizations, the default configurations can be overridden by providing an external
configuration object compliant with the <code>ExternalYasguiConfiguration</code> interface to the
component.

There is a configuration watcher which triggers the initialization again after a change is
detected.

During the component initialization, the provided external configuration is passed down to a
configuration builder which use it to override and extend the yasgui library defaults.

After the configuration is ready, then a yasgui instance is created with it.

After the yasgui instance is ready, then a post initialization phase begins. During the phase the
yasgui can be tweaked using the values from the configuration.

## Properties

| Property   | Attribute  | Description                                                   | Type                          | Default     |
| ---------- | ---------- | ------------------------------------------------------------- | ----------------------------- | ----------- |
| `config`   | --         | An input object property containing the yasgui configuration. | `ExternalYasguiConfiguration` | `undefined` |
| `language` | `language` | An input property containing the chosen translation language. | `string`                      | `undefined` |


## Events

| Event              | Description                                                                                                                   | Type                                 |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| `createSavedQuery` | Event emitted when saved query payload is collected and the query should be saved by the component client.                    | `CustomEvent<SaveQueryData>`         |
| `loadSavedQueries` | Event emitted when saved queries is expected to be loaded by the component client and provided back in order to be displayed. | `CustomEvent<boolean>`               |
| `queryExecuted`    | Event emitted when before query to be executed.                                                                               | `CustomEvent<{ query: string; }>`    |
| `queryResponse`    | Event emitted when after query response is returned.                                                                          | `CustomEvent<{ duration: number; }>` |


## Methods

### `setQuery(query: string) => Promise<void>`



#### Returns

Type: `Promise<void>`




## Dependencies

### Depends on

- [yasgui-tooltip](../ontotext-tooltip-web-component)
- [save-query-dialog](../save-query-dialog)
- [saved-queries-popup](../saved-queries-popup)

### Graph
```mermaid
graph TD;
  ontotext-yasgui --> yasgui-tooltip
  ontotext-yasgui --> save-query-dialog
  ontotext-yasgui --> saved-queries-popup
  save-query-dialog --> yasgui-tooltip
  style ontotext-yasgui fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
