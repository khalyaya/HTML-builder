const fs = require('node:fs');
const path = require('node:path');
const { stdout, stdin, exit } = process;

const textPath = path.join(__dirname, 'output.txt');
const writableStream = fs.createWriteStream(textPath, 'utf-8');

stdout.write('Hello, my dear friend!\nEnter your text:\n');
process.on('SIGINT', () => {
  endProgram();
});

stdin.on('data', (data) => {
  const string = data.toString();
  if (string.toLowerCase().trim() === 'exit') {
    endProgram();
  } else {
    writableStream.write(string);
  }
});

function endProgram() {
  writableStream.end();
  process.on('exit', () =>
    stdout.write('\nBye! Thanks for checking this task!\n'),
  );
  exit();
}

writableStream.on('error', (error) =>
  stdout.write(`An error occurred: ${error.message}`),
);
