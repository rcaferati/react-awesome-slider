const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

const config = {
  entry: {
    'react-awesome-slider-server': ['./demo/demo.js'],
  },
  output: {
    path: path.resolve(__dirname, 'demo/public/website'),
    filename: '[name].js',
    libraryTarget: 'umd',
    library: 'react-awesome-slider',
    globalObject: 'this',
  },
  resolve: {
    alias: {
      components: path.resolve(__dirname, 'demo/components/'),
      examples: path.resolve(__dirname, 'demo/examples'),
      helpers: path.resolve(__dirname, 'demo/helpers'),
      context: path.resolve(__dirname, 'demo/context'),
      src: path.resolve(__dirname, 'src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['es2015', 'react', 'stage-0'],
          plugins: ['transform-react-remove-prop-types'],
        },
      },
      {
        test: /\.scss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[local]--[hash:base64:4]',
            },
          },
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
      filename: 'react-awesome-slider.css',
    }),
  ],
};

module.exports = config;
