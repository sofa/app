# How is this repository organized?

Currently we maintain both the upcoming SDK as well as an app implementation which is written on top of the SDK in this repository.
All SDK related files are located within the `sdk` directory and it's subdirectories.

The app is located within the `app` directory and it's subdirectories.

#What do I need to get the app running?

Prerequisites:

1. You must have `compass` installed

Then follow this process:

1. Checkout the repository

2. Navigate to `app/scss` on the console

3. Run `while :; do clear; compass compile --force app.scss; sleep 4; done`
(running `compass compile --force app.scss` would be enough to get it running,
however, if you plan to hack on the app, you probably want to recompile the SCSS
on changes. Since we organize files by feature rather than by file type,
we currently need to use this simple polling mechanism until we have a proper
grunt task)

4. Open the `index.html` in your browser

#What do I need to work on the SDK?

Prerequisites:

1. You must have `node.js` installed

2. You must have the `grunt-cli` installed

Then follow this process:

1. run `grunt build`

2. run `grunt watch`

#Further tips

It is recommended to keep at least three terminal sessions running. One session to poll for 
SCSS changes (read above), one session to keep the `grunt watch` task running and one session
to interact with git.