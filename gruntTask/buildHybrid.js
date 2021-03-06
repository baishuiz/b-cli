var configPath = '../config.hybrid.json';
var PREFIX = 'hybrid-tmp';
var layoutPath = './dest/layouts/index-hybrid.html';

function getStaticConfig(config) {
  var staticConfig = '<script>var staticConfig; b.ready(function(deviceInfo){\n';
  staticConfig += 'deviceInfo = (deviceInfo || {}).result || {};\n if (deviceInfo && deviceInfo.environment) {staticConfig = fullStaticConfig[deviceInfo.environment.toLocaleLowerCase()] || ""}';
  staticConfig += ';});</script>';
  return staticConfig;
}

function getFullStaticConfig(config) {
  var staticConfig = '<script>var fullStaticConfig=' + JSON.stringify(config) + ';</script>';
  return staticConfig;
}

module.exports = function(grunt) {
  var domain = grunt.option('domain');

  grunt.registerTask('buildHybrid-layout', function(){
    var configs = grunt.config('hybridConfig');
    var commonModule = grunt.config('commonModule') || {};
    var fullStaticConfig = getFullStaticConfig(configs);
    var postfix = ifDominSameWithConfigKey(configs);

    if (!postfix) {
      var keys = Object.keys(configs);
      createLayoutFile(keys[0]);
    } else {
      createLayoutFile(postfix);
    }

    function createLayoutFile(key) {
      key = key.toLocaleLowerCase();
      var config = configs[key.toLocaleUpperCase()] || configs[key.toLocaleLowerCase()];
      var staticConfig = getStaticConfig(config);
      var layout = grunt.file.read('./' + PREFIX + '/layouts/index-hybrid.html');

      layout = layout.replace(/{{staticConfig}}/g, fullStaticConfig + staticConfig);
      layout = layout.replace(/{{\$resourceURL}}/g, config.resourceURL || '');

      layout = layout.replace(/(<script[^>]+=["'])(b\.(\d\.\d)\.js)(["'][^>]*>)/, function(str, $1, path, version){
        return '<script src="../lib/b.js"></script>';
      })

      grunt.file.write('./' + PREFIX + '/index.html', layout);
    }
  })

  function ifDominSameWithConfigKey(configs) {
    var keys = Object.keys(configs);
    if (keys.indexOf(domain.toLocaleLowerCase()) < 0 && keys.indexOf(domain.toLocaleUpperCase()) < 0) {
      return null;
    } else {
      return domain;
    }
  }

  grunt.registerTask('buildHybrid', 'build Hybrid', function() {
    var configs = grunt.config('hybridConfig');
    var cleanConfig = {};
    var cleanTaskAry = [];
    var compressConfig = {};
    var compressTaskAry = [];
    var copyConfig = {};
    var copyTaskAry = [];
    addConfig();

    function addConfig() {
      var prefixedKey = PREFIX;
      cleanConfig[prefixedKey] = [prefixedKey + '/'];

      cleanTaskAry.push('clean:' + prefixedKey);

      compressConfig[prefixedKey] = {
        options: {
          archive: '../<%= pkg.channel %>' + '.zip'
        },
        files: [
          {expand: true, cwd: prefixedKey + '/', src: ['**'], dest: ''}
        ]
      };

      compressTaskAry.push('compress:' + prefixedKey);

      copyConfig[prefixedKey] = {
        files: [{
            expand: true,
            cwd: 'dest/',
            src: '**/*',
            dest: prefixedKey + '/',
            filter: 'isFile'
        }]
      };

      copyTaskAry.push('copy:' + prefixedKey);
    }

    grunt.config.merge({
      clean: cleanConfig
    });
    grunt.config.merge({
      compress: compressConfig
    });
    grunt.config.merge({
      copy: copyConfig
    });

    grunt.task.run(cleanTaskAry);
    grunt.task.run(copyTaskAry);

    grunt.task.run(['buildHybrid-layout']);

    grunt.task.run(compressTaskAry);
    grunt.task.run(cleanTaskAry);

  });
}
