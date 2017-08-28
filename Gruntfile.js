var jsonminify = require('jsonminify');
var path = require('path');

module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-filerev');
    grunt.loadNpmTasks('grunt-filerev-assets');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-includes');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadTasks('./gruntTask');

    var packPkg = grunt.file.readJSON('./package.json');

    var projectPath = grunt.option('project');
    if (!projectPath) {
        throw new Error('project empty');
    }

    var optionOfStaticDir = grunt.option('optionOfStaticDir');
    optionOfStaticDir = optionOfStaticDir || 'CJfed';

    var domain = grunt.option('domain');
    var optionOfStaticEnv = domain && packPkg.env[domain] || packPkg.env.pro;

    packPkg.custom = {};
    packPkg.custom.commonModulePathLocal = path.resolve(projectPath + '/' + packPkg[optionOfStaticDir].commonModulePathLocal);
    packPkg.custom.commonModulePathLocalHybrid = path.resolve(projectPath + '/' + packPkg[optionOfStaticDir].commonModulePathLocalHybrid);
    packPkg.custom.commonModulePath = optionOfStaticEnv + packPkg[optionOfStaticDir].commonModulePath;
    packPkg.custom.commonModulePathHybrid = optionOfStaticEnv + packPkg[optionOfStaticDir].commonModulePathHybrid;

    console.log(packPkg.custom.commonModulePathLocal);

    var basePath = projectPath + '/webapp';
    if (!grunt.file.exists(basePath)) {
        throw new Error('no project folder: ' + projectPath);
    }
    grunt.file.setBase(basePath);

    var revExtend = '_';
    var replacedSummary = function() {
        var summaryOrigin = grunt.filerev && grunt.filerev.summary || {};
        var summary = {};
        for (var key in summaryOrigin) {
            summary[key.replace(/\\/g, '/')] = summaryOrigin[key].replace(/\\/g, '/');
        }
        return summary;
    };

    var getCommonModule = function() {
        return grunt.config('commonModule') || {};
    };

    var hybridConfigPath = '../config.hybrid.json';
    var filerevConfigOptions = {
        algorithm: 'md5',
        length: 8,
        process: function(basename, name, extension) {
            return basename + revExtend + name + '.' + extension;
        }
    };
    var filerevConfigHybridOptions = {
        algorithm: 'md5',
        length: 8,
        process: function(basename, name, extension) {
            return basename + '.' + extension;
        }
    };
    grunt.initConfig({
        packPkg: packPkg, // 打包模块的 pkg
        pkg: grunt.file.readJSON('../package.json'), // 项目的 pkg
        router: grunt.file.read('src/router.json'),
        service: grunt.file.read('src/service.json'),
        hybridConfig: grunt.file.exists(hybridConfigPath) ? grunt.file.readJSON(hybridConfigPath) : {},
        output: {
            fileName: '<%= pkg.name %>.<%= pkg.version %>.js',
            minFileName: '<%= pkg.name %>.<%= pkg.version %>.js'
        },

        filerev: {
            html: {
                options: filerevConfigOptions,
                src: 'dest/template/**/*.html'
            },
            'html-hybrid': {
                options: filerevConfigHybridOptions,
                src: 'dest/template/**/*.html'
            },
            js: {
                options: filerevConfigOptions,
                src: ['dest/b-UI/**/*.js', 'dest/pages/**/*.js', 'dest/libs/**/*.js', 'dest/service/**/*.js', 'dest/module/**/*.js']
            },
            'js-hybrid': {
                options: filerevConfigHybridOptions,
                src: ['dest/b-UI/**/*.js', 'dest/pages/**/*.js', 'dest/libs/**/*.js', 'dest/service/**/*.js', 'dest/module/**/*.js']
            },
            css: {
                options: filerevConfigOptions,
                src: 'dest/webresource/css/*.css'
            },
            'css-hybrid': {
                options: filerevConfigHybridOptions,
                src: 'dest/webresource/css/*.css'
            },
            img: {
                options: filerevConfigOptions,
                src: 'dest/webresource/image/**/*'
            },
            'img-hybrid': {
                options: filerevConfigHybridOptions,
                src: 'dest/webresource/image/**/*'
            }
        },

        copy: {
            main: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    dest: 'dest/',
                    src: [
                        'libs/**',
                        'module/**',
                        'b-UI/**'
                    ]
                }, {
                    expand: true,
                    cwd: 'src/',
                    src: ["*.html", "*.txt"],
                    dest: 'dest'
                }, {
                    expand: true,
                    cwd: 'src/',
                    src: "app.js",
                    dest: 'dest'
                }, {
                    expand: true,
                    cwd: 'src/template/',
                    src: "*.html",
                    dest: 'dest/template',
                    filter: 'isFile'
                }, {
                    expand: true,
                    cwd: 'src/template/partials/',
                    src: "*.html",
                    dest: 'dest/template/partials',
                    filter: 'isFile'
                }, {
                    expand: true,
                    cwd: 'src/webresource/css/',
                    src: "*.css",
                    dest: 'dest/webresource/css',
                    filter: 'isFile'
                }, {
                    expand: true,
                    cwd: 'src/webresource/image/',
                    src: "**/*",
                    dest: 'dest/webresource/image',
                    filter: 'isFile'
                }, {
                    expand: true,
                    cwd: 'src/pages/',
                    src: "*.js",
                    dest: 'dest/pages',
                    filter: 'isFile'
                }, {
                    expand: true,
                    cwd: 'src/pages/partials/',
                    src: "*.js",
                    dest: 'dest/pages/partials',
                    filter: 'isFile'
                }, {
                    expand: true,
                    cwd: 'src/service/',
                    src: "*.js",
                    dest: 'dest/service',
                    filter: 'isFile'
                }, {
                    expand: true,
                    cwd: 'src/module/',
                    src: "**/*",
                    dest: 'dest/module',
                    filter: 'isFile'
                }]
            },
            originSource: {
                files: [{
                    expand: true,
                    cwd: 'src/webresource/',
                    src: ['image/**/*', 'fonts/**/*'],
                    dest: 'dest/webresource/',
                    filter: 'isFile'
                }]
            }
        },

        filerev_assets: {
            dist: {
                options: {
                    dest: 'assets/assets.json',
                    cwd: '/',
                    prettyPrint: true,
                    prefix: ''
                }
            }
        },

        clean: {
            dest: ["dest/"],
            after: ["dest/app.js", "dest/index.html"]
        },

        uglify: {
            options: {
                mangle: {
                    except: ['require']
                }
            },
            mini: {
                files: [{
                    expand: true,
                    cwd: 'dest',
                    src: '**/*.js',
                    dest: 'dest/'
                }]
            }
        },

        cssmin: {
            mini: {
                options: {
                    advanced: false,
                    keepSpecialComments: 0,
                    processImport: false
                },
                files: [{
                    expand: true,
                    cwd: 'dest/',
                    src: ['**/*.css', '!*.min.css'],
                    dest: 'dest/',
                    ext: '.css'
                }]
            }
        },

        htmlmin: {
            options: {
                collapseWhitespace: true,
                conservativeCollapse: true,
                removeComments: true,
                minifyJS: true,
                ignoreCustomFragments: [/{{.*?}}/, /<#include.*?>/]
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'dest',
                    src: '**/*.html',
                    dest: 'dest/'
                }]
            },
            layouts: {
                files: [{
                    expand: true,
                    cwd: 'dest/layouts/',
                    src: '**/*.html',
                    dest: 'dest/layouts/'
                }]
            }
        },

        compress: {
            zipweb: {
                options: {
                    archive: '../<%= pkg.name %>.zip'
                },
                files: [
                    { expand: true, cwd: '../', src: ['**', '!node_modules/**', '!mock/**', '!.*', '!*.zip', '!gruntTask/**'], dest: '' }
                ]
            }
        }

    });

    grunt.registerTask("concatController", "your description", function() {
        // read all subdirectories from your modules folder
        grunt.file.expand({
            filter: "isDirectory"
        }, ["./src/pages/*", '!./src/pages/partials']).forEach(function(dir) {
            dir = dir.match(/\/([^\/]+)$/)[1];
            // get the current concat config
            var concat = grunt.config.get('concat') || {};
            // set the config for this modulename-directory
            concat[dir] = {
                src: [
                    './src/pages/' + dir + '/*.js'
                    //  '!/modules/' + dir + '/js/compiled.js'
                ],

                dest: './dest/pages/' + dir + '.js'
            };
            // save the new concat configuration
            grunt.config.set('concat', concat);
        });
        // when finished run the concatinations
        if (grunt.config.get('concat')) {
            grunt.task.run('concat');
        }
    });

    grunt.registerTask("concatStyle", "your description", function() {
        // read all subdirectories from your modules folder
        grunt.file.expand({
            filter: "isDirectory"
        }, "./src/webresource/css/pagestyle/*").forEach(function(dir) {
            dir = dir.match(/\/([^\/]+)$/)[1];
            // get the current concat config
            var concat = grunt.config.get('concat') || {};
            // set the config for this modulename-directory
            concat[dir] = {
                src: [
                    './src/webresource/css/pagestyle/' + dir + '/*.css'
                    //  '!/modules/' + dir + '/js/compiled.js'
                ],

                dest: './dest/webresource/css/' + dir + '.css'
            };
            // save the new concat configuration
            grunt.config.set('concat', concat);
        });
        // when finished run the concatinations
        if (grunt.config.get('concat')) {
            grunt.task.run('concat');
        }
    });

    function createAppJS(before, after) {
        var map = {};
        var router = grunt.config('router');
        var service = grunt.config('service');
        var appPath = 'dest/app.js';
        var appContent = grunt.file.read(appPath);
        var result = '';
        var summary = replacedSummary();

        // 获取路由sign
        for (var key in summary) {
            var view = key.match(/([^\/]+)\..+$/)[1];
            var hash = summary[key].match(/([^\/._]+)\.[^.]+$/)[1];
            if (hash === view) {
                hash = '';
            }
            map[view] = hash;
        }

        // 路由中拼接sign
        var routerObj = JSON.parse(jsonminify(router));
        for (var routerIndex = 0; routerIndex < routerObj.rules.length; routerIndex++) {
            var activeRouter = routerObj.rules[routerIndex];
            activeRouter.sign = map[activeRouter.viewName];
        }

        // 拼接路由
        result += before + '\n var routerConfig = ' + JSON.stringify(routerObj, null, 4) + ';\n';
        result += 'for (var i = 0, len = routerConfig.rules.length, router; i < len; i++) {\n' +
            'router = routerConfig.rules[i];\n' +
            'router.rule = routerConfig.baseURL + router.rule;\n' +
            'b.router.set(router);\n' +
            '}\n';

        // 拼接service
        result += 'var serviceConfig = ' + service + ';\n';
        result += 'for (var i = 0, len = serviceConfig.config.length, config; i < len; i++) {\n' +
            'config = serviceConfig.config[i];\n' +
            'b.service.setConfig(config.name, config.param);\n' +
            '}\n' +
            'for (var i = 0, len = serviceConfig.services.length, service; i < len; i++) {\n' +
            'service = serviceConfig.services[i];\n' +
            'b.service.set(service.name, service.param);\n' +
            '}\n';

        // 拼接app.js内容
        result += appContent + after;

        grunt.file.defaultEncoding = 'utf8';
        grunt.file.write(appPath, result);
    }

    grunt.registerTask('createAppJS', 'merge router, service & app.js', function() {
        createAppJS('(function(){', '})()');
    });

    grunt.registerTask('includController', 'includController', function() {
        var result = "";

        var summary = replacedSummary()

        for (var key in summary) {
            var view = key.match(/([^\/]+)\..+$/)[1]
            var hash = summary[key].match(/([^\/._]+)\.[^.]+$/)[1];
            if (hash === view) {
                hash = '';
            }

            grunt.file.defaultEncoding = 'utf8';
            var filePath = "pages/" + view + (hash ? (revExtend + hash) : "") + ".js";
            var viewPath = "dest/template/" + view + ".html";
            if (grunt.file.exists(viewPath)) {
                var viewContent = grunt.file.read(viewPath);
                result += '<script type="text/javascript" src="{{$resourceURL}}' + filePath + '"></script>' + viewContent;
                grunt.file.write(viewPath, result);
            }
            result = "";
        }

    });

    grunt.registerTask('replaceModule', 'replaceModule', function() {
        var summary = replacedSummary();
        var commonModule = getCommonModule();
        commonModule = (commonModule || {}).module || {};
        var replace = function(str, paramStr, curName) {
            var name = curName || '';
            var commonModulePath = commonModule[name];

            if (commonModulePath) {
                name = '"' + curName + '", "' + commonModulePath + '"';
            } else {
                name = name.replace(/\./g, '/');
                name = 'dest/' + name + '.js';
                name = summary[name];

                if (name) {
                    name = name.replace(/^dest\//, '').replace(/\.js$/, '').replace(/\//g, '.');
                    name = '"' + name + '"';
                }
            }

            if (name) {
                return str.replace(paramStr, name);
            } else {
                return str;
            }
        }

        grunt.file.expand({
            filter: "isFile"
        }, ["./dest/b-UI/**/*", "./dest/service/*", "./dest/module/**/*"]).forEach(function(dir) {
            var exists = grunt.file.exists(dir);
            if (exists) {
                var content = grunt.file.read(dir);
                content = content.replace(/Module\((['"]\s*([^'"]+)\s*['"]),/ig, replace);
                grunt.file.write(dir, content);
            }
        });

        grunt.file.expand({
            filter: "isFile"
        }, ["./dest/b-UI/**/*", "./dest/module/**/*", "./dest/pages/*", "./dest/pages/partials/*", "./dest/app.js"]).forEach(function(dir) {
            var exists = grunt.file.exists(dir);
            if (exists) {
                var content = grunt.file.read(dir);
                content = content.replace(/require\((['"]\s*([^'"]+)\s*['"])\)/ig, replace);
                grunt.file.write(dir, content);
            }
        });

    });

    // 将link标签替换为css源码
    grunt.registerTask('replaceStyle', 'replaceStyle', function() {
        var replaceStyleTage = function(dir) {
            if (grunt.file.exists(dir)) {
                var fileContent = grunt.file.read(dir);
                var matched = fileContent.match(/(<link[^>]+=["'])(\S+.css)(["'][^>]*>)/g);
                matched && matched.forEach(function(styleTag) {
                    var path = styleTag.match(/(<link[^>]+=["'])(\S+.css)(["'][^>]*>)/);
                    if (path && path[2]) {
                        var stylePath = path && path[2] || '';
                        var cssName = stylePath.match(/\/([^\/]+).css$/)[1] || '';

                        if (cssName) {
                            grunt.file.expand({
                                filter: "isFile"
                            }, "./dest/webresource/css/*.css").forEach(function(cssDir) {
                                var destCssName = cssDir.match(/\/([^\/]+)$/)[1];
                                var reg = new RegExp('^' + cssName + '(' +revExtend + '\\S+)?\\.css')
                                if (destCssName.match(reg)) {
                                    stylePath = stylePath.replace(cssName + '.css', destCssName);
                                    stylePath = stylePath.replace(/{{.*?}}/ig, '');
                                    stylePath = './dest/' + stylePath;

                                    var styleContent = grunt.file.exists(stylePath) ? grunt.file.read(stylePath) : '';
                                    if (styleContent) {
                                        fileContent = fileContent.replace(path[0], '<style>' + styleContent + '</style>')
                                    }
                                }
                            });
                        }
                    }
                });
                grunt.file.write(dir, fileContent);
            }
        }

        grunt.file.expand({
            filter: "isFile"
        }, "./dest/template/*.html").forEach(function(dir) {
            replaceStyleTage(dir);
        });

        grunt.file.expand({
            filter: "isFile"
        }, "./dest/index.html").forEach(function(dir) {
            replaceStyleTage(dir);
        });

    });

    grunt.registerTask('replaceImage', 'replaceImage', function() {
        var summary = replacedSummary();
        var replaceImageTag = function(dir, isHtmlFile) {
            var imgReg = null;
            var imgRegG = null;
            if (isHtmlFile) {
                imgRegG = /=["']{1}[^http]\S+(\/image\/\S+)["']{1}/g;
                imgReg = /=["']{1}[^http]\S+(\/image\/\S+)["']{1}/;
            } else {
                imgRegG = /url\(["']*[^http]\S+(\/image\/\S+)["']*\)/g;
                imgReg = /url\(["']*[^http]\S+(\/image\/\S+)["']*\)/;
            }

            var fileContent = grunt.file.exists(dir) ? grunt.file.read(dir) : '';
            var matched = fileContent.match(imgRegG);
            matched && matched.forEach(function(bgStr) {
                var fileName = bgStr.match(imgReg) || [];
                fileName = fileName[1] || '';
                if (fileName) {
                    var destFileName = summary['dest/webresource' + fileName];
                    if (destFileName) {
                        destFileName = destFileName.replace('dest/webresource', '');
                        var destBgStr = bgStr.replace(fileName, destFileName);
                        fileContent = fileContent.replace(bgStr, destBgStr);
                        grunt.file.write(dir, fileContent);
                    }
                }
            });
        }

        grunt.file.expand({
            filter: "isFile"
        }, "./dest/webresource/css/*.css").forEach(function(dir) {
            replaceImageTag(dir);
        });

        grunt.file.expand({
            filter: "isFile"
        }, "./dest/template/*.html").forEach(function(dir) {
            replaceImageTag(dir, true);
        });

    });

    grunt.registerTask('generateLayout', 'generateLayout', function() {
        var indexPath = 'dest/index.html';
        var appPath = 'dest/app.js';
        var summary = replacedSummary();

        var indexContent = grunt.file.read(indexPath);
        var appContent = grunt.file.read(appPath);
        var webContent = replacedContent('web', indexContent);
        var hybridContent = replacedContent('hybrid', indexContent);

        function replacedContent(type, indexContent) {
            var bMap = getCommonModule();
            bMap = bMap && bMap.b || {}
            bMap = bMap[type] || {};

            var matchedScript = indexContent.match(/(<script[^>]+=["'])(\S+.js)(["'][^>]*>)/g);
            matchedScript && matchedScript.forEach(function(scriptTag) {
                var path = scriptTag.match(/(<script[^>]+=["'])(\S+.js)(["'][^>]*>)/) || [];
                path = path[2] && path[2].replace(/{{\S+}}/, '') || '';
                if (path) {
                    var destPath;
                    var matchedPath = path.match(/b\.(\d\.\d)\.js/);
                    var version = matchedPath && matchedPath[1];

                    if (version) {
                        var url = bMap[version];
                        destPath = url || destPath;
                    } else {
                        if (!path.match(/^(http|\/\/)/)) {
                            destPath = 'dest/';
                            destPath += path;
                            destPath = summary[destPath];
                            destPath = destPath.replace('dest/', '');
                        }
                    }

                    if (destPath) {
                        var destScriptTag = scriptTag.replace(path, destPath);
                        indexContent = indexContent.replace(scriptTag, destScriptTag);
                    }
                }
            });

            indexContent = indexContent.replace('</body>', '<script>' + appContent + '</script></body>');
            return indexContent;
        }

        grunt.file.write('dest/layouts/index-web.html', webContent);
        grunt.file.write('dest/layouts/index-hybrid.html', hybridContent);
    });

    var buildBefore = ['clean:dest', 'copy:main'];

    // 在filerev前先将文件压缩（uglify, cssmin, htmlmin）以保证各操作系统下算出的签名一致
    // TODO，Controller处理存在问题。
    //     A requerequire B，当B改变，A不变时，B的sign变了
    //     但是由于先进行了filerev:js，导致A的sign没变
    var buildWebTask = [
        'uglify', 'filerev:js',
        'concatController',
        'includePartial', 'concatTemplate', 'concatStyle',
        'replaceModule', 'includController',
        'filerev:img', 'replaceImage',
        'cssmin',
        'filerev:css', 'replaceStyle',
        'htmlmin:dist',
        'filerev:html', 'createAppJS',
        'generateLayout',
        'htmlmin:layouts',
        'copy:originSource', // TODO：临时方案，保留图片源文件，避免JS中调用图片出错
        'clean:after'
    ];
    var buildWebDebugTask = [
        'concatController',
        'filerev:js',
        'includePartial', 'concatTemplate', 'concatStyle',
        'replaceModule', 'includController',
        'filerev:img', 'replaceImage',
        'filerev:css', 'replaceStyle',
        'filerev:html', 'createAppJS',
        'generateLayout',
        'copy:originSource', // TODO：临时方案，保留图片源文件，避免JS中调用图片出错
        'clean:after'
    ];

    // 运行时，使用本地公用模块
    var run = buildBefore.concat(['getCommonModuleConfigLocal']).concat(buildWebTask);
    var runDebug = buildBefore.concat(['getCommonModuleConfigLocal']).concat(buildWebDebugTask);

    //  打包时，使用远程公用模块
    var build = buildBefore.concat(['getCommonModuleConfig']).concat(buildWebTask).concat(['compress:zipweb']);
    var buildDebug = buildBefore.concat(['getCommonModuleConfig']).concat(buildWebDebugTask).concat(['compress:zipweb']);


    var buildHybrdTask = [
        'uglify', 'filerev:js-hybrid',
        'concatController',
        'includePartial', 'concatTemplate', 'concatStyle',
        'replaceModule', 'includController',
        'filerev:img-hybrid', 'replaceImage',
        'cssmin',
        'filerev:css-hybrid', 'replaceStyle',
        'htmlmin:dist',
        'filerev:html-hybrid', 'createAppJS',
        'generateLayout',
        'htmlmin:layouts',
        'copy:originSource', // TODO：临时方案，保留图片源文件，避免JS中调用图片出错
        'clean:after'
    ];
    var buildHybrdDebugTask = [
        'concatController',
        'filerev:js-hybrid',
        'includePartial', 'concatTemplate', 'concatStyle',
        'replaceModule', 'includController',
        'filerev:img-hybrid', 'replaceImage',
        'filerev:css-hybrid', 'replaceStyle',
        'filerev:html-hybrid', 'createAppJS',
        'generateLayout',
        'copy:originSource', // TODO：临时方案，保留图片源文件，避免JS中调用图片出错
        'clean:after'
    ];

    var hybrid = buildBefore.concat(['getCommonModuleConfigHybrid']).concat(buildHybrdTask).concat([
        'buildHybrid',
        'clean:dest'
    ]);
    var hybridDebug = buildBefore.concat(['getCommonModuleConfigLocalHybrid']).concat(buildHybrdDebugTask).concat([
        'buildHybrid',
        'clean:dest'
    ]);

    grunt.registerTask('default', run);
    grunt.registerTask('debug', runDebug);

    grunt.registerTask('build', build);
    grunt.registerTask('build-debug', buildDebug);

    grunt.registerTask('hybrid', hybrid);
    grunt.registerTask('hybrid-debug', hybridDebug);
};
