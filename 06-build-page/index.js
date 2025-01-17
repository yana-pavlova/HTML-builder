const path = require('path');
const fs = require('fs').promises;

const targetFolder = path.join(__dirname, 'project-dist');
const templateFile = path.join(__dirname, 'template.html');
const componentsDir = path.join(__dirname, 'components');
const stylesDir = path.join(__dirname, 'styles');
const assetsDir = path.join(__dirname, 'assets');
const targetHtmlFile = path.join(targetFolder, 'index.html');
const targetCssFile = path.join(targetFolder, 'style.css');
const targetAssetsDir = path.join(targetFolder, 'assets');

const tagRegExp = /\{\{[a-zA-Z0-9]+\}\}/g;

async function createFolder(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function readFile(filePath) {
  return fs.readFile(filePath, 'utf8');
}

async function writeFile(filePath, content) {
  await fs.writeFile(filePath, content);
}

async function copyDirectory(srcDir, destDir) {
  await createFolder(destDir);
  const entries = await fs.readdir(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else if (entry.isFile()) {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function buildHtml() {
  let template = await readFile(templateFile);

  const tags = template.match(tagRegExp) || [];
  for (const tag of tags) {
    const componentName = tag.slice(2, -2);
    const componentFile = path.join(componentsDir, `${componentName}.html`);

    try {
      const componentContent = await readFile(componentFile);
      template = template.replace(tag, componentContent);
    } catch (error) {
      console.error(`Ошибка: компонент "${componentName}" не найден.`);
    }
  }

  await writeFile(targetHtmlFile, template);
}

async function buildCss() {
  const files = await fs.readdir(stylesDir, { withFileTypes: true });
  const cssFiles = files.filter(
    (file) => file.isFile() && path.extname(file.name) === '.css',
  );

  let combinedStyles = '';
  for (const cssFile of cssFiles) {
    const cssPath = path.join(stylesDir, cssFile.name);
    const cssContent = await readFile(cssPath);
    combinedStyles += cssContent + '\n';
  }

  await writeFile(targetCssFile, combinedStyles);
}

async function buildPage() {
  try {
    await createFolder(targetFolder);
    await Promise.all([
      buildHtml(),
      buildCss(),
      copyDirectory(assetsDir, targetAssetsDir),
    ]);
    console.log('Сборка завершена.');
  } catch (error) {
    console.error('Ошибка сборки:', error);
  }
}

buildPage();
