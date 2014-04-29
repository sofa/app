# CouchCommerce App
This is our App based on our SDK.

## Prerequisites
You need to have the following tools installed globally on you machine:

- node
- npm
- bower
- karma
- compass
- protractor

Make sure to install Java on your local machine.

## Installation

Clone the repo via git:
```sh
$ git clone https://github.com/couchcommerce/frontend-spike && cd frontend-spike
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

##Versioning

Make sure to update dependency versions of sofa in the package.json. Working directly against
unversioned npm packages totally breaks the whole idea of version control. Unfortunately we had that wrong
for one week between versions 0.32.0 and 0.33.0 so that any ref you might check out in between could
be broken in subtile different ways. Deployment packages are correct though since those add a fixed
sofa dependency directly to version control.

The typical update process goes like this:

**1. Create new versions of sofa dependencies that need updates.**

- 1.1 run `grunt` in the sofa component to run tests and produce dist files
- 1.2 run `grunt changelog` to generate the changelog accordingly
- 1.3 update `package.json` and `bower.json` with the new version number according to [http://semver.org/](semver.org)
- 1.4 make a commit that roughly goes like this `chore(release): cutting the 0.3.4 release`
- 1.4 tag the version (e.g. `git tag 0.3.4`)
- 1.5 run `git push origin master && git push --tags`
- 1.6 run `npm publish`

**2. OPTIONALLY (IF NEEDED): Create new version of `sofa-base`**

- 2.1 run `grunt` in `sofa-base`
- 2.2 tag the version according to [http://semver.org/](semver.org) (e.g. `git tag 0.33.0`)
- 2.3 run `git push origin master && git push --tags`

**3. Update the app**

- 3.1 update the `package.json` of the app to use the correct versions of the sofa dependencies
- 3.2 in case updates have been made to `sofa-base` make sure to also update the tag dependency in the app's `package.json`
- 3.3 run `grunt deploy --app-version=VERSION` with the correct version number (e.g. `grunt deploy --app-version=0.50.0`)
- 3.4 enjoy!

**4. Deploy versions from the console**

- 4.1 go to couchdemoshop/admin
- 4.2 pick version from the selectbox and update (might take a minute or two until it shows up)
- 4.3 drop a note in the QA room about the update and what they should test
- 4.4 Wait for feedback, slowly roll it out to a handful shops if everything is fine and give another note to the QA team about updated shops
- 4.5 Roll it out to all the other shops (usually we let a couple of days pass until we roll out things to ALL THE SHOPS)

#Contribute

We'd love you to contribute. Please make sure to read the [contribute guide line](https://github.com/couchcommerce/frontend-spike/wiki/Contribute)

