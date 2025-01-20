const fsPromises = require('node:fs/promises');
const path = require('path');

async function bundleFiles() {
  try {
    const bundlePath = path.join(__dirname, 'project-dist');
    const bundleFile = path.join(bundlePath, 'bundle.css');
    await fsPromises.rm(bundleFile, { recursive: true, force: true });
    const stylePath = path.join(__dirname, 'styles');
    const styleFiles = await fsPromises.readdir(stylePath, {
      withFileTypes: true,
    });
    const validCssFiles = styleFiles.filter(
      (file) => path.extname(file.name) === '.css',
    );
    for (const file of validCssFiles) {
      const origStylePath = path.join(stylePath, file.name);
      const readableFile = await fsPromises.readFile(origStylePath, 'utf-8');
      const bundleStylePath = path.join(bundleFile);
      await fsPromises.appendFile(bundleStylePath, readableFile + '\n');
    }
  } catch (err) {
    console.error('An error occurred:', err.message);
  }
}
bundleFiles();
