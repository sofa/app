#Contributing to the CouchCommerce app or the sdk

We'd love for you to contribute to our source code and to make the app or the sdk even better than it is
today! Here are the guidelines we'd like you to follow:

## Got a Question or Problem?

If you have questions please create an issue and use the `question` tag to mark it as such.

## Found an Issue?
If you find a bug in the source code or a mistake in the documentation, you can help us by
submitting and issue to our [GitHub Repository][github]. Even better you can submit a Pull Request
with a fix.

**Please see the Submission Guidelines below**.

## Want a Feature?
You can request a new feature by submitting an issue to our [GitHub Repository][github].  If you
would like to implement a new feature then consider what kind of change it is:

* **Major Changes** that you wish to contribute to the project should be discussed first on through a github ticket so that we can better coordinate our efforts, prevent
duplication of work, and help you to craft the change so that it is successfully accepted into the
project.
* **Small Changes** can be crafted and submitted to [GitHub Repository][github] as a Pull Request.

## Submission Guidelines

### Submitting an Issue
Before you submit your issue follow the following guidelines:

* Search the archive first, it's likely that your question was already answered.
* A live example demonstrating the issue, will get an answer faster.
* Create one using [Plunker][plunker] or [JSFiddle][jsfiddle].
* If you get help, help others. Good karma rulez!

If your issue appears to be a bug, and hasn't been reported, open a new issue.
Help us to maximize the effort we can spend fixing issues and adding new
features, by not reporting duplicate issues.

### Submitting a Pull Request
Before you submit your pull request follow the following guidelines:

* Search GitHub for an open or closed Pull Request that relates to your submission. You don't want
  to duplicate effort.
* Make your changes in a **new git branch**
* If you contribute multiple things make sure to create a **new branch** for each issue/feature. Also make sure that each **new branch** is branched of from latest **master**
* Multiple commits can only go in one branch/PR if they **depend on each other**
* Follow our Coding Rules
* Follow our Git Commit Guidelines
* If we suggest changes then you can modify your branch, rebase and force a new push to your GitHub
  repository to update the Pull Request.

## Git Commit Guidelines

We have very precise rules over how our git commit messages can be formatted.  This leads to **more
readable messages** that are easy to follow when looking through the **project history**.  But also,
we use the git commit messages to **generate the a change log**.

### Commit Message Format
Each commit message consists of a **header**, a **body** and a **footer**.  The header has a special
format that includes a **type**, a **scope** and a **subject**:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

Any line of the commit message cannot be longer 100 characters! This allows the message to be easier
to read on github as well as in various git tools.

### Type
Must be one of the following:

* **feat**: A new feature
* **fix**: A bug fix
* **docs**: Documentation only changes
* **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing
  semi-colons, etc)
* **refactor**: A code change that neither fixes a bug or adds a feature
* **test**: Adding missing tests
* **chore**: Changes to the build process or auxiliary tools and libraries such as documentation
  generation

### Scope
The scope could be anything specifying place of the commit change. For example `$location`,
`$browser`, `$compile`, `$rootScope`, `ngHref`, `ngClick`, `ngView`, etc...

### Subject
The subject contains succinct description of the change:

* don't capitalize first letter
* no dot (.) at the end

###Body
The body should include the motivation for the change and contrast this with previous behavior.

###Footer
The footer should contain any information about **Breaking Changes** and is also the place to
reference GitHub issues that this commit **Closes**. If a commit fixes multiple issue make sure
to write **Fixes #4711, #4712** instead of **Fixes #4711, 4712** to not confuse github.


A detailed explanation can be found in this [document][commit-message-format].


## Submitting Your Changes

To create and submit a change:

2. Create and checkout a new branch off the master branch for your changes:

   ```shell
   git checkout -b my-fix-branch master
   ```

3. Create your patch, including appropriate test cases.

4. Commit your changes and create a descriptive commit message (the commit message is used to
   generate release notes, please check out our [commit message conventions](#commit-message-format)
   and our commit message presubmit hook `validate-commit-msg.js`):

   ```shell
   git commit -a
   ```

5. Push your branch to Github:

   ```shell
   git push origin my-fix-branch
   ```

6. In Github, send a pull request to `frontend-spike:master`.

That's it! Thank you for your contribution!

When the patch is reviewed and merged, you can safely delete your branch and pull the changes
from the main (upstream) repository:

```shell
# Delete the remote branch on Github:
git push origin :my-fix-branch

# Check out the master branch:
git checkout master

# Delete the local branch:
git branch -D my-fix-branch

# Update your master with the latest upstream version:
git pull --rebase origin master
```

[github]: https://github.com/couchcommerce/frontend-spike
[plunker]: http://plnkr.co/edit
[jsfiddle]: http://jsfiddle.net/
[commit-message-format]: https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit#
