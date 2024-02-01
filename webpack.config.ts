import path from 'path';
import webpack, { Configuration } from 'webpack';

const config: Configuration = {
  mode: 'development',
  entry: {
    mdm: './src/mdm.index.ts',
  },
  devtool: 'eval-cheap-module-source-map',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        // https://webpack.js.org/guides/asset-modules/#source-assets
        type: 'asset/source',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  target: 'web',
  node: {
    __dirname: false,
  },
  externals: {
    // lodash: '_',
    // jquery: '$',
  },
  plugins: [
    new webpack.BannerPlugin({
      banner(data) {
        if (data.chunk.name === 'mdm') {
          const text = `
            // ==UserScript==
            // @name         MDM: Card Text Highlight
            // @namespace    https://github.com/toancaro/userscripts
            // @homepageURL  https://github.com/toancaro/userscripts
            // @source       https://github.com/toancaro/userscripts
            // @version      1.4
            // @description  Add highlight colors to card text.
            // @author       toancaro
            // @match        https://*.masterduelmeta.com/*
            // @icon         https://www.google.com/s2/favicons?sz=64&domain=masterduelmeta.com
            // @grant        GM.addStyle
            // @grant        GM.notification
            // @grant        GM.registerMenuCommand
            // @grant        unsafeWindow
            // @run-at       document-idle
            // @supportURL   https://github.com/toancaro/userscripts/issues
            // @updateURL    https://raw.githubusercontent.com/toancaro/userscripts/main/lib/mdm.js
            // @downloadURL  https://raw.githubusercontent.com/toancaro/userscripts/main/lib/mdm.js
            // @changelogURL https://github.com/toancaro/userscripts/releases/tag/v1.4
            // ==/UserScript==
          `;

          // @require      https://code.jquery.com/jquery-3.7.1.slim.min.js#sha256-kmHvs0B+OpCW5GVHUNjv9rOmY0IvSIRcf7zGUDTDQM8=
          // @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js#sha512-WFN04846sdKMIP5LKNphMaWzU7YpMyCU245etK3g/2ARYbPK9Ub18eG+ljU96qKRCWh+quCY7yefSmlkQw1ANQ==

          return text
            .trim()
            .split('\n')
            .map((line) => line.trim())
            .join('\n');
        }

        return '';
      },
    }),
  ],
};

export default config;
