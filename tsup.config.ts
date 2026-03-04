/* eslint-disable no-param-reassign */
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    // root export "."
    index: 'src/index.ts',

    // export subpaths (match package.json "exports")
    autoplay: 'src/hoc/autoplay/index.tsx',
    captioned: 'src/hoc/captioned-images/index.tsx',
    lettering: 'src/hoc/animated-lettering/index.tsx',
    navigation: 'src/hoc/navigation/index.ts',
  },

  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: false, // you already rimraf dist
  splitting: false,
  target: 'es2018',

  external: ['react', 'react-dom', 'prop-types'],

  // keep only if you still have JSX in .js files
  esbuildOptions(options) {
    options.loader = {
      ...(options.loader || {}),
      '.js': 'jsx',
    };

    options.jsx = 'transform';
    options.jsxFactory = 'React.createElement';
    options.jsxFragment = 'React.Fragment';
  },
});
