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

    // b-cli package.json
    var packPkg = grunt.file.readJSON('./package.json');

    var projectPath = grunt.option('project');
    if (!projectPath) {
        throw new Error('project path is not found.');
    }

    var revExtend = '_';

    // var optionOfStaticDir = grunt.option('optionOfStaticDir');
    // optionOfStaticDir = optionOfStaticDir || 'CJfed';

    // var domain = grunt.option('domain');
    // var optionOfStaticEnv = domain && packPkg.env[domain] || domain || packPkg.env.pro;

    // packPkg.custom = {};
    // packPkg.custom.commonModulePath = optionOfStaticEnv + (packPkg[optionOfStaticDir] ? packPkg[optionOfStaticDir].commonModulePath : optionOfStaticDir) + packPkg.configFileName.h5;
    // packPkg.custom.commonModulePathHybrid = optionOfStaticEnv + (packPkg[optionOfStaticDir] ? packPkg[optionOfStaticDir].commonModulePath : optionOfStaticDir) + packPkg.configFileName.hybrid;
    // packPkg.custom.commonModulePathLocal = path.resolve(projectPath + '/' + (packPkg[optionOfStaticDir] ? packPkg[optionOfStaticDir].commonModulePathLocal : optionOfStaticDir)  + packPkg.configFileName.h5);
    // packPkg.custom.commonModulePathLocalHybrid = path.resolve(projectPath + '/' + (packPkg[optionOfStaticDir] ? packPkg[optionOfStaticDir].commonModulePathLocal : optionOfStaticDir) + packPkg.configFileName.hybrid);

    setCWD();
    /**
     * set current working diectory
     * 
     */
    function setCWD(){
        var basePath = projectPath + '/webapp';
        if (!grunt.file.exists(basePath)) {
            throw new Error('no project folder: ' + projectPath);
        }
        grunt.file.setBase(basePath);
    }

    
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

    function getProjectConfig(configPath){
        return grunt.file.exists(configPath) ? grunt.file.readJSON(configPath) : {};
    }

    grunt.initConfig({
        packPkg: packPkg, // 打包模块的 pkg
        pkg: grunt.file.readJSON('../package.json'), // 项目的 pkg
        router: grunt.file.read('src/router.json'),
        service: grunt.file.read('src/service.json'),
        hybridConfig: getProjectConfig('../config.hybrid.json'),
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
                src: ['dest/AirUI/**/*.js', 'dest/b-UI/**/*.js', 'dest/pages/**/*.js', 'dest/libs/**/*.js', 'dest/service/**/*.js', 'dest/module/**/*.js']
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
                        'AirUI/**',
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
                    cwd: 'src/template/fake/',
                    src: "*.html",
                    dest: 'dest/template/fake',
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
            },
            zipFiles: {
                files: [
                    {
                        expand: true,
                        cwd: '../',
                        dest: 'release/h5/',
                        src: ['*.client.zip']
                    },
                    {
                        expand: true,
                        cwd: '../',
                        dest: 'release/hybrid/',
                        src: ['*.zip', '!*.client.zip']
                    }
                ]

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
            after: ["dest/app.js", "dest/index.html"],
            release: ["release/"]
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
    
    /**
     * 合并 controller
     */
    grunt.registerTask("concatController", "concat controller", function() {
        // read all subdirectories from your modules folder
        grunt.file.expand(
            { filter: "isDirectory"},
            ["./src/pages/*", '!./src/pages/partials'])
            .forEach(function(dir) {
                
                // get page folder name form full path string
                dir = dir.match(/\/([^\/]+)$/)[1];

                // get the current concat config
                var concat = grunt.config.get('concat') || {};

                // set the config for this modulename-directory
                concat[dir] = {
                    src: [
                        './src/pages/' + dir + '/*.js'
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

    /**
     * 合并 style
     */
    grunt.registerTask("concatStyle", "concat Style", function() {
        // read all subdirectories from your modules folder
        grunt.file.expand({filter: "isDirectory"}, "./src/webresource/css/pagestyle/*")
        .forEach(function(dir) {

            dir = dir.match(/\/([^\/]+)$/)[1];

            // get the current concat config
            var concat = grunt.config.get('concat') || {};

            // set the config for this modulename-directory
            concat[dir] = {
                src: [
                    './src/webresource/css/pagestyle/' + dir + '/*.css'
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

        result += before;
        result += '\nvar routerConfig, serviceConfig;\n'
        result += 'b.ready(function() {\n';

        // 拼接路由
        result += 'routerConfig = ' + JSON.stringify(routerObj, null, 4) + ';\n';
        result += 'for (var i = 0, len = routerConfig.rules.length, router; i < len; i++) {\n' +
            'router = routerConfig.rules[i];\n' +
            'router.rule = routerConfig.baseURL + router.rule;\n' +
            'b.router.set(router);\n' +
            '}\n';

        // 拼接service
        result += 'serviceConfig = ' + service + ';\n';
        result += 'for (var i = 0, len = serviceConfig.config.length, config; i < len; i++) {\n' +
            'config = serviceConfig.config[i];\n' +
            'b.service.setConfig(config.name, config.param);\n' +
            '}\n' +
            'for (var i = 0, len = serviceConfig.services.length, service; i < len; i++) {\n' +
            'service = serviceConfig.services[i];\n' +
            'b.service.set(service.name, service.param);\n' +
            '}\n';

        result += '});\n'
        // 拼接app.js内容
        result += appContent + after;

        grunt.file.defaultEncoding = 'utf8';
        grunt.file.write(appPath, result);
    }

    grunt.registerTask('createAppJS', 'merge router, service & app.js', function() {
        createAppJS('(function(){', '})()');
    });

    /**
     * 组合 view 与 controller
     */
    grunt.registerTask('includController', 'includController', function() {
        var result = "";

        var summary = replacedSummary();

        for (var key in summary) {
            var view = key.match(/([^\/]+)\..+$/)[1];
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

    /**
     * 给模块签名
     */
    grunt.registerTask('replaceModule', 'replaceModule', function() {
        var summary = replacedSummary();
        var commonModule = getCommonModule();
        commonModule = (commonModule || {}).module || {};
        var replace = function(str, paramStr, moduleName) {
            var name = moduleName || '';
            var commonModulePath = commonModule[name];

            if (commonModulePath) {
                name = '"' + moduleName + '", "' + commonModulePath + '"';
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

        // 替换 b.Module
        grunt.file.expand({
            filter: "isFile"
        }, ["./dest/AirUI/**/*", "./dest/b-UI/**/*", "./dest/service/*", "./dest/module/**/*"]).forEach(function(file) {
            var exists = grunt.file.exists(file);
            if (exists) {
                var content = grunt.file.read(file);
                content = content.replace(/Module\((['"]\s*([^'"]+)\s*['"]),/ig, replace);
                grunt.file.write(file, content);
            }
        });

        // 替换 require
        grunt.file.expand({
            filter: "isFile"
        }, ["./dest/AirUI/**/*", "./dest/b-UI/**/*", "./dest/module/**/*", "./dest/pages/*", "./dest/pages/partials/*", "./dest/app.js"]).forEach(function(file) {
            var exists = grunt.file.exists(file);
            if (exists) {
                var content = grunt.file.read(file);
                content = content.replace(/require\((['"]\s*([^'"]+)\s*['"])\)/ig, replace);
                grunt.file.write(file, content);
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
        'replaceFakeAnchor',
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
        'replaceFakeAnchor',
        'filerev:html','createAppJS',
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
        'replaceFakeAnchorHybrid',
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
        'replaceFakeAnchorHybrid',
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

    var all = ['clean:release'].concat(build).concat(buildBefore).concat(['getCommonModuleConfigHybrid']).concat(buildHybrdTask).concat([
        'buildHybrid',
        'copy:zipFiles'
    ]);

    // 为了 build\build-debug\hybrid 读取本地环境不报错
    // if (domain == 'local' || domain == 'dev') {
    //     build = run;
    //     buildDebug = runDebug;
    //     hybrid = hybridDebug;
    // }
        
    grunt.registerTask('default', run);
    grunt.registerTask('debug', runDebug);

    grunt.registerTask('webapp', build);
    grunt.registerTask('webapp-debug', buildDebug);

    grunt.registerTask('hybrid', hybrid);
    grunt.registerTask('hybrid-debug', hybridDebug);


    grunt.registerTask('all', all);
};
