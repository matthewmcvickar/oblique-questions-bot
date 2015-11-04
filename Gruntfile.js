'use strict';

module.exports = function(grunt) {

  grunt.initConfig({

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      app: {
        src: ['js/*.js', '*.js']
      }
    },

    watch: {
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: ['jshint:gruntfile']
      },
      app: {
        files: 'index.js',
        tasks: ['jshint:app']
      }
    },

    notify_hooks: {
      options: {
        enabled: true,
        max_jshint_notifications: 5
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-notify');

  // Default task.
  grunt.registerTask(
    'default',
    [
      'jshint',
      'watch'
    ]
  );

};
