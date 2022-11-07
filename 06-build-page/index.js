const fs = require('fs');
const path = require('path');
const projectDist = path.join(__dirname, 'project-dist');
const styles = path.join(__dirname, 'styles');
const assets = path.join(__dirname, 'assets');
const newAssets = path.join(projectDist, 'assets');
const templateHtml = fs.createReadStream(path.join(__dirname, 'template.html'));
const componentsHtml = path.join(__dirname, 'components');

let templateString = '';

fs.mkdir(
  projectDist,
  {
    recursive: true,
  },
  (err) => {
    if (err) throw err;
  }
);

async function copyDir(assets, newAssets) {
  await fs.promises.mkdir(
    newAssets,
    {
      recursive: true,
    },
    (err) => {
      if (err) throw err;
    }
  );

  const files = await fs.promises.readdir(assets, {
    withFileTypes: true,
  });

  files.forEach(async (file) => {
    if (file.isFile()) {
      const oldFile = path.join(assets, file.name);
      const newFile = path.join(newAssets, file.name);
      await fs.promises.copyFile(oldFile, newFile);
    } else {
      copyDir(path.join(assets, file.name), path.join(newAssets, file.name));
    }
  });
}

copyDir(assets, newAssets);

fs.readdir(styles, (err, files) => {
  const cssFiles = fs.createWriteStream(path.join(projectDist, 'style.css'));
  if (err) throw err;
  for (let i = 0; i < files.length; i++) {
    const extension = path.extname(files[i]).split('.').pop();
    if (extension === 'css') {
      const input = fs.createReadStream(path.join(styles, files[i]));
      input.on('data', (data) => {
        cssFiles.write(data.toString() + '\n');
      });
    }
  }
});

async function creteHtmlPage() {
  const htmlFile = fs.createWriteStream(path.join(projectDist, 'index.html'));
  templateHtml.on('data', (data) => {
    templateString = data.toString();
    fs.readdir(
      componentsHtml,
      {
        withFileTypes: true,
      },
      (err, files) => {
        if (err) throw err;
        files.forEach((item, i) => {
          if (item.isFile() && path.parse(item.name).ext === '.html') {
            const readComponents = fs.createReadStream(
              path.join(__dirname, 'components', item.name)
            );
            const nameComponents = path.parse(item.name).name;
            const extens = `{{${nameComponents}}}`;
            readComponents.on('data', (data) => {
              templateString = templateString.replace(extens, data.toString());
              if (i === files.length - 1) {
                htmlFile.write(templateString);
              }
            });
          }
        });
      }
    );
  });
}
creteHtmlPage();
