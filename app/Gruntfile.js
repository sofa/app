
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    distdir: 'dist',
    templateFile: '<%= distdir %>/templates/templates.js',
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
    clean: ['<%= distdir %>/*'],
    concat:{
      js:{
          src:['modules/**/*.js', '<%= templateFile %>'],
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
          'css/app.css': 'scss/app.scss'
        }
      }
    },
    copy: {
      all: {
        files: [
          {src: ['css/**/*'], dest: 'dist/'},
          {src: ['lib/**/*'], dest: 'dist/'},
          {src: ['data/**/*'], dest: 'dist/'},
          {expand: true, cwd: '../sdk/dist', src: ['cc.js'], dest: 'dist/lib'},
          {expand: true, cwd: '../sdk/dist', src: ['cc.angular.js'], dest: 'dist/lib'}
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
    }
  });

  grunt.registerTask('default', ['build', 'watch']);

  grunt.registerTask('build', ['clean', 'html2js', 'concat', 'sass', 'copy']);

  //grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-connect');

};
