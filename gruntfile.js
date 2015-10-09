'use strict';

/* global module:false */
module.exports = function(grunt) {

  require('matchdep').filterAll('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      options: {
        jshintrc: true
      },
      files: {
        src: ['gruntfile.js', 'lib/{,*/}*.js', 'test/{,*/}*.js']
      }
    },

    watch: {
      scripts: {
        files: ['gruntfile.js', 'lib/{,*/}*.js', 'test/{,*/}*.js'],
        tasks: ['jshint']
      }
    }

  });

  grunt.registerTask('default', ['jshint']);

};