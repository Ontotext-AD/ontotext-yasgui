import {Config} from '@stencil/core';
import {sass} from '@stencil/sass';

const path = `${__dirname}/src/pages/fake-server.js`;

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
        {src: 'js'},
        {src: 'pages'},
        {src: 'css/fonts'},
        {src: 'css/external/dracula.css'},
        {src: 'css/external/oceanic-next.css'},
        {src: '../node_modules/remixicon/fonts', dest: 'fonts/remixicon'},
        {src: 'i18n'}
      ]
    },
  ],
  plugins: [sass()],
  devServer: {
    requestListenerPath: path
  }
};
