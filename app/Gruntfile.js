
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // uglify: {
    //   options: {
    //     banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
    //   },
    //   build: {
    //     src: 'modules/<%= pkg.name %>.js',
    //     dest: 'build/<%= pkg.name %>.min.js'
    //   }
    // },
    sass: {
      dev: {
        options: {
          // nested (default), compact, compressed, or expanded.
          style: 'expanded'
        },
        files: {
          'css/app.css': 'scss/app.scss'
        }
      }
    },
    watch: {
      sass: {
        files: [
                  'scss/**/*.scss',
                  'modules/**/*.scss',
                  '../sdk/**/*.scss'
               ],
        tasks: ['sass']
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
    }
  });

  grunt.registerTask('default', ['sass']);

  //grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-connect');

};
