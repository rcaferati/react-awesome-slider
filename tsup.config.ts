/* eslint-disable no-param-reassign */
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    // root export "."
    index: 'src/index.ts',

    // optional (but recommended) JS export for cssModule consumers:
    // import theme from '@rcaferati/react-awesome-slider/styles'
    styles: 'src/styles.ts',

    // export subpaths (match package.json "exports")
    autoplay: 'src/hoc/autoplay/index.tsx',
    captioned: 'src/hoc/captioned-images/index.tsx',
    lettering: 'src/hoc/animated-lettering/index.tsx',
    navigation: 'src/hoc/navigation/index.ts',

    // if you want to export the new hoc too, add it here (and in package.json exports):
    // adaptiveControls: 'src/hoc/adaptive-controls/index.ts',
  },

  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: false, // keep false because you already clean dist in npm scripts
  splitting: false,
  target: 'es2018',

  // peers external
  external: ['react', 'react-dom', 'prop-types'],

  // Only keep this if you still have JSX inside `.js` files.
  // If you migrated them to `.ts/.tsx`, you can remove `esbuildOptions` entirely.
  esbuildOptions(options) {
    options.loader = {
      ...(options.loader || {}),
      '.js': 'jsx',
    };

    // Classic transform (compatible with your setup)
    options.jsx = 'transform';
    options.jsxFactory = 'React.createElement';
    options.jsxFragment = 'React.Fragment';
  },
});
