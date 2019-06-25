#!/usr/bin/env node

// Grab provided args.
// const [, , ...args] = process.argv;

// Print hello world provided args.
// console.log(`Hello world ${args}`);

const fs = require('fs');
const path = require('path');
const uuidv4 = require('uuid/v4');

const appVersion = uuidv4();

const jsonData = {
  version: appVersion
};

const jsonContent = JSON.stringify(jsonData);

console.log(path.resolve(__dirname));

fs.writeFile(
  './public/meta.json',
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
