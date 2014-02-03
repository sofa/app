# CouchCommerce App
This is our App based on our SDK.

## Prerequisites
You need to have the following tools installed globally on you machine:

- npm
- bower
- karma
- compass
- protractor

Make sure to install Java on your local machine.

## Installation

Clone the repo via git:
```sh
$ git glone https://github.com/couchcommerce/frontend-spike && cd frontend-spike
```

Install depencencies:
```sh
$ npm install
$ bower install
```
## Running the App

To run the app you have to make sure that a selenium server is running, since the
inital build task will run all provided e2e tests. To run a selenium server all you
have to do is to run

```sh
webdriver-manager start
```

The webdriver-manager comes with the installation of protractor (`npm install -g protractor`).

After that simply run:
```sh
$ grunt watch
```
This will run the `build` and the `delta` task. You can now open a browser at `http://localhost:9000`.

The task also takes care of re-running sub targets during development when changes occur.

## Configuration
To configure the app, makes changes in the `build.conf.js` file accordingly.

## Build Tasks

- `grunt watch` - process `build` tasks and starts a server for you
- `grunt build` - generates a build of the app. This can be run in the browser.
- `grunt compile` - compiles a built app. The result is a production ready package.
- `grunt compile-debug` - same as `compile` without uglified JavaScript
- `grunt deploy` - deploys the app.
- `grunt deploy-debug` - same as `deploy` without uglified JavaScript.

#Contribute

We'd love you to contribute. Please make sure to read the [contribute guide line](https://github.com/couchcommerce/frontend-spike/wiki/Contribute)

