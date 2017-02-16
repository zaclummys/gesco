module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        meta: {
            banner: '/* <%= pkg.name %> v<%= pkg.version %> | (c) <%= grunt.template.today("yyyy") %> by Isaac Ferreira */\n'
        },

        clean: {
            dist: 'dist/**'
        },

        uglify: {
            target: {
                files: {
                    'dist/gesco.min.js': ['dist/gesco.js']
                }
            }
        },

        package2bower: {
            all: {
                fields: [
                    'name',
                    'description',
                    'version',
                    'homepage',
                    'license',
                    'keywords'
                ]
            }
        },

        usebanner: {
            all: {
                options: {
                    banner: '<%= meta.banner %>',
                    linebreak: false
                },
                files: {
                    src: ['dist/*.js']
                }
            }
        },

        watch: {
            build: {
                files: ['src/*.js'],
                tasks: ['build']
            },
        },

        webpack: require('./webpack.config.js')
    });

    grunt.registerMultiTask('package2bower', 'Sync package.json to bower.json', function () {
        var npm = grunt.file.readJSON('package.json');
        var bower = grunt.file.readJSON('bower.json');
        var fields = this.data.fields || [];

        for (var i=0, l=fields.length; i<l; i++) {
            var field = fields[i];
            bower[field] = npm[field];
        }

        grunt.file.write('bower.json', JSON.stringify(bower, null, 2));
    });

    grunt.registerTask('build', 'build', ['clean', 'webpack', 'uglify', 'usebanner', 'package2bower']);
};
