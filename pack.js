#!/usr/bin/env node

var commander = require('commander');
var childProcess = require('child_process');
var cock = require('cock');
var path = require('path');
var notifier = require('node-notifier');
var pkg = require('./package.json');

commander.version(pkg.version, '-v, --version')
commander.command('init <projectName>')
         .action(function(projectName){
             cock.init(projectName);
         });         
commander.parse(process.argv);
