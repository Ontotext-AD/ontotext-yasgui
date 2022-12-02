
# ontotext-yasgui-web-component

The "ontotext-yasgui-web-component" component extends and customizes [yasgui](https://triply.cc/docs/yasgui) for the projects of [Ontotext](https://www.ontotext.com).



"ontotext-yasgui-web-component" component is build with [Stencil](https://stenciljs.com/) compiler.
Stencil is a compiler for building fast web apps using Web Components. Stencil components are just Web Components, so they work in any major framework or with no framework at all.

## Installation

```
npm install ontotext-yasgui-web-component
```

If component will be used in project with angularjs framework version before 1.7.3 additional package [ng-custom-element
](https://www.npmjs.com/package/ng-custom-element) will be needed.

```
npm install ng-custom-element
```

# Setup

## angularjs
If angularjs is before 1.7.3 add ng-custom-element.umd.js into vendor.js file.
```
import ng-custom-element/dist/ng-custom-element.umd';
```

Import function "defineCustomElementOntotextYasgui" and call it in app.scss

```
import {defineCustomElementOntotextYasgui} from 'ontotext-yasgui-web-component/dist/components/index';

defineCustomElementOntotextYasgui();
```

## angular

Import function "defineCustomElements" and call it in main.js
```
import {defineCustomElements} from 'ontotext-yasgui-web-component/loader/index'

defineCustomElements(window);
```

# Usage

## angularjs version before 1.7.3

```
  <ontotext-yasgui
    ng-custom-element
    ngce-prop-config="config">
  </ontotext-yasgui>
```

## angular 2+

```
<ontotext-yasgui
  [config]="config">
</ontotext-yasgui>
```

# License