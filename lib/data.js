// Dependecies
const fs = require('fs');
const path = require('path');

const lib = {};

// Base directory of the data
lib.baseDir = path.join(__dirname, '/.././.data/');

lib.create = function (dir, file, data, callback) {
  // Open a file for writting
  const url = lib.baseDir + dir + '/' + file + '.json';

  //   Open the file
  fs.open(url, 'wx', (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      //    Convert data to String
      const stringData = JSON.stringify(data);
      //   Write file and close the file
      fs.writeFile(fileDescriptor, stringData, (err) => {
        if (!err) {
          fs.close(fileDescriptor, (err) => {
            if (!err) {
              callback(false);
            } else {
              callback('Error closing file');
            }
          });
        } else {
          callback('Error writting to file');
        }
      });
    } else {
      callback('Could not create a new file ,may be it already exit', err);
    }
  });
};

//Read data from a file
lib.read = function (dir, file, callback) {
  const url = lib.baseDir + dir + '/' + file + '.json';
  fs.readFile(url, 'utf-8', (err, data) => {
    if (!err && data) {
      const parsedData = JSON.parse(data);
      callback(false, data);
    } else {
      callback(err, data);
    }
  });
};

module.exports = lib;
