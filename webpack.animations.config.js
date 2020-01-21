const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

const THEME = process.env.AWESOME_THEME;

module.exports = {
  entry: {
    styles: [path.resolve(__dirname, `src/styled/${THEME}/index.js`)],
  },
  output: {
    path: path.resolve(__dirname, 'dist/custom-animations'),
    filename: `${THEME}.js`,
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.scss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.css$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader?importLoaders=1!postcss-loader',
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `${THEME}.css`,
    }),
  ],
};
