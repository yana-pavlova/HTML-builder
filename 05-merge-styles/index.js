const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'project-dist');
const sourceDir = path.join(__dirname, 'styles');

const ext = '.css';

const styleFiles = [];

const createBundleFile = (dir, ext) => {
  fs.readdir(dir, (err, files) => {
    if (err) throw err;

    files.forEach((file) => {
      if (file.endsWith(ext)) {
        styleFiles.push(fs.readFileSync(path.join(dir, file)));
      }
    });

    const data = styleFiles.join('\n');

    fs.writeFile(path.join(targetDir, 'bundle.css'), data, (err) => {
      if (err) throw err;
      console.log('File created successfully');
    });
  });
};

createBundleFile(sourceDir, ext);
