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

const CLASS_SELECTOR_RE = /\.(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)/g;

function extractCssModuleMap(css) {
  const map = {};
  CLASS_SELECTOR_RE.lastIndex = 0;
  let match = CLASS_SELECTOR_RE.exec(css);

  while (match) {
    const className = match[1];
    if (!Object.prototype.hasOwnProperty.call(map, className)) {
      map[className] = className;
    }
    match = CLASS_SELECTOR_RE.exec(css);
  }

  return map;
}

function writeAnimationModuleFiles(themeName, cssMap) {
  const esmFile = path.join(outDir, `${themeName}.mjs`);
  const cjsFile = path.join(outDir, `${themeName}.js`);
  const dtsFile = path.join(outDir, `${themeName}.d.ts`);
  const dmtsFile = path.join(outDir, `${themeName}.d.mts`);

  const cssMapJson = JSON.stringify(cssMap, null, 2);
  const esmContents = `const Styles = ${cssMapJson};\n\nexport default Styles;\n`;
  const cjsContents = `'use strict';\n\nconst Styles = ${cssMapJson};\n\nmodule.exports = Styles;\nmodule.exports.default = Styles;\n`;
  const dtsContents =
    "declare const Styles: { readonly [key: string]: string };\n\nexport default Styles;\n";

  fs.writeFileSync(esmFile, esmContents, 'utf8');
  fs.writeFileSync(cjsFile, cjsContents, 'utf8');
  fs.writeFileSync(dtsFile, dtsContents, 'utf8');
  fs.writeFileSync(dmtsFile, dtsContents, 'utf8');
}

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

  const css = fs.readFileSync(outFile, 'utf8');
  const cssMap = extractCssModuleMap(css);
  writeAnimationModuleFiles(theme, cssMap);
}

console.log(
  `[build:animations] Built ${themes.length} animation style(s) with css + module wrappers.`
);
