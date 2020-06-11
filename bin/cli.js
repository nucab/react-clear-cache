#!/usr/bin/env node

const fs = require('fs');
const uuidv4 = require('uuid/v4');

const appVersion = uuidv4();

const jsonData = {
  version: appVersion
};

const jsonContent = JSON.stringify(jsonData);

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
