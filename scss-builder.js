import fs from 'fs';
import path from 'path';
import shell from 'shelljs';

const THEMES = path.resolve(__dirname, 'src/styled');
const THEMES_PATH = './dist/custom-animations';
const THEMES_ARG = 'AWESOME_THEME';

fs.readdir(THEMES, (err, files) => {
  files.forEach(file => {
    if (file.match(/-animation/gi)) {
      shell.exec(
        `${THEMES_ARG}=${file} webpack --mode production --config webpack.animations.config.js`
      );
      shell.exec(`rm ${THEMES_PATH}/${file}.js`);
    }
  });
});
