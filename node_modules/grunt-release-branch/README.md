# grunt-release-branch

> A grunt task that makes working with release branches (aka gh-pages) a breeze



## Getting Started
This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-release-branch --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-release-branch');
```

## What is the problem with release branches aka `gh-pages` branches?

When developing for the web, we usually have a bunch of build steps which take care of concatenation, minification, inlining templates, generating html snapshots and so on and so on...

After running through all those steps, the final output is usually placed into an output directory that is not commited into version control. Following the `release branch pattern` we take this output and place it on an `orphan` branch, where another mechanism can kick in and e.g. publish it as a website. That's exactly how it works with github when using a `gh-pages` branch.

This grunt plugin consits of two tasks to assist you for those scenarios.


## releaseBranchPre task
This task should run *before* all other build steps. It simply does `git branch -D gh-pages` and `git checkout -b gh-pages` under the covers. Please note that the branch name can be configured with the `releaseBranch` option.

## releaseBranch task
This task should run as the last command in your build orchestration. It moves all the files from your output directory to the root level of your working directory while deleting *all* other stuff except your .git folder. It than optionally commits and pushs using the `--force` parameter.


## configuration

```js


    var releaseBranchOptions = app: {
                                        options: {
                                            //the name of the orphan branch. Default is gh-pages
                                            releaseBranch: 'gh-pages',
                                            //the name of the remote repository. Default is origin
                                            remoteRepository: 'origin',
                                            //the name of the output directory. Default is dist
                                            distDir: 'dist',
                                            //the commit message to be used for the optional commit
                                            commitMessage: 'RELEASE',
                                            //should files be automatically commited on the orphan branch
                                            commit: true
                                            //should the orphan branch be pushed to the remote repository
                                            //default is false
                                            push: true
                                            //a blacklist of things to keep on the root level. By default only
                                            //the .git folder will be kept.
                                            blacklist: [
                                                '.git'
                                            ]
                                        }
                                    };


    grunt.initConfig({
        releaseBranchPre: releaseBranchOptions,
        releaseBranch: releaseBranchOptions
    });
```

## What if my dist is in a subfolder?

Use the `cwd` option to point the way to the root folder of your repository and then set the `dist` folder relative to the root folder of your repository.

```js


    var releaseBranchOptions = app: {
                                        options: {
                                            //the name of the orphan branch. Default is gh-pages
                                            releaseBranch: 'gh-pages',
                                            //the name of the remote repository. Default is origin
                                            remoteRepository: 'origin',
                                            //point the way to the root folder of your repository (default is .)
                                            cwd: '../',
                                            //the name of the output directory. Default is dist
                                            distDir: 'app/dist',
                                            //the commit message to be used for the optional commit
                                            commitMessage: 'RELEASE',
                                            //should files be automatically commited on the orphan branch
                                            commit: true
                                            //should the orphan branch be pushed to the remote repository
                                            //default is false
                                            push: true
                                            //a blacklist of things to keep on the root level. By default only
                                            //the .git folder will be kept.
                                            blacklist: [
                                                '.git'
                                            ]
                                        }
                                    };


    grunt.initConfig({
        releaseBranchPre: releaseBranchOptions,
        releaseBranch: releaseBranchOptions
    });
```

## Release History

- 0.2.0 - added support for cwd option
- 0.1.1 - fixed race condition
- 0.1.0 - Initial release