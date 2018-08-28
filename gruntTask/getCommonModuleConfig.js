var https = require('https');

function requestConfig(grunt, url, done) {
    var out = '';
    var req = https.get(url, function(res) {
        var statusCode = res.statusCode;
        if (statusCode >= 200 && statusCode < 300 || statusCode == 304) {
            res.setEncoding('utf8');
            res.on('data', function(data) {
                out += data.toString();
            });
            res.on('end', function() {
                try {
                    var config = JSON.parse(out);
                    grunt.config('commonModule', config);
                    done();
                } catch (e) {
                    throw new Error('common module parse error: ' + e);
                }
            });
        } else {
            throw new Error('can not get common module config: ' + url);
        }
    });

    req.on('error', (e) => {
        throw new Error('can not get common module config: ' + url)
    });

    req.end();
}

module.exports = function(grunt) {

    grunt.registerTask('getCommonModuleConfig', 'replace common module from product static-resource folder', function() {
        // var commonModulePath = grunt.config('config').custom.commonModulePath + '?' + new Date().getTime();
        var path = grunt.config('config').commonModulePath;
        if(!path){return;}
        var commonModulePath = path + '?' + new Date().getTime();
        var done = this.async();

        requestConfig(grunt, commonModulePath, done);
    });

    grunt.registerTask('getCommonModuleConfigLocal', 'replace common module from local static-resource folder', function() {
        var commonModulePathLocal = grunt.config('packPkg').custom.commonModulePathLocal;

        if (!grunt.file.exists(commonModulePathLocal)) {
            throw new Error('can not get common module config: ' + commonModulePathLocal);
        }

        var config = grunt.file.readJSON(commonModulePathLocal);
        grunt.config('commonModule', config);
    });

    grunt.registerTask('getCommonModuleConfigHybrid', 'replace common module from product static-resource folder', function() {
        var commonModulePathHybrid = grunt.config('packPkg').custom.commonModulePathHybrid + '?' + new Date().getTime();
        var done = this.async();

        requestConfig(grunt, commonModulePathHybrid, done);
    });

    grunt.registerTask('getCommonModuleConfigLocalHybrid', 'replace common module from local static-resource folder for hybrid', function() {
        var commonModulePathLocalHybrid = grunt.config('packPkg').custom.commonModulePathLocalHybrid;

        if (!grunt.file.exists(commonModulePathLocalHybrid)) {
            throw new Error('can not get common module config: ' + commonModulePathLocalHybrid);
        }

        var config = grunt.file.readJSON(commonModulePathLocalHybrid);
        grunt.config('commonModule', config);
    });

}
