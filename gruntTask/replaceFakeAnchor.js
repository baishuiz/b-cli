var TAG = /<#fake\s+(['"])([^'"]+)\1>/ig;
var grunt;

function getFile(isHybrid){
  var URL    = "./dest/index.html";

  if(!grunt.file.exists(URL)){
    return ;
  }
  var activeFile = grunt.file.read(URL);
    
  if (isHybrid) {
    var replacedContent = (activeFile + '').replace(TAG, function(includeTag, $1, path){
        var CWD = "./dest/template/";
        return grunt.file.read(CWD + path);
    });

    grunt.file.write(URL, replacedContent);
  } else {
    var replacedContent = (activeFile + '').replace(TAG, '');

    grunt.file.write(URL, replacedContent);
  }
}

module.exports = function(_grunt) {
    grunt = _grunt;

    grunt.registerTask("replaceFakeAnchorHybrid", "hybrid replace fake anchor in index.html", function() {
      getFile(true)
    });

    grunt.registerTask("replaceFakeAnchor", "h5 replace fake anchor in index.html", function() {
      getFile(false)
    });
}