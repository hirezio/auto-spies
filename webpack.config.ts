import * as webpack from 'webpack';

import { resolve } from 'path';

export const webpackConfig: webpack.Configuration = {
  
  devtool: 'inline-source-map',
  entry: './src/index.ts',
  output: {
    filename: 'jasmine-async-spies.js',
    path: resolve('./dist')
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts/,
        use: [{
          loader: 'awesome-typescript-loader',
          options: {
            declaration: false
          }
        }]
      }
    ]
  },
  plugins: [
    new webpack.SourceMapDevToolPlugin({
      filename: null, // if no value is provided the sourcemap is inlined
      test: /\.(ts|js)($|\?)/i // process .js and .ts files only
    })
  ]
}

export default webpackConfig;