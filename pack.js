#!/usr/bin/env node

var childProcess = require('child_process');
var path = require('path');
var notifier = require('node-notifier');
var pkg = require('./package.json');

var args = process.argv.slice(2);

var cmd = args[0] || 'default';
var project = process.cwd();

// TODO 命令，help
if (cmd === '-v' || cmd === '--version' || cmd === '--versions') {
    console.log(pkg.version);
    process.exit(1);
} else if (!['', 'default', 'debug', 'build', 'build-debug', 'hybrid', 'hybrid-debug'].includes(cmd)) {
    console.error('command "' + cmd +  '" not found');
    process.exit(1);
}

childProcess.exec('grunt ' + cmd + ' --project=' + project, {
    cwd: __dirname
}, function(error, stdout, stderr) {
    if (error !== null) {
        console.error('exec error: ' + error);
        console.error(stdout);
        notify(project + ': Pack Failed: ' + JSON.stringify(error));
        process.exit(1);
    } else {
        notify(project + ': Pack Success');
    }
});

function notify(msg) {
    notifier.notify({
        title: 'Pack',
        icon: path.join(__dirname, 'resource/cjia.png'),
        message: msg
    });
}
