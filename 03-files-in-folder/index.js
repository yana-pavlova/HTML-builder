const path = require('path');
const fsPromises = require('node:fs/promises');

async function main() {
  try {
    const files = await fsPromises.readdir(
      path.join(__dirname, 'secret-folder'),
      { withFileTypes: true },
    );
    for (const file of files) {
      if (!file.isFile()) continue;
      const stats = await fsPromises.stat(
        path.join(__dirname, 'secret-folder', file.name),
      );
      console.log(
        file.name,
        ' - ',
        path.extname(file.name).slice(1),
        ' - ',
        Math.round(stats.size / 1024),
        'kb',
      );
    }
  } catch (err) {
    console.error('Error occurred while reading the files: ', err);
  }
}

main();
