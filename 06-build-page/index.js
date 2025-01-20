const fsPromises = require('node:fs/promises');
const path = require('path');
const projectPath = path.join(__dirname, 'project-dist');
const origPath = path.join(__dirname, 'assets');
const assetsPath = path.join(projectPath, 'assets');

async function buildPage() {
  try {
    await fsPromises.mkdir(projectPath, {
      recursive: true,
    });
    let projectHtml = path.join(projectPath, 'index.html');
    const componentsPath = path.join(__dirname, 'components');
    const componentFiles = await fsPromises.readdir(componentsPath, {
      withFileTypes: true,
    });
    const templatePath = path.join(__dirname, 'template.html');
    let readableTemplate = await fsPromises.readFile(templatePath, 'utf-8');
    const tagRedex = /\{\{(.*?)\}\}/g;
    const tagsArr = [...readableTemplate.matchAll(tagRedex)];
    for (const component of componentFiles) {
      const componentPath = path.join(componentsPath, component.name);
      const componentExt = path.extname(componentPath);
      const componentName = path.basename(componentPath, componentExt);
      for (const tag of tagsArr) {
        const tagText = tag[1];
        if (tagText === componentName && componentExt === '.html') {
          const componentFile = await fsPromises.readFile(
            componentPath,
            'utf-8',
          );
          readableTemplate = readableTemplate.replace(tag[0], componentFile);
          await fsPromises.writeFile(projectHtml, readableTemplate);
        }
      }
    }

    const projectStyles = path.join(projectPath, 'style.css');
    await fsPromises.rm(projectStyles, { recursive: true, force: true });
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
      await fsPromises.appendFile(projectStyles, readableFile + '\n');
    }

    await addAssets(origPath, assetsPath);
  } catch (err) {
    console.error('An error occurred:', err.message);
  }
}

async function addAssets(origPath, assetsPath) {
  try {
    await fsPromises.rm(assetsPath, { recursive: true, force: true });
    await fsPromises.mkdir(assetsPath, { recursive: true });

    const origAssets = await fsPromises.readdir(origPath, {
      withFileTypes: true,
    });

    for (const file of origAssets) {
      const origAssetPath = path.join(origPath, file.name);
      const assetFilePath = path.join(assetsPath, file.name);
      if (file.isDirectory()) {
        addAssets(origAssetPath, assetFilePath);
      } else {
        await fsPromises.copyFile(origAssetPath, assetFilePath);
      }
    }
  } catch (err) {
    console.error('An error occurred:', err.message);
  }
}

buildPage();
