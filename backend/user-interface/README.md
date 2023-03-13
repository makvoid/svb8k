# Backend User Interface
> **Note**: This User Interface is intended for use internally only. It is unstyled and has minimum error handling. It is not designed or intended to be exposed publicly.

This User Interface allows us to interact with the parsed records and quickly jump to the reports to grab the pertinent information. It communicates with the backend API to grab records and send the information along so that the records can be created on the Algolia-side.

## Requirements
* NodeJS 14+
* Backend Express API Server running

## Installation
```shell
# Install dependencies
yarn

# Edit the environment variables as needed
vim src/environments/environment.ts

# Run the frontend locally
npx ng serve
```

# Angular Information

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.1.2.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
