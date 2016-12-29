var childProcess = require('child_process');
var path = require('path');
var notifier = require('node-notifier');

var args = process.argv.slice(2);

var cmd = args[0];
var project = args[1]
console.log('pack', cmd, project);

if (!cmd || !project) {
    throw new Error('cmd error' + JSON.stringify(args));
}

childProcess.exec('grunt ' + cmd + ' --project=' + project, {
    cwd: '../pack/'
}, function(error) {
    if (error !== null) {
        console.log('exec error: ' + error);
        notify('Pack Failed: ' + JSON.stringify(error));
        process.exit(1);
    } else {
        notify('Pack Success');
    }
});

function notify(msg) {
    notifier.notify({
        title: 'Pack',
        icon: path.join(__dirname, 'resource/cjia.png'),
        message: msg
    });
}
