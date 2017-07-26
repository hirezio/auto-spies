import { webpackConfig } from './webpack.config';

export default function (config:any) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    frameworks: ['jasmine-given', 'jasmine'],

    preprocessors: {
      './test.ts': ['webpack', 'sourcemap']
    },

    mime: {
      'text/x-typescript': ['ts', 'tsx']
    },

    // list of files / patterns to load in the browser
    files: [
      { pattern: './test.ts', watched: false }
    ],

    exclude: [
    ],

    webpack: webpackConfig,
    webpackMiddleware: {
      stats: 'errors-only'
    },
    

    reporters: ['progress'],

    port: 9876,

    colors: true,

    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    autoWatch: false,

    browsers: ['Chrome'],

    singleRun: true,

    concurrency: Infinity
  })
}
