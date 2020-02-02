const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const config = {
  entry: {
    index: ['./src/index.js'],
    autoplay: ['./src/hoc/autoplay/hoc.js'],
    captioned: ['./src/hoc/captioned-images/hoc.js'],
    lettering: ['./src/hoc/animated-lettering/hoc.js'],
    navigation: ['./src/hoc/navigation/index.js'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    libraryTarget: 'umd',
    library: 'react-awesome-slider',
    globalObject: 'this',
  },
  externals: {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
    },
    'prop-types': {
      root: 'PropTypes',
      commonjs: 'prop-types',
      commonjs2: 'prop-types',
      amd: 'prop-types',
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          keep_fnames: true,
        },
      }),
    ],
  },
};

module.exports = config;
