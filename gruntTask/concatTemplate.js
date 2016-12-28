var TAG = /<#include\s+(['"])([^'"]+)\1>/ig;
var grunt;


function dest(sourceContent, destPath){
  grunt.file.write(destPath, sourceContent);
}

function eachPageView(){
  var FILTER = {filter: "isDirectory"};
  var URL    = "./src/template/pageview/*";
  grunt.file.expand(FILTER, URL).forEach(function(dir) {
      var replacedContents = concatView(dir);
      buildPageView(dir, replacedContents);
  });
}

function concatView(dir){
      dir = dir.match(/\/([^\/]+)$/)[1];
      var PATH = [
                  './src/template/pageview/' + dir + '/*',
                  "!./src/template/pageview/**/_layout.html"
                 ];
      var CWD = './src/template/';
      var result = [];
      grunt.file.expand(PATH).forEach(function(file){
        var activeFile = grunt.file.read(file);
        var replacedContent = activeFile.replace(TAG, function(includeTag, $1, path){
            return grunt.file.read(CWD + path)
        });
        result.push(replacedContent);
        result[file] = replacedContent;
      });
      return result;
}

function buildPageView(dir, replacedContents){

      dir = dir.match(/\/([^\/]+)$/)[1];
      var pageLayoutPath = './src/template/pageview/' + dir + '/_layout.html'
      var result ='';
        var destPath = './dest/template/' + dir + '.html'
      if( grunt.file.exists(pageLayoutPath) ){
        var pageLayoutContent = grunt.file.read(pageLayoutPath);
        var pageLayoutContent = pageLayoutContent.replace(TAG, function(includeTag, $1, path){
            var filePath = './src/template/pageview/' + path;
            // return grunt.file.read(filePath);
            return replacedContents[filePath];

        });
        dest(pageLayoutContent, destPath);
      } else {
        dest(replacedContents.join(''), destPath);
      }
}

module.exports = function(_grunt) {
    grunt = _grunt;
    grunt.registerTask("concatTemplate", "concat template", function() {
      eachPageView()
    });
}
