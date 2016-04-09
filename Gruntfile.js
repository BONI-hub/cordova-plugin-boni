'use strict';

//process.env.CONFIG = 'config/config.test.js';
module.exports = function(grunt) {

    grunt.initConfig({
        jasmine_node: {
            task_name: {
                options: {
                    coverage: {
                        excludes: ['**/lib/**', '**/spec/**']
                    },
                    forceExit: true,
                    match: '.',
                    matchAll: false,
                    specFolders: ['spec'],
                    extensions: 'js',
                    specNameMatcher: 'spec',
                    captureExceptions: true,
                    junitreport: {
                        report: true,
                        savePath: './build/reports/jasmine/',
                        useDotNotation: true,
                        consolidate: true
                    }
                },
                src: ['**/*.js']
            }
        },

        copy: {
            local: {
                src: 'config/config.local.js',
                dest: 'www/config.js'
            },
            test: {
                src: 'config/config.test.js',
                dest: 'www/config.js'
            },
            live: {
                src: 'config/config.live.js',
                dest: 'www/config.js'
            }
        }
    });


    grunt.loadNpmTasks('grunt-jasmine-node-coverage');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', 'jasmine_node');
    grunt.registerTask('local', ['copy:local']);
    grunt.registerTask('test', ['copy:test']);
    grunt.registerTask('live', ['copy:live']);
};
