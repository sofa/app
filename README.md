# CouchCommerce App
This is our App based on our SDK.

## Prerequisites
You need to have the following tools installed globally on you machine:

- npm
- bower
- karma
- compass

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

Simply type:
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

