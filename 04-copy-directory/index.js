const fsPromises = require('node:fs/promises');
const path = require('node:path');

async function copyDir() {
  const origPath = path.join(__dirname, 'files');
  const copyPath = path.join(__dirname, 'files-copy');
  try {
    await fsPromises.rm(copyPath, { recursive: true, force: true });
    await fsPromises.mkdir(copyPath, { recursive: true });

    const origFiles = await fsPromises.readdir(origPath, {
      withFileTypes: true,
    });

    for (const file of origFiles) {
      const origFilePath = path.join(origPath, file.name);
      const copyFilePath = path.join(copyPath, file.name);
      await fsPromises.copyFile(origFilePath, copyFilePath);
    }
  } catch (err) {
    console.error('An error occurred:', err.message);
  }
}

copyDir();
