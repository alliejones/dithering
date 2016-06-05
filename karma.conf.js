module.exports = function (config) {
  config.set({
    browsers: ['PhantomJS'],

    frameworks: ['jasmine'],

    files: [
      'tests/**/*.js',
    ],

    preprocessors: {
      'tests/**/*.js': ['webpack'],
    },

    webpack: require('./webpack.config.js'),

    webpackMiddleware: {
      noInfo: true
    },

    plugins: [
      require('karma-webpack'),
      'karma-jasmine',
      'karma-phantomjs-launcher',
    ],

    reporter: 'dots',
  });
};
