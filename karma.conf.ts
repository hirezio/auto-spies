import { webpackConfig } from './webpack.config';

export default function(config: any) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    frameworks: ['jasmine-given', 'jasmine'],

    plugins: [
      require('karma-jasmine'),
      require('karma-sourcemap-loader'),
      require('karma-chrome-launcher'),
      require('karma-typescript'),
      require('karma-webpack'),
      require('karma-jasmine-given'),
      require('karma-coverage-istanbul-reporter'),
    ],

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

    coverageIstanbulReporter: {
      reports: ['html', 'lcovonly', 'text-summary'],

      // base output directory. If you include %browser% in the path it will be replaced with the karma browser name
      dir: require('path').join(__dirname, 'coverage'),

      // if using webpack and pre-loaders, work around webpack breaking the source path
      fixWebpackSourcePaths: true,

      // enforce percentage thresholds
      // anything under these percentages will cause karma to fail with an exit code of 1 if not running in watch mode
      thresholds: {
        emitWarning: false, // set to `true` to not fail the test command when thresholds are not met
        // thresholds for all files
        global: {
          statements: 90,
          lines: 90,
          branches: 90,
          functions: 90
        },
        // thresholds per file
        each: {
          statements: 90,
          lines: 90,
          branches: 90,
          functions: 90,
          // overrides: {
          //   'baz/component/**/*.js': {
          //     statements: 98
          //   }
          // }
        }
      }
    },

    reporters: ['progress', 'coverage-istanbul'],

    port: 9876,

    colors: true,

    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    autoWatch: false,

    browsers: ['Chrome'],

    singleRun: true,

    concurrency: Infinity,
  });
}
