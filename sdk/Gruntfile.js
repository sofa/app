module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        shell:{
            doxx:{
                command:'./node_modules/doxx/bin/doxx --template docs/template.jade --source src --target docs',
                stdout:true,
                stderr:true
            }
        }
    });

    grunt.loadNpmTasks('grunt-shell');

    // Default task(s).
    grunt.registerTask('default', ['shell']);

};
