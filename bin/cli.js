#!/usr/bin/env node

const fs = require('fs');
const uuidv4 = require('uuid/v4');
const process = require('process');
const minimist = require('minimist');

const appVersion = uuidv4();

const jsonData = {
  version: appVersion
};

const jsonContent = JSON.stringify(jsonData);

const args = minimist(process.argv.slice(2));
const filePath = args.path || './public';

fs.writeFile(
  filePath + '/meta.json',
  jsonContent,
  { flag: 'w+', encoding: 'utf8' },
  err => {
    if (err) {
      console.log('An error occured while writing JSON Object to meta.json');
      return console.log(err);
    }
    console.log('meta.json file has been saved with latest version number');
    return null;
  }
);
