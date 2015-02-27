karma-angular
============

[Install karma-angular]
```
npm install --save-dev karma-angular
```

[Install desired angular-dependencies via npm]
```
npm install --save-dev angular-mocks
npm install --save angular angular-route
```

[Set Up Your karma.conf.js]
```javascript
module.exports = function(karma){
  karma.set({
    // register the framework (it needs to go before mocha / jasmine)
    frameworks: ['angular', 'mocha'],


    files: [               // no need to enter paths for angular / angular-mocks
      "src/**.js",         // your package.json is scanned and they will be automatically
      "test/**-test.js"    // prepended to files.
    ],

    browsers: ['PhantomJS']
  });
};
```

If the automatic scanning is not working for you, you can enter angular module names like so:
 ```javascript
module.exports = function(karma){
  karma.set({
    // register the framework (it needs to go before mocha / jasmine)
    frameworks: ['angular', 'mocha'],

    angular: ['mocks', 'route', 'angular-aria'],

    files: [               // no need to enter paths for angular / angular-mocks
      "src/**.js",         // your package.json is scanned and they will be automatically
      "test/**-test.js"    // prepended to files.
    ],

    browsers: ['PhantomJS']
  });
};
```

