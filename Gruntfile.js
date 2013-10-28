'use_strict';

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
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
              "dist/simple-table.min.css": "src/less/simple-table.less"
            }
          }
        },
        ngtemplates:  {
            crmApp:      {
                src:      'src/**/*.html',
                dest:     'avro-table-tmpl.js'
                //options:  {
                  //url:    function(url) { return url.replace('client', ''); }
                //}
            }
        },
        uglify: {
            options: {
                mangle: true,
                compress: true
            },
            dist: {
                files: {
                    'dist/simple-table.min.js': [
                        'src/js/**/*.js'
                    ]
                }
            }
        },
        watch: {
            dev: {
              files: ['src/**/*'],
              tasks: ['default'],
              options: {
                livereload: 9090,
              },
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');

    grunt.registerTask('default', ['jshint', 'uglify', 'less']);
};
