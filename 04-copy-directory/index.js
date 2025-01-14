const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, 'files');
const targetDir = path.join(__dirname, 'files-copy');

function clearDirectoryIfExists(directory, callback) {
  fs.access(directory, fs.constants.F_OK, (err) => {
    if (!err) {
      fs.rm(directory, { recursive: true, force: true }, (err) => {
        if (err) return callback(err);
        console.log('Target directory cleared and recreated.');
        fs.mkdir(directory, { recursive: true }, callback);
      });
    } else {
      console.log('Target directory created.');
      fs.mkdir(directory, { recursive: true }, callback);
    }
  });
}

function copyDirectory(source, target) {
  clearDirectoryIfExists(target, (err) => {
    if (err) throw err;

    fs.readdir(source, (err, files) => {
      if (err) throw err;

      files.forEach((file) => {
        const sourceFilePath = path.join(source, file);
        const targetFilePath = path.join(target, file);

        fs.copyFile(sourceFilePath, targetFilePath, (err) => {
          if (err) throw err;
          console.log(`${file} copied successfully`);
        });
      });
    });
  });
}

copyDirectory(sourceDir, targetDir);
