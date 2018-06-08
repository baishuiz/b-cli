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
} else if (!['', 'default', 'debug', 'build', 'build-debug', 'hybrid', 'hybrid-debug', 'all'].includes(cmd)) {
    console.error('command "' + cmd +  '" not found');
    process.exit(1);
}

/**
 * domain 和 dir 有两种传入方式
 * 1. --domain --optionOfStaticDir
 * 2. 固定的 key
 * 
 * 优先级：先1后2
 */
var domain = '';
var optionOfStaticDir = '';
args = args.filter(function (item) {
    if (item.indexOf('--domain') >= 0) {
        domain = item.split('=')[1];
    }
    if (item.indexOf('--optionOfStaticDir') >= 0) {
        optionOfStaticDir = item.split('=')[1];
    }
    return item.indexOf('=') < 0;
});

domain = domain || args[1] || '';
optionOfStaticDir = optionOfStaticDir || args[2] || '';


childProcess.exec('grunt ' + cmd + ' --project=' + project + ' --domain=' + domain + ' --optionOfStaticDir=' + optionOfStaticDir, {
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
