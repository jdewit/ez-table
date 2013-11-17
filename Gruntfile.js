'use_strict';

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    bump: {
      options: {
        files: ['package.json', 'bower.json'],
        updateConfigs: [],
        commit: true,
        commitMessage: 'Release v%VERSION%',
        commitFiles: ['package.json', 'bower.json'],
        pushTo: 'master',
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true
        },
      },
      src: {
        options: {
          node: true,
          globals: {
            it: true,
            beforeEach: true,
            expect: true,
            element: true,
            browser: true,
            module: true,
            spyOn: true,
            inject: true,
            repeater: true,
            describe: true,
            angular: true,
            jQuery: true
          }
        },
        files: {
          src: ['src/**/*.js', 'spec/**/*.js']
        },
      }
    },
    less: {
      dist: {
        options: {
          yuicompress: true
        },
        files: {
          "dist/ez-table.min.css": "src/less/ez-table.less"
        }
      }
    },
    uglify: {
      options: {
        mangle: true,
        compress: true
      },
      dist: {
        files: {
          'dist/ez-table.min.js': ['src/js/**/*.js']
        }
      }
    },
    watch: {
      dev: {
        files: ['src/**/*'],
        tasks: ['default'],
        options: {
          livereload: 9090,
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-angular-templates');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-bump');

  grunt.registerTask('default', ['jshint', 'uglify', 'less']);
};
