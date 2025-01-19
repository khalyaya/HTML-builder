const fs = require('node:fs');
const path = require('node:path');
const output = process.stdout;

const pathToFolder = path.join(__dirname, 'secret-folder');

fs.readdir(pathToFolder, { withFileTypes: true }, (err, files) => {
  if (err) throw err;
  files.forEach((file) => {
    if (file.isDirectory()) return;
    const pathToFile = path.join(pathToFolder, file.name);
    fs.stat(pathToFile, (err, stats) => {
      if (err) throw err;
      let ext = path.extname(pathToFile);
      const fileName = path.basename(pathToFile, ext);
      const size = stats.size;
      const extFinal = ext.length === 0 ? null : ext.slice(1);
      output.write(`${fileName} - ${extFinal} - ${size} bytes\n`);
    });
  });
});
