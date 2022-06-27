#!/usr/bin/env node

import { mkdir, writeFile } from 'fs';
import parseArgs from 'minimist';
import { dirname as getDirName } from 'path';
import { v4 as uuid } from 'uuid';

const appVersion = uuid();

const jsonData = {
  version: appVersion,
};

const jsonContent = JSON.stringify(jsonData);

const args = parseArgs(process.argv.slice(2));

const destination = args.destination || './public/meta.json';

const filename = destination.match(/[^\\/]+$/)[0];

function writeMetaFile(path, contents, cb) {
  mkdir(getDirName(path), { recursive: true }, (err) => {
    if (err) return cb(err);
    writeFile(path, contents, cb);
  });
}

writeMetaFile(destination, jsonContent, (err) => {
  if (err) {
    console.log(`An error occured while writing JSON Object to ${filename}`);
    return console.log(err);
  }
  console.log(`${filename} file has been saved with latest version number`);
  return null;
});
