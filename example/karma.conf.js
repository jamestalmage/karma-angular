module.exports = function(karma){
  karma.set({

    // the angular framework needs to go before mocha / jasmine
    frameworks: ['angular', 'mocha'],

    files: [
      "src/math.js",
      "test/math-test.js"
    ],

    browsers: ['PhantomJS'],

    singleRun: true,
    autoWatch: false
  });
};