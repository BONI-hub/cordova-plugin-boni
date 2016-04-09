'use strict';

//process.env.CONFIG = 'config/config.test.js';
module.exports = function(grunt) {
    grunt.registerTask('config', 'Set environment configurations.', function(env) {
        switch (env) {
            case 'local':
                grunt.option('config','config/config.local.js');
                break;
            case 'test':
                grunt.option('config','config/config.test.js');
                break;
            case 'live':
                grunt.option('config','config/config.live.js');
                break;
            default:
                console.log('Environment is not defined!');
        }
        console.log(grunt.option('config'));
    });

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
            config: {
                src: grunt.option('config'),
                dest: 'www/config.js'
            }
        }
    });


    grunt.loadNpmTasks('grunt-jasmine-node-coverage');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', 'jasmine_node');
    grunt.registerTask('local', ['config:local'], 'copy:config');
    grunt.registerTask('test', ['config:test', 'copy:config']);
    grunt.registerTask('live', ['config:live', 'copy:config']);
};
