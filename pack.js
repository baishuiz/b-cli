#!/usr/bin/env node

var commander = require('commander');
var childProcess = require('child_process');
var cock = require('cock');
var path = require('path');
var notifier = require('node-notifier');
var pkg = require('./package.json');

const project = process.cwd();

commander.version(pkg.version, '-v, --version');
commander.command('init <projectName>')
         .description('generate the initial project structure')
         .action(function(projectName){
             cock.init(projectName);
             initProject(projectName);
         }); 
commander.command('build <platform>').action(buildApp);                          
commander.parse(process.argv);


function buildApp(platform){
    switch (platform) {
        case 'webapp':
            buildWEBApp();
            break;        
        case 'ios':
            break;
        case 'ios':
            break;            
    
        default:
            break;
    }
}

function initProject(projectName){
    childProcess.exec(
        'npm init -y', 
        {cwd: "./"+projectName}, 
        function(error, stdout, stderr) {
            if (error !== null) {
                console.error('exec error: ' + error);
                console.error('exec error: ' + path.join("./", projectName));
                console.error(stdout);
                notify(project + ': project init Failed: ' + JSON.stringify(error));
                process.exit(1);
            } else {
                notify(project + ': project init Success');
            }
        }
    );
}

function buildWEBApp(){
    const task = 'webapp';
    build(task, project);
}

function build(task, project){
    // childProcess.exec('grunt ' + task + ' --project=' + project + ' --domain=' + domain + ' --optionOfStaticDir=' + optionOfStaticDir, {
    childProcess.exec(
        'grunt ' + task + ' --project=' + project , 
        {cwd: __dirname}, 
        function(error, stdout, stderr) {
            if (error !== null) {
                console.error('exec error: ' + error);
                console.error('exec error: ' + stderr);
                console.error(stdout);
                notify(project + ': Pack Failed: ' + JSON.stringify(error));
                process.exit(1);
            } else {
                notify(project + ': Pack Success');
            }
        }
    );
}




function notify(msg) {
    notifier.notify({
        title: 'Pack',
        icon: path.join(__dirname, 'resource/icon.png'),
        message: msg
    });
}