// ./storybook/main.ts
import type { StorybookConfig } from '@storybook/react-webpack5';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],

  addons: [
    '@storybook/addon-webpack5-compiler-swc',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    {
      name: '@storybook/addon-styling-webpack',
      options: {
        rules: [
          // CSS Modules (.module.css)
          {
            test: /\.module\.css$/i,
            use: [
              'style-loader',
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 1,
                  modules: {
                    auto: true,
                    localIdentName: '[name]__[local]--[hash:base64:5]',
                  },
                },
              },
              'postcss-loader',
            ],
          },

          // Global CSS (NOT modules)
          {
            test: /\.css$/i,
            exclude: /\.module\.css$/i,
            use: [
              'style-loader',
              {
                loader: 'css-loader',
                options: { importLoaders: 1, modules: false },
              },
              'postcss-loader',
            ],
          },

          // SCSS Modules (.module.scss / .module.sass)
          {
            test: /\.module\.s[ac]ss$/i,
            use: [
              'style-loader',
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 2,
                  modules: {
                    auto: true,
                    localIdentName: '[name]__[local]--[hash:base64:5]',
                  },
                },
              },
              'postcss-loader',
              {
                loader: 'sass-loader',
                options: {
                  implementation: require('sass'),
                  sourceMap: true,
                },
              },
            ],
          },

          // Global SCSS (NOT modules)  ✅ this is what your slider needs
          {
            test: /\.s[ac]ss$/i,
            exclude: /\.module\.s[ac]ss$/i,
            use: [
              'style-loader',
              {
                loader: 'css-loader',
                options: { importLoaders: 2, modules: false },
              },
              'postcss-loader',
              {
                loader: 'sass-loader',
                options: {
                  implementation: require('sass'),
                  sourceMap: true,
                },
              },
            ],
          },
        ],
      },
    },
  ],

  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
};

export default config;
