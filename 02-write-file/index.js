const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

const filePath = path.join(__dirname, 'input.txt');
const writableStream = fs.createWriteStream(filePath);

stdout.write('Enter text to write to the file:\n');

process.on('SIGINT', () => {
  console.log('\nTerminating the program due to interrupt signal');
  process.exit();
});

stdin.on('data', (data) => {
  if (data.toString().endsWith('exit\n')) {
    console.log('Terminating the program due to the keyword');
    process.exit();
  }
  writableStream.write(data);
});

writableStream.on('error', (err) => {
  console.log('Error: occurred while writing to the file:', err.message);
});
