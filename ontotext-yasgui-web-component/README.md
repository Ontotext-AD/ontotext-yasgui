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

# License
TODO: