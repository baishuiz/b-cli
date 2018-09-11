var TAG = /<#include\s+(['"])([^'"]+)\1>/ig;
var grunt;
var revExtend = '_';
var replacedSummary = function() {
    var summaryOrigin = grunt.filerev && grunt.filerev.summary || {};
    var summary = {};
    for (var key in summaryOrigin) {
        summary[key.replace(/\\/g, '/')] = summaryOrigin[key].replace(/\\/g, '/');
    }
    return summary;
};

function dest(sourceContent, destPath){
  grunt.file.write(destPath, sourceContent);
}

function eachPageView(){
  var FILTER = {filter: "isFile"};
  var URL    = "./dest/template/*.html";
  grunt.file.expand(FILTER, URL).forEach(function(dir) {
    // console.log(dir)
      var replacedContents = concatView(dir);
      buildPageView(dir, replacedContents);
  });
}

function concatView(dir){
      var CWD = './dest/template/';
      var result = [];
      var activeFile = grunt.file.read(dir);
      var parentViewName = dir.match(/\/([\w-]*).html$/);
      parentViewName = parentViewName && parentViewName[1] || '';
      var replacedContent = activeFile.replace(TAG, function(includeTag, $1, path){
          var partialContent = grunt.file.read(CWD + path);
          if (parentViewName) {
            partialContent = partialContent.replace(/(<view\s+.*?name\s*=\s*)(['"])(\S*)\2([^>]*>)/g, function(element, left, marks, name, right){
              return left+marks+ name + marks + ' b-scope-key=' + marks + parentViewName + '_' + name + marks + right;
            })
          }
          return includeController(partialContent, path);
      });
      result.push(replacedContent);
      result[dir] = replacedContent;
      return result;
}

function includeController(content, path) {

  //a.match(/([^\\]+)\..+$/)
  // var map  = {};
  var router = grunt.config("router");
  var result = "";

  var jsFilePath = 'pages/' + path.replace(/\.html$/, '');

  var summary = replacedSummary();

  for (var key in summary) {
      var view = key.match(/([^\/]+)\..+$/)[1]
      var hash = summary[key].match(/([^\/._]+)\.[^.]+$/)[1];
      // map[view] = hash;

      grunt.file.defaultEncoding = 'utf8';
      if (key.indexOf(jsFilePath) !== -1) {
        var filePath = jsFilePath + revExtend + hash + ".js";
        var script = '<script type="text/javascript" src="{{$resourceURL}}' + filePath + '"></script>';
        content = script + content;
      }
  }

  return content;
}

function buildPageView(dir, replacedContents){
      dest(replacedContents.join(''), dir);
}

module.exports = function(_grunt) {
    grunt = _grunt;
    grunt.registerTask("includePartial", "include partial", function() {
      eachPageView()
    });
}