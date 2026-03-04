/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
// scripts/build-animations.mjs
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const styledDir = path.join(root, 'src', 'styled');
const outDir = path.join(root, 'dist', 'custom-animations');

if (!fs.existsSync(styledDir) || !fs.statSync(styledDir).isDirectory()) {
  console.log('[build:animations] src/styled not found; skipping.');
  process.exit(0);
}

fs.mkdirSync(outDir, { recursive: true });

const sassBin = path.join(
  root,
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'sass.cmd' : 'sass'
);

const themes = fs
  .readdirSync(styledDir)
  .filter((name) => {
    const full = path.join(styledDir, name);
    return fs.statSync(full).isDirectory() && /-animation/i.test(name);
  })
  .sort();

if (themes.length === 0) {
  console.log(
    '[build:animations] No *-animation folders found in src/styled; skipping.'
  );
  process.exit(0);
}

for (const theme of themes) {
  const themeDir = path.join(styledDir, theme);

  // Prefer <theme>/<theme>.scss (matches repo convention)
  let inFile = path.join(themeDir, `${theme}.scss`);
  if (!fs.existsSync(inFile)) {
    // fallback: first non-partial scss in the folder
    const scss = fs
      .readdirSync(themeDir)
      .filter((f) => f.endsWith('.scss') && !f.startsWith('_'))
      .sort()[0];
    if (!scss) {
      console.log(`[build:animations] No .scss found for ${theme}; skipping.`);
      continue;
    }
    inFile = path.join(themeDir, scss);
  }

  const outFile = path.join(outDir, `${theme}.css`);

  execFileSync(
    sassBin,
    [
      '--no-source-map',
      '--style=compressed',
      '--silence-deprecation=import',
      inFile,
      outFile,
    ],
    { stdio: 'inherit' }
  );
}

console.log(`[build:animations] Built ${themes.length} animation css file(s).`);
