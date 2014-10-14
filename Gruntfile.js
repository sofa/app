/* jslint camelcase: false, bitwise: false */
'use strict';

/**
 * Setting livereload port, lrSnippet and a mount function for later
 * connect-livereload integration.
 */
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};


var pushStateHook = function (connect, dir) {
    return function (req, res, next) {
        var path = require('path').resolve(dir);
        var fs = require('fs');
        if (fs.existsSync(path + req.url)) {
            next();
        }
        else {
            fs.readFile(require('path').resolve(dir) + '/index.html', 'utf8', function (err, data) {
                res.end(data);
            });
        }
    };
};

var exec = require('child_process').exec;

module.exports = function (grunt) {

    /**
     * Load required Grunt tasks. These are installed based on the versions listed
     * in `package.json` when you do `npm install --save-dev` in this directory.
     */
    require('load-grunt-tasks')(grunt);
    grunt.loadTasks('./tasks/grunt-conventional-changelog/tasks');

    var userConfig = require('./build.config.js');

    var gruntReleaseOptions = {
        app: {
            options: {
                releaseBranch: 'release',
                cwd: '.',
                distDir: '<%= compile_dir %>'
            }
        },
        deploy: {
            options: {
                releaseBranch: 'deployment'
            }
        }
    };

    var taskConfig = {
        /**
         * We read in our `package.json` file so we can access the package name and
         * version. It's already there, so we don't repeat ourselves here.
         */
        pkg: grunt.file.readJSON('package.json'),
        /**
         * The banner is the comment that is placed at the top of our compiled
         * source files. It is first processed as a Grunt template, where the `<%=`
         * pairs are evaluated based on this very configuration object.
         */
        meta: {
            banner:
                '/**\n' +
                ' * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
                ' * <%= pkg.homepage %>\n' +
                ' *\n' +
                ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
                ' * Licensed <%= pkg.licenses.type %> <<%= pkg.licenses.url %>>\n' +
                ' */\n'
        },
        /**
         * Creates a changelog based on given commit history that follows
         * a certain convention. Currently changelogs are only generated
         * in repository leafs (tags).
         */
        changelog: {
            options: {
                github: '<%= pkg.repository %>',
                dest: 'CHANGELOG.md',
                previousTagCmd: 'git tag | sort -n -t. -k1,1 -k2,2 -k3,3 | tail -1'
            }
        },
        /**
         * Cleans up our working directory.
         */
        clean: {
            build: {
                src: '<%= build_dir %>'
            },

            compile: {
                src: '<%= compile_dir %>'
            }
        },

        /**
         * HTML2JS is a Grunt plugin that takes all of your template files and
         * places them into JavaScript files as strings that are added to
         * AngularJS's template cache. This means that the templates too become
         * part of the initial payload as one JavaScript file. Neat!
         */
        html2js: {
            app: {
                options: {
                    base: '<%= app_base %>',
                },
                src: ['<%= app_files.app_tpl %>'],
                dest: '<%= tpl.js_file %>',
                module: '<%= tpl.module_name %>'
            }
        },

        /**
         * `jshint` defines the rules of our linter as well as which files we
         * should check. This file, all javascript sources, and all our tests
         * are linted based on the policies listed in `options`. But we can also
         * specify exclusionary patterns by prefixing them with an exclamation
         * point (!); this is useful when code comes from a third party but is
         * nonetheless inside `src/`.
         */
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                force: true, // Don't fail the task, just warn
                ignores: [
                    'modules/common/router/angular-ui-router.js',
                    'modules/common/dialog/ui-bootstrap-modal-tpls-0.6.0.js',
                    'modules/common/snap/angular-snap.js'
                ]
            },

            src: {
                files: {
                    src: ['<%= app_files.js %>']
                }
            },

            test_unit: {
                files: {
                    src: [
                        '<%= app_files.jsunit %>',
                    ]
                }
            },

            test_e2e: {
                files: {
                    src: [
                        '<%= app_files.jse2e %>'
                    ]
                }
            },

            gruntfile: {
                files: {
                    src: ['Gruntfile.js']
                }
            },

            buildconf: {
                files: {
                    src: ['build.config.js']
                }
            }
        },

        /**
         * Use grunt-contrib-sass for sass compiling.
         */
        sass: {
            build: {
                options: {
                    style: 'expanded'
                },
                files: {
                    '<%= build_dir %>/assets/css/app.css': '<%= sass_dir %>/app.scss'
                }
            }
        },

        /**
         * The `copy` task just copies files from A to B. We use it here to copy
         * our project assets (images, fonts, etc.) and javascripts into
         * `build_dir`, and then to copy the assets to `compile_dir`.
         */
        copy: {

            build_assets: {
                files: [
                    /**
                    * Copy the whole assets folder to assets folder of
                    * `build_dir`.
                    */
                    {
                        src: ['**'],
                        dest: '<%= build_dir %>/assets/',
                        cwd: 'assets',
                        expand: true
                    },
                    /**
                    * Copy font files from `sass_dir` to assets folder of
                    * `build_dir`. We assuming that `css` folder is there because
                    * `sass` task already ran at this time.
                    */
                    {
                        expand:  true,
                        cwd: '<%= sass_dir %>/',
                        src: ['font/**/*'],
                        dest: '<%= build_dir %>/assets/css/'
                    }
                ]
            },

            build_appjs: {
                files: [
                    {
                        src: ['<%= app_files.js %>'],
                        dest: '<%= build_dir %>',
                        cwd: '.',
                        expand: true
                    }
                ]
            },

            build_data: {
                files: [
                    {
                        src: ['<%= shop_data_dir %>/**'],
                        cwd: 'data',
                        dest: '<%= build_dir %>/data/',
                        expand: true
                    }
                ]
            },

            build_langdata: {
                files: [
                    {
                        src: ['cc.lang.js'],
                        cwd: 'data',
                        dest: '<%= build_dir %>/data/',
                        expand: true
                    }
                ]
            },

            build_testfiles: {
                files: [
                    {
                        src: ['<%= test_files.js %>'],
                        dest: '<%= build_dir %>',
                        cwd: '.',
                        expand: true
                    }
                ]
            },

            /**
             * Copy static pages mocks for local development to build data folder.
             */
            build_staticpages: {
                files: [
                    {
                        src: ['pages/html/**'],
                        cwd: 'data',
                        dest: '<%= build_dir %>/data/',
                        expand: true
                    }
                ]
            },

            build_vendorcss: {
                files: [
                    {
                        expand: true,
                        src: ['<%= vendor_files.css %>'],
                        cwd: '.',
                        dest: '<%= build_dir %>/'
                    }
                ]
            },

            build_vendorjs: {
                files: [
                    {
                        expand: true,
                        src: ['<%= vendor_files.js %>'],
                        cwd: '.',
                        dest: '<%= build_dir %>/',
                        // this is a temporary fix for the case we have to reference
                        // vendor files that sit in `../`.
                        rename: function (dest, src) {
                            if (src.indexOf('../') > -1) {
                                src = src.replace('../', '');
                            }
                            return dest + src;
                        }
                    }
                ]
            },

            compile_assets: {
                files: [
                    {
                        expand: true,
                        src: ['**'],
                        dest: '<%= compile_dir %>/assets',
                        cwd: '<%= build_dir %>/assets'
                    }
                ]
            },

            compile_data: {
                files: [
                    {
                        src: ['**'],
                        cwd: '<%= build_dir %>/data',
                        dest: '<%= compile_dir %>/data/',
                        expand: true
                    }
                ]
            },

        },

        /**
         * `ng-min` annotates the sources before minifying. That is, it allows us
         * to code without the array syntax.
         */
        ngmin: {
            compile: {
                files: [
                    {
                        src: [ '<%= app_files.js %>' ],
                        cwd: '<%= build_dir %>',
                        dest: '<%= build_dir %>',
                        expand: true
                    }
                ]
            }
        },

        /**
         * `grunt concat` concatenates multiple source files into a single file.
         */
        concat: {
            /**
             * The `compile_dir` target is the concatenation of our application source
             * code into a single file. All files matching what's in the `src.js`
             * configuration property above will be included in the final build.
             *
             * In addition, the source is surrounded in the blocks specified in the
             * `build.intro` and `build.outro` files, which are just run blocks
             * to ensure nothing pollutes the global namespace.
             *
             * The `options` array allows us to specify some customization for this
             * operation. In this case, we are adding a banner to the top of the file,
             * based on the above definition of `meta.banner`. This is simply a
             * comment with copyright information.
             */
            compile_js: {
                src: [
                    '<%= vendor_files.js %>',
                    'build.intro.js',
                    '<%= build_dir %>/<%= app_base %>/**/*.js',
                    '<%= html2js.app.dest %>',
                    'build.outro.js'
                ],
                dest: '<%= compile_dir %>/assets/js/<%= appJsName %>'
            },
        },

        uglify: {
            compile: {
                files: {
                    '<%= concat.compile_js.dest %>': '<%= concat.compile_js.dest %>'
                }
            },

            debug: {
                options: {
                    compress: false,
                    preserveComments: 'all',
                    mangle: false,
                    beautify: true
                },
                files: {
                    '<%= concat.compile_js.dest %>': '<%= concat.compile_js.dest %>'
                }
            }
        },

        /**
         * The `index` task compiles the `index.html` file as a Grunt template. CSS
         * and JS files co-exist here but they get split apart later.
         */
        index: {
            /**
             * During development, we don't want to have wait for compilation,
             * concatenation, minification, etc. So to avoid these steps, we simply
             * add all script files directly to the end of `<body>` of `index.html`.
             * The `src` property contains the list of included files.
             */
            build: {
                dir: '<%= build_dir %>',
                src: [
                    '<%= vendor_files.js %>',
                    '<%= data_files.config %>',
                    '<%= data_files.lang %>',
                    '<%= build_dir %>/<%= app_base %>/**/*.js',
                    '<%= data_files.inject %>',
                    '<%= html2js.app.dest %>',
                    '<%= vendor_files.css %>',
                    '<%= build_dir %>/assets/css/**/*.css'
                ]
            },

            compile: {
                dir: '<%= compile_dir %>',
                src: [
                    '<%= concat.compile_js.dest %>',
                    '<%= data_files.config %>',
                    '<%= data_files.lang %>',
                    '<%= data_files.inject %>',
                    '<%= vendor_files.css %>',
                    '<%= compile_dir %>/assets/css/app.css'
                ]
            }
        },

        /**
         * This task compiles the karma template so that changes to its file array
         * don't have to be managed manually.
         */
        karmaconfig: {
            unit: {
                dir: '<%= build_dir %>',
                src: [
                    '<%= vendor_files.js %>',
                    '<%= data_files.config %>',
                    '<%= data_files.lang %>',
                    '<%= html2js.app.dest %>',
                    '<%= test_files.js %>',
                    '<%= app_files.jsunit %>'
                ]
            }
        },

        protractorconfig: {
            e2e: {
                dir: '<%= build_dir %>',
                baseUrl: 'http://localhost:<%= app_port %>',
                template: 'protractor-e2e',
                src: ['<%= app_files.jse2e %>'],
                suites: '<%= app_files.jse2esuites %>'
            },
            saucelabs: {
                dir: '<%= build_dir %>',
                baseUrl: 'http://couchdemoshop.couchcommerce.com',
                template: 'protractor-e2e-saucelabs',
                src: ['<%= app_files.jse2e %>'],
                suites: '<%= app_files.jse2esuites %>'
            }
        },
        /**
         * The Karma configurations.
         */
        karma: {
            options: {
                configFile: '<%= build_dir %>/karma-unit.js'
            },
            unit: {
                port: 9101,
                background: true
            },
            continuous: {
                singleRun: true
            },
            debug: {
                singleRun: false
            }
        },

        protractor: {
            options: {
                keepAlive: false,
                noColors: false,
            },
            e2e: {
                options: {
                    configFile: '<%= build_dir %>/protractor-e2e.js'
                }
            }
        },
        /**
         * connect-server instance, by default lisiting to port 9000
         */
        connect: {
            /**
             * Testserver instance for e2e tests. This is a work in progress since
             * we're still having problems with the e2e test environment.
             */
            testserver: {
                options: {
                    port: '<%= app_port %>',
                    // change this to '0.0.0.0' to access the server from outside
                    hostname: '*',
                    base: '<%= build_dir %>'
                }
            },

            livereload: {
                options: {
                    port: '<%= app_port %>',
                    // change this to '0.0.0.0' to access the server from outside
                    hostname: '*',
                    middleware: function (connect) {
                        return [lrSnippet, mountFolder(connect, 'build'), pushStateHook(connect, 'build')];
                    }
                }
            }
        },

        /**
         * `cssmin` task takes care of concatenating vendor css files with our source
         * css files, as well as minifying them.
         */
        cssmin: {
            compile: {
                options: {
                    report: 'gzip'
                },
                files: {
                    '<%= build_dir %>/assets/css/app.css': [
                        '<%= vendor_files.css %>',
                        '<%= build_dir %>/assets/css/app.css'
                    ]
                }
            }
        },

        releaseBranchPre: gruntReleaseOptions,
        releaseBranch: gruntReleaseOptions,

        shell: {
            /**
             * This command saves all sym links to sofa packages in a .symstash file for
             * later retrieval
             */
            stash_syms: {
                command: 'find node_modules/sofa* -type l',
                options: {
                    callback: function (err, stdout, stderr, cb) {

                        if (err) {
                            grunt.warn(err);
                        }

                        var linkedPackages = stdout.replace(/node_modules\//g, '').trim();

                        var unlinkCommand = linkedPackages
                                                .split('\n')
                                                .join(' && npm unlink ');

                        unlinkCommand = 'npm unlink ' + unlinkCommand + '&& npm install';

                        grunt.file.write('.symstash', linkedPackages);

                        exec(unlinkCommand, null, function (err, stdout) {

                            if (err) {
                                grunt.warn(err);
                            }

                            grunt.log.writeln(stdout);
                            cb();
                        });
                    }
                }
            },
            /**
             * This command warns about sym linked sofa packages unless
             * the --force-local flag was provided
             */
            sym_check: {
                command: 'find node_modules/sofa* -type l -depth 0',
                options: {
                    callback: function (err, stdout, stderr, cb) {

                        if (grunt.option('force-local')) {
                            cb();
                            return;
                        }

                        var hasSyms =  stdout.replace(/node_modules\//g, '')
                                             .trim()
                                             .length > 0;

                        if (hasSyms) {
                            grunt.fail.warn('ATTENTION: you have sym linked packages. Please run `grunt stash-syms`, test the app and run the previous command again.');
                        }
                        else {
                            cb();
                        }
                    }
                }
            },

            checkout_last_branch: {
                command: 'git checkout -'
            },

            dist: {
                options: {
                    stdout: true,
                    stderr: true,
                    failOnError: true
                },
                // The backend needs to have both the raw source folders
                // (it needs access to the scss files!) but it also needs to grab
                // the final dist of the app. So what we do is we don't follow
                // the regular release branch pattern where we just move the
                // contents of the dist folder on the root level and delete all
                // source files but instead we just add the dist folder
                // to the version control for the deployment branch/tag.
                command: function () {
                    return [
                        'git add -A',
                        'git add -f dist',
                        'git add -f node_modules/sofa-base'
                    ].join(' && ');
                }
            }
        },

        /**
         * And for rapid development, we have a watch set up that checks to see if
         * any of the files listed below change, and then to execute the listed
         * tasks when they do. This just saves us from having to type "grunt" into
         * the command-line every time we want to see what we're working on; we can
         * instead just leave "grunt watch" running in a background terminal. Set it
         * and forget it, as Ron Popeil used to tell us.
         *
         * But we don't need the same thing to happen for all the files.
         */
        delta: {
            /**
             * By default, we want the Live Reload to work for all tasks; this is
             * overridden in some tasks (like this file) where browser resources are
             * unaffected. It runs by default on port 35729, which your browser
             * plugin should auto-detect.
             */
            options: {
                livereload: true
            },

            /**
             * When the Gruntfile changes, we just want to lint it. In fact, when
             * your Gruntfile changes, it will automatically be reloaded!
             */
            gruntfile: {
                files: 'Gruntfile.js',
                tasks: ['jshint:gruntfile'],
                options: {
                    livereload: false
                }
            },

            /**
             * When our JavaScript source files change, we want to run lint them and
             * run our unit tests.
             */
            jssrc: {
                files: [
                    '<%= app_files.js %>'
                ],
                tasks: ['jshint:src', 'karma:unit:run', 'copy:build_appjs']
            },

            /**
             * When assets are changed, copy them. Note that this will *not* copy new
             * files, so this is probably not very useful.
             */
            assets: {
                files: ['assets/**/*', '!assets/**/*.scss'],
                tasks: ['copy:build_assets']
            },

            /**
             * When index.html changes, we need to compile it.
             */
            html: {
                files: ['<%= app_files.html %>'],
                tasks: ['index:build' ]
            },

            /**
             * When our templates change, we only rewrite the template cache.
             */
            tpls: {
                files: [
                    '<%= app_files.app_tpl %>'
                ],
                tasks: [ 'html2js' ]
            },

            /**
             * When SCSS files changes, we need to compile them to css
             */
            sass_assets: {
                files: ['assets/**/*.scss'],
                tasks: ['sass']
            },

            sass_app: {
                files: ['src/app/**/*.scss'],
                tasks: ['sass']
            },

            sass_vendor: {
                files: [
                    '<%= vendor_files.scss %>'
                ],
                tasks: ['sass']
            },

            /**
             * When a JavaScript test file changes, we only want to lint it and
             * run the tests. We don't want to do any live reloading.
             */
            jsunit: {
                files: [
                    '<%= app_files.jsunit %>'
                ],
                tasks: ['jshint:test_unit', 'karma:unit:run'],
                options: {
                    livereload: false
                }
            },

            jse2e: {
                files: [
                    '<%= app_files.jse2e %>'
                ],
                tasks: ['jshint:test_e2e'],
                options: {
                    livereload: false
                }
            },

            /**
             * Re-copies the vendor files when they change.
             */
            vendor_files_js: {
                files: ['<%= vendor_files.js %>'],
                tasks: ['copy:build_vendorjs', 'index:build']
            }
        },

        deploy: {
            options: {
                tagOnly: true,
                masterBranch: 'master',
                versionFiles: [
                    'package.json'
                ],
                preDeployFn: function (grunt, newVersion, done) {
                    // Needed to make uglify use the banner with the new version inside
                    grunt.config.set('pkg', grunt.file.readJSON('package.json'));

                    grunt.config.set('changelog.options.version', newVersion);

                    var tasks = [];

                    if (!grunt.option('force-local')) {
                        tasks = tasks.concat([
                            'shell:sym_check',
                            'reinstall-npm-packages'
                        ]);
                    }

                    tasks = tasks.concat([
                        'build',
                        //'e2e',
                        'releaseBranchPre:deploy',
                        grunt.option('debug') ? 'compile-debug' : 'compile',
                        'changelog',
                        'shell:dist'
                    ]);

                    grunt.task.run(tasks);

                    done();
                },
                postDeployFn: function (grunt, newVersion, done) {
                    grunt.task.run([
                        'shell:checkout_last_branch'
                    ]);
                    done();
                }
            }
        },

        concurrent: {
            dev: {
                tasks: ['nodemon', 'delta'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },

        nodemon: {
            dev: {
                script: 'server/main.js',
                options: {
                    watch: ['server']
                }
            }
        },

        nodeunit: {
            all: ['server/test/**/*.js']
        }
    };

    grunt.initConfig(grunt.util._.merge(taskConfig, userConfig));

    /**
     * In order to make it safe to just compile or copy *only* what was changed,
     * we need to ensure we are starting from a clean, fresh build. So we rename
     * the `watch` task to `delta` (that's why the configuration var above is
     * `delta`) and then add a new task called `watch` that does a clean build
     * before watching for changes.
     */
    grunt.renameTask('watch', 'delta');

    var watchTasks = [];

    watchTasks.push('build', 'karma:unit');

    if (userConfig.shop_data_dir === 'local') {
        watchTasks.push('nodeunit');
    }

    watchTasks.push('connect:livereload');

    if (userConfig.shop_data_dir === 'local') {
        watchTasks.push('concurrent');
    }
    else {
        watchTasks.push('delta');
    }

    grunt.registerTask('watch', watchTasks);

    /**
     * Declaring `build` as our default task. This means, if you simply run
     * `grunt` in the command line, `build` gets executed.
     */
    grunt.registerTask('default', ['build', 'compile']);

    /**
     * Defining our general build task. This task does everything what's needed
     * to generate a development build of the app. Which means all resources are
     * explicitly referenced. No minified or compressed files are used.
     */
    grunt.registerTask('build', [
        'clean',
        'html2js',
        'jshint',
        'sass',
        'copy:build_assets',
        'copy:build_appjs',
        'copy:build_data',
        'copy:build_langdata',
        'copy:build_staticpages',
        'copy:build_testfiles',
        'copy:build_vendorcss',
        'copy:build_vendorjs',
        'index:build',
        'karmaconfig',
        'karma:continuous',
    ]);

    /**
     * `compile` task definition. This task generates a production ready app
     * based on a generated build. In other words, to run `compile` task you
     * have to run `build` task first.
     */
    grunt.registerTask('compile', [
        'name-min',
        'cssmin:compile',
        'copy:compile_assets',
        'copy:compile_data',
        'ngmin',
        'concat:compile_js',
        'uglify:compile',
        'index:compile'
    ]);

    grunt.registerTask('e2e', [
        'protractorconfig',
        'protractor:e2e',
    ]);

    grunt.registerTask('compile-debug', [
        'name-min',
        'cssmin:compile',
        'copy:compile_assets',
        'copy:compile_data',
        'ngmin',
        'concat:compile_js',
        'uglify:debug',
        'index:compile'
    ]);

    grunt.registerTask('compile-unique', [
        'name-unique',
        'cssmin:compile',
        'copy:compile_assets',
        'copy:compile_data',
        'ngmin',
        'concat:compile_js',
        'uglify:compile',
        'index:compile'
    ]);

    /**
     * A utility function to get all app JavaScript sources.
     */
    function filterForJS(files) {
        return files.filter(function (file) {
            return file.match(/\.js$/);
        });
    }

    /**
     * A utility function to get all app CSS sources.
     */
    function filterForCSS(files) {
        return files.filter(function (file) {
            return file.match(/\.css$/);
        });
    }


    /**
     * This is an alias to shell:stash_syms
     */
    grunt.registerTask('stash-syms', [
        'shell:stash_syms'
    ]);

    /**
     * This command reinstalls all npm packages
     */
    grunt.registerTask('reinstall-npm-packages', 'deletes all node_modules and fetches them again', function () {
        var done = this.async();

        if (grunt.option('force-local')) {
            done();
            return;
        }

        exec('rm -rf node_modules && npm install', null, function (err, stdout) {
            if (err) {
                grunt.fail.error(err);
            }

            grunt.log.writeln(stdout);
            done();
        });
    });


    /**
     * This command restores previously linked npm packages
     */
    grunt.registerTask('pop-syms', 'restore previously saved symlinks', function () {
        var done = this.async();
        var fs = require('fs');
        fs.readFile('.symstash', 'utf-8', function (err, content) {
            if (err) {
                grunt.warn(err);
            }

            var linkCommand = content
                                .split('\n')
                                .join(' && npm link ');

            linkCommand = 'npm link ' + linkCommand;

            exec(linkCommand, null, function (err, stdout) {

                if (err) {
                    grunt.warn(err);
                }

                grunt.log.writeln(stdout);
                done();
            });

        });
    });


    /**
     * The index.html template includes the stylesheet and javascript sources
     * based on dynamic names calculated in this Gruntfile. This task assembles
     * the list into variables for the template to use and then runs the
     * compilation.
     */
    grunt.registerMultiTask('index', 'Process index.html template', function () {
        var dirRE = new RegExp('^(' + grunt.config('build_dir') + '|' + grunt.config('compile_dir') + ')\/', 'g');
        var jsFiles = filterForJS(this.filesSrc).map(function (file) {
            if (file.indexOf('../') > -1) {
                file = file.replace('../', '');
            }
            return file.replace(dirRE, '');
        });
        var cssFiles = filterForCSS(this.filesSrc).map(function (file) {
            return file.replace(dirRE, '');
        });

        grunt.file.copy('index.html', this.data.dir + '/index.html', {
            process: function (contents) {
                return grunt.template.process(contents, {
                    data: {
                        scripts: jsFiles,
                        styles: cssFiles,
                        version: grunt.config('pkg.version')
                    }
                });
            }
        });
    });

    /**
     * In order to avoid having to specify manually the files needed for karma to
     * run, we use grunt to manage the list for us. The `karma/*` files are
     * compiled as grunt templates for use by Karma. Yay!
     */
    grunt.registerMultiTask('karmaconfig', 'Process karma config templates', function () {
        var jsFiles = filterForJS(this.filesSrc).map(function (file) {
            if (file.indexOf('../') > -1) {
                file = file.replace('../', grunt.config('build_dir') + '/');
            }
            return file;
        });

        grunt.file.copy('karma/karma-unit.tpl.js', grunt.config('build_dir') + '/karma-unit.js', {
            process: function (contents) {
                return grunt.template.process(contents, {
                    data: {
                        scripts: jsFiles
                    }
                });
            }
        });
    });

    grunt.registerMultiTask('protractorconfig', 'Process protractor config templates', function () {

        var jsFiles = filterForJS(this.filesSrc).map(function (file) {
            if (file.indexOf('../') > -1) {
                file = file.replace('../', grunt.config('build_dir') + '/');
            }
            return file;
        });

        var baseUrl = this.data.baseUrl;
        var templateFile = this.data.template;
        var suites = this.data.suites;

        grunt.file.copy('protractor/' + templateFile + '.tpl.js', grunt.config('build_dir') + '/' + templateFile + '.conf.js', {
            process: function (contents) {
                return grunt.template.process(contents, {
                    data: {
                        scripts: jsFiles,
                        baseUrl: baseUrl,
                        suites: suites
                    }
                });
            }
        });
    });

    /**
     * Sets file name for our compile JS file.
     */
    grunt.registerTask('name-min', function () {
        grunt.config.set('appJsName', 'app.min.js');
    });

    /**
     * Generates a unique name for our compile process.
     */
    /* jshint bitwise: false */
    grunt.registerTask('name-unique', function () {
        var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16|0, v = c === 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
        grunt.config.set('appJsName', 'app.min.' + guid + '.js');
    });

};
