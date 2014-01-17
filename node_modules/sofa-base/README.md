# How is this repository organized?

Currently we maintain both the upcoming SDK as well as an app implementation which is written on top of the SDK in this repository.
All SDK related files are located within the `sdk` directory and it's subdirectories.

The app is located within the `app` directory and it's subdirectories.

#What do I need to get the app running?

Prerequisites:

1. You must have `compass` installed
 
2. You must have `node.js` installed

3. You must have the `grunt-cli` installed

Then follow this process:

1. Checkout the repository

2. Navigate to `app` on the console

3. Run `grunt`

4. Open another console tab and navigate to `sdk``

5. Run `grunt`

6. Open the `app/dist/index.html` in your browser

#What do I need to work on the SDK?

Prerequisites:

1. You must have `node.js` installed

2. You must have the `grunt-cli` installed

3. Navigate to `sdk` on the console

4. Run `grunt`

#Further tips

grunt will keep running in both terminal sessions. Keep it running, it does all the heavy
lifting behind the scenes.

#Contribute

We'd love you to contribute. Please make sure to read the [contribute guide line](https://github.com/couchcommerce/frontend-spike/wiki/Contribute)

