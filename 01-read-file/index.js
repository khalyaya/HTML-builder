const fs = require('node:fs');
const path = require('node:path');
const output = process.stdout;

const textPath = path.join(__dirname, 'text.txt');
const readableStream = fs.createReadStream(textPath, 'utf-8');
readableStream.pipe(output);
readableStream.on('error', (error) =>
  output.write(`An error occurred: ${error.message}`),
);
