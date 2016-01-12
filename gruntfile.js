'use strict';

/* global module:false */
module.exports = function(grunt) {

  require('matchdep').filterAll('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    banner: '/*!\n' +
      ' * <%= pkg.name %> v<%= pkg.version %>\n' +
      ' * <%= pkg.homepage %> \n' +
      ' *\n' +
      ' * Copyright (c) <%= grunt.template.today("yyyy") %> Daxko\n' +
      ' * <%= pkg.license %> License\n' +
      ' */\n',

    usebanner: {
      options: {
        banner: '<%= banner %>',
        replace: true,
        linebreak: false
      },
      dist: {
        files: {
          src: ['lib/analytics.js']
        }
      }
    },

    jshint: {
      options: {
        jshintrc: true
      },
      files: {
        src: ['gruntfile.js', 'lib/{,*/}*.js', '!lib/{,*/}*.min.js', 'test/{,*/}*.js']
      }
    },

    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        files: {
          'lib/analytics.min.js': ['lib/analytics.js']
        }
      }
    },

    watch: {
      scripts: {
        files: ['gruntfile.js', 'lib/{,*/}*.js', 'test/{,*/}*.js'],
        tasks: ['jshint']
      }
    }

  });

  grunt.registerTask('default', ['usebanner', 'uglify', 'jshint']);

};