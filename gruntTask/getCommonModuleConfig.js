var https = require('https');

module.exports = function(grunt) {


    grunt.registerTask('getCommonModuleConfig', 'replace common module from static-resource folder', function() {
        var commonModulePath = grunt.config('packPkg').custom.commonModulePath + '?' + new Date().getTime();

        var done = this.async();
        var out = '';
        var req = https.get(commonModulePath, function(res) {
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
                    } catch(e) {
                        throw new Error('common module parse error: ' + out);
                    }
                });
            } else {
                throw new Error('can not get common module config');
            }
        });

        req.on('error', (e) => {
            throw new Error('can not get common module config')
        });

        req.end();
    });
}
