const fs = require('fs');
const path = require('path');

fs.rm(
  path.resolve(__dirname, 'files-copy'),
  { recursive: true, force: true },
  (errorRm) => {
    if (errorRm) throw new Error(errorRm);

    fs.mkdir(
      path.resolve(__dirname, 'files-copy'),
      { recursive: true },
      (errorMkdir) => {
        if (errorMkdir) throw new Error(errorMkdir);
      }
    );

    fs.readdir(
      path.resolve(__dirname, 'files'),
      { withFileTypes: true },
      (errorRaeddir, files) => {
        if (errorRaeddir) throw new Error(errorRaeddir);
        files.forEach((file) => {
          if (file.isFile()) {
            let oldDirectory = path.resolve(__dirname, 'files', file.name);
            let copyDirectory = path.resolve(
              __dirname,
              'files-copy',
              file.name
            );
            fs.copyFile(oldDirectory, copyDirectory, (errorCopyFile) => {
              if (errorCopyFile) throw new Error(errorCopyFile);
            });
          }
        });
      }
    );
  }
);
