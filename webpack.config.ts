import * as webpack from 'webpack';

import { resolve } from 'path';

export function getWebpackConfig(forTest: boolean = false): webpack.Configuration {
  return {
    devtool: 'inline-source-map',
    entry: './src/index.ts',
    output: {
      filename: 'jasmine-auto-spies.js',
      path: resolve('./dist')
    },
    resolve: {
      extensions: ['.ts', '.js']
    },
    module: {
      rules: [
        {
          test: /\.ts/,
          use: [
            {
              loader: 'awesome-typescript-loader',
              options: {
                declaration: false,
                configFileName: forTest ? 'tsconfig.spec.json' : 'tsconfig.json'
              }
            }
          ]
        },
        {
          test: /\.(js|ts)$/,
          loader: 'istanbul-instrumenter-loader',
          options: { esModules: true },
          enforce: 'post',
          exclude: [/\.(e2e|spec)\.ts$/, /node_modules/, /fake-classes-to-test.ts/]
        }
      ]
    },
    plugins: [
      new webpack.SourceMapDevToolPlugin({
        filename: null, // if no value is provided the sourcemap is inlined
        test: /\.(ts|js)($|\?)/i // process .js and .ts files only
      })
    ]
  };
}

export default getWebpackConfig();
