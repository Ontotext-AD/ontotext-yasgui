# ontotext-yasgui

The `ontotext-yasgui` project contains the `ontotext-yasgui-web-component` wrapper around the YASGUI library allowing easy reusing by simply embedding the custom html tag in any web project be it vanilla javascript or based on any of the popular SPA frameworks. This component also extends the YASGUI API and serves as a facade behind which customizations can be implemented without affecting the client projects.
The component is heavily used in the Ontotext's [GraphDB Workbench](https://github.com/Ontotext-AD/graphdb-workbench). All extensions and customizations made on top of the original YASGUI library came as requirements during integration of the library in the GraphDB Workbench UI. 

This project is composed by following sub-projects:
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

# How to get started with development tasks in this project

Read [Development guide](ontotext-yasgui-web-component/docs/developers-guide.md) before 
starting any development in this project. Below are some first steps helping to get started:

1. #### Clone the this repository.
```
git clone https://github.com/Ontotext-AD/ontotext-yasgui.git
```

2. #### Install all dependencies
``` 
npm install
```
   
4. #### Build projects
   Execute the ``` npm run build ``` command. The command executes the following tasks:
    - Builds the `Yasgui` component;
    - Copies the built `yasgui.min.js` and `yasgui.min.css` artefacts into `ontotext-yasgui-web-component` 
      project;
    - Builds the `ontotext-yasgui-web-component` project. The component is built in the `dist` 
      folder in the `ontotext-yasgui-web-component`.

5. #### Starting a development server
    A development server can be run by executing the ``` npm run start ``` command. This will run a
    simple web server and deploy a sample web page with the `ontotext-yasgui-web-component` inside. 
    The server supports a watch mode, and a live reload of the web browser.

6. #### Running the automated tests
    The automated tests can be run by executing one of the following commands: <br/>
    `npm run cy:run` for headless tests execution. <br/>
    `npm run cy:open` for opening the cypress dashboard. <br/>

    > The development web server must be started before running the automated cypress tests.

7. #### Ensuring the code quality
    The code quality is monitored with eslint. Executing the `npm run lint` command will perform a code
    lint check. And running the `npm run lint:fix` command will execute a code lint check as well as an
    automatic problems fixing where possible and reporting the rest.

8. #### Releasing
   The `ontotext-yasgui-web-component` is regularly published as a package in the NPM registry. This is
   done via automated CI.

9. #### Cleaning up
   Execute the ``` npm run clean ``` command. This command will delete:
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

After execution of this command the project will be in a state same as it was just cloned from the repository.

> For development purposes the minification of the yasgui can be skipped by setting the `minimize` property to 
> `false` of the optimization configuration in Yasgui/webpack/config.ts file.

## Usage of the component
After the `ontotext-yasgui-web-component` is built, then it can be used in every supported by 
`stenciljs` framework or in vanilla javascript applications. Read 
[Usage guide](ontotext-yasgui-web-component/README.md) for details how to use it.


```TODO: Describe the process in details``` 
