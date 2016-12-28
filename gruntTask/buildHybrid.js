var grunt;
var configPath = '../config.hybrid.json';
var PREFIX = 'hybrid-tmp-';
var layoutPath = './hybrid/layouts/index-hybrid.html';

function getStaticConfig(config) {
  var staticConfig = '<script>var staticConfig=' + JSON.stringify(config) + ';</script>';
  return staticConfig;
}

module.exports = function(grunt) {

  grunt.registerTask('buildHybrid-layout', function(){
    var configs = grunt.config('hybridConfig');
    for (var key in configs) {
      var config = configs[key];
      var staticConfig = getStaticConfig(config);
      var layout = grunt.file.read('./' + PREFIX + key + '/layouts/index-hybrid.html');

      layout = layout.replace(/{{staticConfig}}/g, staticConfig);
      layout = layout.replace(/{{\$resourceURL}}/g, config.resourceURL || '');

      var libMatchedAry = layout.match(/(<script[^>]+=["'])(\S+.js)(["'][^>]*>)/) || [];
      var curLibPath = libMatchedAry && libMatchedAry[2];
      if (curLibPath) {
        layout = layout.replace(new RegExp(curLibPath, 'g'), '../libs/b.min.js');
      }

      grunt.file.write('./' + PREFIX + key + '/index.html', layout);
    }
  })

  grunt.registerTask('buildHybrid', 'build Hybrid', function() {
    var configs = grunt.config('hybridConfig');
    var cleanConfig = {};
    var cleanTaskAry = [];
    var compressConfig = {};
    var compressTaskAry = [];
    var copyConfig = {};
    var copyTaskAry = [];

    for (var key in configs) {
      var prefixedKey = PREFIX + key;

      cleanConfig[prefixedKey] = [prefixedKey + '/'];

      cleanTaskAry.push('clean:' + prefixedKey);

      compressConfig[prefixedKey] = {
        options: {
          archive: '../<%= pkg.name %>-' + key + '.zip'
        },
        files: [
          {expand: true, cwd: prefixedKey + '/', src: ['**'], dest: ''}
        ]
      };

      compressTaskAry.push('compress:' + prefixedKey);

      copyConfig[prefixedKey] = {
        files: [{
            expand: true,
            cwd: 'hybrid/',
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
