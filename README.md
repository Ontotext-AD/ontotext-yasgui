# ontotext-yasgui

The `ontotext-yasgui` project is a wrapper for development of the `ontotext-yasgui-web-component`. 
It's composed by following sub-projects:
1. Yasgui;
2. ontotext-yasgui-web-component;
3. cypress. - An automated testing project.

## Yasgui
A workspace with the latest version of the original source code of the 
[Yasgui](https://github.com/TriplyDB/Yasgui) library with all needed customizations.
After a build, the `yasgui.min.js` and `yasgui.min.css` artefacts are copied into 
`ontotext-yasgui-web-component`.

## ontotext-yasgui-web-component
[ontotext-yasgui-web-component](ontotext-yasgui-web-component/README.md)

A workspace with the implementation of a custom web component which wraps the `Yasgui` library and 
provides a common interface for unobtrusive customizations via configurations and hooks;

## cypress

A project with automated e2e tests for the `ontotext-yasgui-web-component`.

# Getting started

1. #### Clone git repository.
```
git clone https://github.com/Ontotext-AD/ontotext-yasgui.git
```

2. #### Installation<br/>
   Application can be installed by executing the ``` npm install ``` command.
   
3. #### Build projects<br/>
   Application can be built by executing the ``` npm run build ``` command. The build command 
   performs the following tasks:
    - Build `Yasgui` and package component;
    - Copy the `yasgui.min.js` and `yasgui.min.css` artefacts into `ontotext-yasgui-web-component` 
      project;
    - Build the `ontotext-yasgui-web-component` project. The component is built in the `dist` 
      folder in `ontotext-yasgui-web-component`.

4. #### Cleaning up</b>
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

> For development purpose the minimization of yasgui can be skipped by setting minimize property to 
> false of the optimization configuration in Yasgui/webpack/config.ts file.

Read [Development guide](ontotext-yasgui-web-component/docs/developers-guide.md) before 
starting any development in this project.

## Usage of the component
After the `ontotext-yasgui-web-component` is built, then it can be used in every supported by 
`stenciljs` framework or in native javascript applications. Read 
[Usage guide](ontotext-yasgui-web-component/README.md) for details how to use it.

## Starting a development server
A development server can be run by executing the ``` npm run start ``` command. This will run a
simple web server and deploy a sample web page with the `ontotext-yasgui-web-component` inside. 
The server supports a watch mode, and a live reload of the web browser.

## Running the automated tests
The automated tests can be run by executing one of the following commands: <br/>
`npm run cy:run` for headless tests execution. <br/>
`npm run cy:open` for opening the cypress dashboard. <br/>

> The development web server must be started before running the automated cypress tests.

## Code quality
The code quality is monitored with eslint. Run `npm run lint` to execute code lint check.
Run `npm run lint:fix` to execute code lint check and automatically fix problems.

## Release and publish
The `ontotext-yasgui-web-component` is regularly published as a package in the NPM registry.

```TODO: Describe the process in details``` 
