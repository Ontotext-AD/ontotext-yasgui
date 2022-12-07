# ontotext-yasgui

Wrapper project for maintaining "ontotext-yasgui-web-component" custom component. It contains three subprojects:
1. Yasgui;
2. ontotext-yasgui-web-component;
3. cypress.

## [Yasgui](https://github.com/TriplyDB/Yasgui)
It contains the source code of yasgui. After build of project yasgui.min.js and yasgui.min.css artefacts will
be copied into "ontotext-yasgui-web-component".

## [ontotext-yasgui-web-component](ontotext-yasgui-web-component/README.md)
This is main project of "ontotext-yasgui-web-component". In this project we will customize yasgui for Ontotext needs.

## [cypress](cypress)
It contains e2e tests.

# Getting started

1. #### Clone git repository.
```
git clone https://github.com/Ontotext-AD/ontotext-yasgui.git
```
2. #### Installation<br/>
   Application can be installed by executing the ``` npm install ``` command.
3. #### Build projects<br/>
   Application can be built by executing the ``` npm run build ``` command.
    - First will be build Yasgui component;
    - The artifacts yasgui.min.js and yasgui.min.css will be copied into "ontotext-yasgui-web-component" project;
    - At the end "ontotext-yasgui-web-component" project will be build.
   Final artefact of ontotext-yasgui-web-component can be found in dist folder of "ontotext-yasgui-web-component" project.
4. ### Cleaning of projects</b>
   All projects can be cleaned by executing the ``` npm run clean ```. This command will delete:
  - Parent project
    - node_modules of parent project
  - ontotext-yasgui-web-component project
    - ontotext-yasgui-web-component/dist
    - ontotext-yasgui-web-component/loader
    - ontotext-yasgui-web-component/node_modules
    - ontotext-yasgui-web-component/www
  - Yasgui project
    - Yasgui/node_modules
    - Yasgui/build
    - Yasgui/packages/utils/node_modules
    - Yasgui/packages/utils/build
    - Yasgui/packages/yasgui/node_modules
    - Yasgui/packages/yasgui/build
    - Yasgui/packages/yasqe/node_modules
    - Yasgui/packages/yasqe/build
    - Yasgui/packages/yasr/node_modules
    - Yasgui/packages/yasr/build
After execution of command the projects will be cleared as just cloned from repository.
> For development purpose the minimization of yasgui can be skipped by setting minimize property to false of the optimization configuration in Yasgui/webpack/config.ts file.

Read [Development guide](ontotext-yasgui-web-component/src/docs/development-guide.md) before start develop.

# Usage of component
Built component can be used in every framework read [Usage guide](ontotext-yasgui-web-component/README.md) for details how to use it.

# Starting a development server
Development server can be run by executing the ``` npm run start ``` command.

## Running integration tests
Run `npm run cy:run` for acceptance tests executed in sequence. <br/>
Run `npm run cy:open` for opening the cypress dashboard. <br/>

> Application must be started before running the acceptance tests.

## Linting
Run `npm run lint` to execute code lint check.
Run `npm run lint:fix` to execute code lint check and automatically fix problems.

# Release and publish
The ontotext-yasgui-web-component is regularly published as a package in the NPM registry.