
module.exports = function(grunt) {

    var gruntReleaseOptions =   {
        app: {
            options: {
                releaseBranch: 'release',
                cwd: '../',
                distDir: 'app/dist'
            }
        },
        deploy: {
            options: {
                releaseBranch: 'deployment'
            }
        }
    };

    // Project configuration.
    grunt.initConfig({
        distdir: 'dist',
        scriptString: '',
        appJsName: 'app.js',
        templateFile: '<%= distdir %>/templates/templates.js',
        pkg: grunt.file.readJSON('package.json'),
        files: {
            angular:  [
                'lib/angular-unstable/angular.js',
                'lib/angular-unstable/angular-sanitize.js'
            ],
            //yep, it's a bit wacko that we know those internal things
            //about the SDK here. But we want to have that for debugging.
            sdk:[
                '../sdk/src/core/cc.js',
                '../sdk/src/core/**/*.js',
                '../sdk/src/services/**/*.js',
                '../sdk/src/directives/**/*.js',
                '../sdk/src/decorators/**/*.js',
                '../sdk/src/filter/**/*.js',
                '!../sdk/src/**/demos/**/*',
                '../sdk/dist/cc.angular.templates.js'
            ],
            app:[
                'modules/**/*.js', 
                '<%= templateFile %>'
            ]
        },
        uglify: {
          // options: {
          //   banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
          // },
          build: {
            src: 'dist/js/app.js',
            dest: 'dist/js/<%= appJsName %>'
          }
        },
        clean: ['<%= distdir %>/*'],
        concat:{
            production: {
                src:[
                    '<%= files.angular %>',
                    '../sdk/dist/cc.js',
                    '../sdk/dist/cc.angular.js',
                    'build.intro.js',
                    '<%= files.app %>',
                    'build.outro.js'
                ],
                dest:'<%= distdir %>/js/app.js'
            },
            index: {
                src: ['index.html'],
                dest: '<%= distdir %>/index.html',
                options: {
                    process: true
                }
            }
        },
        sass: {
            dev: {
                options: {
                    // nested (default), compact, compressed, or expanded.
                    style: 'expanded'
                },
                files: {
                    'dist/css/app.css': 'scss/app.scss'
                }
            }
        },
        copy: {
            all: {
                files: [
                    {expand: true, cwd: 'scss/', src: ['font/**/*'], dest: 'dist/css/'},
                    {src: ['lib/**/*'], dest: 'dist/'},
                    {src: ['data/**/*'], dest: 'dist/'},
                    {src: ['images/**/*'], dest: 'dist/'},
                    {expand: true, cwd: '../sdk/dist', src: ['cc.js'], dest: 'dist/lib'},
                    {expand: true, cwd: '../sdk/dist', src: ['cc.angular.js'], dest: 'dist/lib'}
                ]
            }
        },
        jshint: {
            all: ['Gruntfile.js', 'modules/**/*.js', 'test/**/*.js'],
            options: {
                eqeqeq: true,
                globals: {
                    cc: true,
                    window: true,
                    angular: true
                },
                ignores: [
                    'modules/common/router/angular-ui-router.js'
                ]
            }
        },
        html2js: {
            app: {
                options: {
                    base: '.'
                },
                src: ['modules/**/*.tpl.html'],
                dest: '<%= templateFile %>',
                module: 'templates'
            }
        },
        watch: {
            sass: {
                files: [
                    'scss/**/*.scss',
                    'modules/**/*.scss',
                    '../sdk/**/*.scss'
                ],
                tasks: ['build']
            },
            source: {
                files: [
                    'index.html',
                    'modules/**/*.js',
                    'modules/**/*.html'
                ],
                tasks: ['build']
            },
            sdk: {
                files: [
                    '../sdk/dist/*.js'
                ],

                tasks: ['build']
            }
        },
        connect: {
            server: {
                options: {
                    port: 9191,
                    base: '..',
                    keepalive: true,
                    hostname: '0.0.0.0'
                }
            }
        },
        script:{
            dev:{
                src: [
                    //angular
                    '<%= files.angular %>',
                    '<%= files.sdk %>',
                    '<%= files.app %>',
                    //lang file
                    'lib/cc.lang.js',
                    'lib/cc.config.js'
                ],
                relativeTo: 'dist/',
                outputTo: 'scriptString'
            },
            production:{
                src: [
                    'dist/js/<%= appJsName %>',
                    'dist/lib/cc.lang.js',
                    'dist/lib/cc.config.js'
                ],
                outputTo: 'scriptString',
                relativeTo: 'dist/'
            }
        },
        releaseBranchPre: gruntReleaseOptions,
        releaseBranch: gruntReleaseOptions,
        shell: {
            dist: {
                options: {
                    stdout: true,
                    stderr: true,
                    failOnError: true
                },
                //The backend needs to have both the raw source folders (it needs access to the scss files!)
                //but it also needs to grab the final dist of the app. So what we do is we don't follow
                //the regular release branch pattern where we just move the contents of the dist folder
                //on the root level and delete all source files but instead we just add the dist folder
                //to the version control for the deployment branch/tag.
                command: function(){
                    var version = grunt.option('app-version');

                    if (typeof version === 'undefined'){
                        grunt.log.error('You need to specify a version with --app-version....stupid!');
                        return;
                    }

                    return 'git add -f dist && git commit -m "chore(*): adding dist folder for ' + version + ' release" && git tag ' + version + ' && git push --tags';
                }
            }
        }
    });

    grunt.registerTask('default', ['build', 'watch']);

    grunt.registerTask('build', ['clean', 'html2js', 'jshint', 'script:dev', 'concat:index', 'sass', 'copy']);

    grunt.registerTask('production', ['name-min', 'clean', 'html2js', 'jshint', 'concat:production', 'sass', 'copy', 'uglify', 'script:production', 'concat:index']);

    grunt.registerTask('production--unique', ['name-unique', 'clean', 'html2js', 'jshint', 'concat:production', 'sass', 'copy', 'uglify', 'script:production', 'concat:index']);

    grunt.registerTask('release', ['releaseBranchPre:app', 'production--unique', 'releaseBranch:app']);

    grunt.registerTask('deploy', ['releaseBranchPre:deploy', 'production', 'shell:dist']);

    grunt.registerTask('name-min', function(){
        grunt.config.set('appJsName', 'app.min.js');
    });

    grunt.registerTask('name-unique', function(){
        var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
        grunt.config.set('appJsName', 'app.min.' + guid + '.js');
    });

    grunt.registerMultiTask('script', function(){
        var path = require('path');
        var relativeTo = this.data.relativeTo || '';
        var scriptTags = this.filesSrc
                            .map(function(val){ 
                                return '<script src="' + path.relative(relativeTo, val) + '"></script>'; 
                            })
                            .join('\n');

        var configProperty = this.data.outputTo || this.name + '.' + this.target + '.scripts';

        grunt.config.set(configProperty, scriptTags);
    });

    //grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-release-branch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-shell');

};
