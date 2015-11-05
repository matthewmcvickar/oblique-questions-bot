'use strict';

module.exports = function(grunt) {

  grunt.initConfig({

    jshint: {
      files: {
        src: ['bot.js', 'build-corpus.js', 'Gruntfile.js']
      },
      options: {
        eqeqeq:  true,
        forin:   true,
        latedef: true,
        undef:   true,
        unused:  true,
        strict:  true,
        eqnull:  true,
        node:    true
      }
    },

    jscs: {
      files: {
        src: ['bot.js', 'build-corpus.js', 'Gruntfile.js']
      },
      options: {
        requireCapitalizedConstructors: true,
        requireCurlyBraces:             true,
        requireDotNotation:             true,
        requireParenthesesAroundIIFE:   true,
        disallowEmptyBlocks:            true,
        disallowMixedSpacesAndTabs:     true,
        validateIndentation:            2,
        validateQuoteMarks:             '\''
      }
    },

    watch: {
      javascript: {
        files: ['**/*.js'],
        tasks: ['jshint', 'jscs']
      }
    },

    notify_hooks: {
      options: {
        enabled:                          true,
        max_jshint_notifications: 5
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-notify');

  // Default task.
  grunt.registerTask(
    'default',
    [
      'jshint',
      'jscs',
      'watch'
    ]
  );

};
