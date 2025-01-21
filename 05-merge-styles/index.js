const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'project-dist');
const sourceDir = path.join(__dirname, 'styles');

const ext = '.css';

const createBundleFile = (dir, ext) => {
  fs.readdir(dir, (err, files) => {
    if (err) throw err;

    const styleFiles = files.filter((file) => file.endsWith(ext));

    const readPromises = styleFiles.map((file) => {
      return new Promise((resolve, reject) => {
        fs.readFile(path.join(dir, file), 'utf-8', (err, data) => {
          if (err) return reject(err);
          resolve(data);
        });
      });
    });

    Promise.all(readPromises)
      .then((contents) => {
        const data = contents.join('\n');
        fs.writeFile(path.join(targetDir, 'bundle.css'), data, (err) => {
          if (err) throw err;
          console.log('File created successfully');
        });
      })
      .catch((err) => {
        console.error('Error reading files:', err);
      });
  });
};

createBundleFile(sourceDir, ext);
