karma-angular
============
The Angular team is now reliably releasing all of the angular modules via npm.
Typically you'd need to add a bunch of boiler plate referencing those paths,
and make sure they are included in the right order.

No longer! Just install this framework and it will scan your package.json,
find all your angular dependencies, and make sure they are being served up by karma.

As an added bonus: If you decide to add/remove an angular module later,
just `npm install --save` or `npm remove --save` it. Your karma config does not need to change.

*Note: This is only works for official angular modules released by the Angular team*

Install karma-angular
--------------------
```
npm install --save-dev karma-angular
```

Install desired angular-dependencies via npm
--------------------------------------------
```
npm install --save-dev angular-mocks
npm install --save angular angular-route
```

Set Up Your karma.conf.js
-------------------------
```javascript
module.exports = function(karma){
  karma.set({
    // register the framework (it needs to go before mocha / jasmine)
    frameworks: ['angular', 'mocha'],


    files: [               // no need to enter paths for angular / angular-mocks
      "src/**.js",         // your package.json is scanned and they will be automatically
      "test/**-test.js"    // prepended to this array.
    ],

    browsers: ['PhantomJS']
  });
};
```

If the automatic scanning is not working for you, you can enter angular module names like so:

 ```javascript
module.exports = function(karma){
  karma.set({
    frameworks: ['angular', 'mocha'],

    // you can use the full name (i.e. 'angular-mocks', or just shorten it to 'mocks')
    angular: ['mocks', 'route', 'angular-aria'],

    files: [
      "src/**.js",
      "test/**-test.js"
    ],

    browsers: ['PhantomJS']
  });
};
```

