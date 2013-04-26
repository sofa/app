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
            ccAngular: ['src/services/**/*.js', 'src/directives/**/*.js']
        },
        shell:{
            doxx:{
                command:'./node_modules/doxx/bin/doxx --template docs/template.jade --source src --target docs',
                stdout:true,
                stderr:true
            }
        },
        clean: ['<%= distdir %>/*'],
        concat:{
            dist:{
                src:['<%= src.cc %>'],
                dest:'<%= distdir %>/<%= ccName %>.js'
            },
            ccTests:{
                src:['<%= src.ccTests %>'],
                dest:'<%= distdir %>/<%= ccTestsName %>.js'
            },
            ccAngular:{
                src:['<%= src.ccAngular %>'],
                dest:'<%= distdir %>/<%= ccAngularName %>.js'
            }
            //,
            // index: {
            //     src: ['src/index.html'],
            //     dest: '<%= distdir %>/index.html',
            //     options: {
            //         process: true
            //     }
            // },
            // angular: {
            //     src:['vendor/angular/angular.js'],
            //     dest: '<%= distdir %>/angular.js'
            // },
            // mongo: {
            //     src:['vendor/mongolab/*.js'],
            //     dest: '<%= distdir %>/mongolab.js'
            // },
            // bootstrap: {
            //     src:['vendor/angular-ui/bootstrap/*.js'],
            //     dest: '<%= distdir %>/bootstrap.js'
            // },
            // jquery: {
            //     src:['vendor/jquery/*.js'],
            //     dest: '<%= distdir %>/jquery.js'
            // }
        },
        qunit: {
            all: ['test/**/*.html']
        },
        watch:{
            all: {
                files:['<%= src.cc %>', '<%= src.ccAngular %>', '<%= src.ccTests %>'],
                tasks:['build']
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


    // Default task(s).
    grunt.registerTask('default', ['shell']);
    grunt.registerTask('build', ['clean','concat', 'qunit']);

};
