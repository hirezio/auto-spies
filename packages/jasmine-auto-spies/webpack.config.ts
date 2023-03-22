// eslint-disable-next-line @typescript-eslint/no-var-requires
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
import * as webpack from 'webpack';

export function getWebpackConfig(forTest: boolean = false): webpack.Configuration {
  return {
    // devtool: 'inline-source-map',
    resolve: {
      extensions: ['.ts', '.js'],
      plugins: [new TsconfigPathsPlugin({ configFile: '../../tsconfig.json' })],
    },
    module: {
      rules: [
        {
          test: /\.ts/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                configFile: forTest ? 'tsconfig.spec.json' : 'tsconfig.json',
                projectReferences: true,
              },
            },
          ],
        },
        {
          test: /\.(js|ts)$/,
          use: [
            '@ephesoft/webpack.istanbul.loader',
            {
              loader: 'ts-loader',
              options: {
                configFile: forTest ? 'tsconfig.spec.json' : 'tsconfig.json',
                projectReferences: true,
                transpileOnly: true,
              },
            },
          ],
          exclude: [
            /\.(e2e|spec)\.ts$/,
            /node_modules/,
            /dist/,
            /fake-classes-to-test.ts/,
            /angular-provider-helper.ts/,
            /error-handler.ts/,
            /args-map.ts/,
            /create-observable-with-values.ts/,
          ],
        },
      ],
    },
    plugins: [
      new webpack.SourceMapDevToolPlugin({
        filename: null, // if no value is provided the sourcemap is inlined
        test: /\.(ts|js)($|\?)/i, // process .js and .ts files only
      }),
    ],
  };
}

export default getWebpackConfig();
