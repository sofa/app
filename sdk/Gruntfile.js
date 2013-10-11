module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        ccName: 'cc',
        ccTestsName: 'cc.tests',
        ccAngularName: 'cc.angular',
        distdir: 'dist',
        src: {
            cc: ['src/core/cc.js','src/core/**/*.js'],
            ccTests: ['test/**/*.js'],
            ccAngular:  [
                            'src/services/**/*.js',
                            'src/directives/**/*.js',
                            'src/filter/**/*.js',
                            '!src/**/demos/**/*'
                        ],
            ccTemplates: ['src/**/*.tpl.html', '!src/**/demos/**/*.tpl.html']
        },
        shell:{
            doxx:{
                command:'./node_modules/doxx/bin/doxx --template docs/template.jade --source src --target docs',
                stdout:true,
                stderr:true
            }
        },
        clean: ['<%= distdir %>/*'],
        jshint: {
          all: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
          options: {
            eqeqeq: true,
            globals: {
              angular: true
            },
            ignores: [
                'src/directives/ccElasticViews/hammer.js',
                'src/core/store.js',
                'test/mocks/md5.js',
                //we also need to exclude those files as they contain foreign code
                //and until jshint 1.0 there is no option to mute all warnings for a
                //block of code
                'src/core/cc.util.js',
                'src/core/cc.observable.js'
            ]
          }
        },
        html2js: {
            app: {
                options: {
                    base: '.'
                },
                src: ['<%= src.ccTemplates %>'],
                dest: '<%= distdir %>/cc.angular.templates.js',
                module: 'cc.angular.templates'
            }
        },
        concat:{
            dist:{
                src:[
                        'build.cc.intro.js',
                        '<%= src.cc %>',
                        'build.cc.outro.js'
                    ],
                dest:'<%= distdir %>/<%= ccName %>.js'
            },
            ccTests:{
                src:['<%= src.ccTests %>'],
                dest:'<%= distdir %>/<%= ccTestsName %>.js'
            },
            ccAngular:{
                src:[
                        'build.intro.js',
                        '<%= distdir %>/cc.angular.templates.js',
                        '<%= src.ccAngular %>',
                        'build.outro.js',
                    ],
                dest:'<%= distdir %>/<%= ccAngularName %>.js'
            }
        },
        qunit: {
            all: ['test/**/*.html']
        },
        watch:{
            all: {
                files:['<%= src.cc %>', '<%= src.ccAngular %>', '<%= src.ccTests %>', '<%= src.ccTemplates %>'],
                tasks:['jshint','build']
            }
        },
        script:{
            cc:{
                src: ['<%= src.cc %>', '<%= src.ccTests %>'],
                relativeTo: 'test/unit/'
            }
        }
    });

    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-html2js');

    grunt.registerTask('index-template-tests', function(){
        
        var indexPath = 'test/unit/';
        var indexContents = grunt.file.read(indexPath + 'index.tpl');
        var transformedContents = grunt.template.process(indexContents, { data: grunt.config.get('script.cc') });
        grunt.file.write(indexPath + 'index.html', transformedContents);
    });

    grunt.registerMultiTask('script', function(){
        var path = require('path');
        var relativeTo = this.data.relativeTo || '';
        var scriptTags = this.filesSrc
                             .map(function(val){ 
                                return '<script src="' + path.relative(relativeTo, val) + '"></script>'; 
                             })
                             .join('\n');

        var configProperty = this.name + '.' + this.target + '.scripts';

        grunt.config.set(configProperty, scriptTags);
    });

    // Default task(s).
    grunt.registerTask('docs', ['shell']);
    grunt.registerTask('default', ['jshint', 'build', 'watch']);
    grunt.registerTask('build', ['clean', 'html2js', 'concat', 'script', 'index-template-tests', 'qunit']);

};
