import { Config } from '@stencil/core';
import {sass} from '@stencil/sass';

export const config: Config = {
  namespace: 'ontotext-yasgui-web-component',
  globalStyle: "src/css/app.scss",
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
      copy: [
        { src: 'js' },
      ]
    },
  ],
  plugins: [sass()]
};
