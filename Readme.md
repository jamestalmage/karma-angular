karma-angular
============
[![Build Status](https://travis-ci.org/jamestalmage/karma-angular.svg?branch=master)](https://travis-ci.org/jamestalmage/karma-angular)
[![Coverage Status](https://coveralls.io/repos/jamestalmage/karma-angular/badge.svg?branch=master)](https://coveralls.io/r/jamestalmage/karma-angular?branch=master)

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

__Attention:__ `angular` has to be added to `frameworks` __before__ `mocha` or `jasmine`, otherwise `angular-mocks` does not expose all of its methods.

If the automatic scanning is not working for you, you can force which modules are included with an
array of strings as shown below. This really is not recommended, as it's not really saving you any work
(just use the files array at this point) and you lose out on managing those dependencies entirely from
`npm install` / `remove`. Provided mostly as a way for you to hot-fix if angular releases a new module you
need **right now** and I have not white listed it yet. If that is the case, please create an issue, or
better yet write up a quick Pull Request on [the white-list in this file](https://github.com/jamestalmage/karma-angular/blob/master/index.js).

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

If for some reason you need further examples, one can be found
[here](https://github.com/jamestalmage/karma-angular/tree/master/example).

