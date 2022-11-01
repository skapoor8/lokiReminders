#!/usr/bin/env node

require = require('esm')(module /*, options*/);
const path = require('path');
const fs = require('fs');

const {Command} = require('commander');


var cli = new Command();
var configPath = path.join(process.cwd(), 'loki.json');

cli.command('new <name>')
    .action((name) => require('../scripts/new')(name));

cli.command('serve')
    .action(() => {
        checkConfig(config => {
            require('../scripts/serve')(config);
        });
    });

cli.command('build')
    .action(() => {
        checkConfig(config => {
            require('../scripts/build')(config);
        });
    });

cli.parse(process.argv);

function checkConfig(callback) {
    try {
        var config = JSON.parse(fs.readFileSync(configPath));
        callback(config);
    } catch (e) {
        console.error('No loki project found');
    }
}