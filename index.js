'use strict';

// THE MODULE WHITELIST
// At time of writing these are all the officially blessed angular modules.
// We won't add any others matching the regex above unless explicitly told to
// via the angular array parameter

var whitelist = [
  'angular-animate',
  'angular-aria',
  'angular-cookies',
  'angular-loader',
  'angular-messages',
  'angular-mocks',
  'angular-resource',
  'angular-route',
  'angular-touch'
];

var path = require('path');
var fs = require('fs');

//only files matching this regex will be added.
var regex = /^angular-[a-z]+$/;

// Files from npm aren't going to change often enough to warrant watching them.
var karmaFilePattern = function(module) {
  var file =  path.join(process.cwd(), 'node_modules', module, module + '.js');
    if (!fs.existsSync(file)) {
      file =  path.join(process.cwd(), 'node_modules', module, 'dist', module + '.js');
    }  return {pattern: file, included: true, served: true, watched: false};
};

/**
 * Take a potentially short 'mocks' and prefix it so it's 'angular-mocks'
 * Returns null if you try to add 'angular' (which needs to be placed at the front of the array).
 * Throws if nothing matches.
 * @param {string} shortName possibly / possibly not prefixed name
 * @returns {string|null} prefixed name, or null if trying to add core angular
 * @throws If trying to add a non angular-* package.
 */
function prefix(shortName){
  var lc = shortName.toLowerCase().trim();
  if(lc === 'angular'){
    console.log('angular will be added automatically');
    return null;
  }
  if(regex.test(lc)) return lc;
  lc = 'angular-' + lc;
  if(!regex.test(lc)) throw new Error(shortName + ' is not a valid name for an angular module');
  return lc;
}

//This is where the magic happens! Params injected automatically by karma
function framework(files, ngConfig){
  if(!files) throw new Error('Your karma config must contain a files array');
  var added = {};
  if( Array.isArray(ngConfig) ) {
    // handle the array input
    ngConfig.forEach(function(file){
      addFile(file, files, added, true);
    });
  } else {
    // scan package.json for matching angular-* dependencies
    var pkg = require(path.resolve(__dirname, process.cwd(),'package.json'));
    ['devDependencies', 'peerDependencies', 'dependencies'].forEach(function(prop){
      if(pkg[prop]) addFiles(files, Object.keys(pkg[prop]), added);
    });
  }
  files.unshift(karmaFilePattern('angular'));   //always unshift angular last (so it's first!).
}
framework.$inject = ['config.files', 'config.angular'];
module.exports = {'framework:angular': ['factory', framework]};

/**
 * Adds files
 * @param {string} file the name of the file ('angular-mocks', 'mocks', 'route', etc).
 * @param {string[]} files array to prepend dependency sources on
 * @param {Object} added a map of string file names to booleans telling us whether this file has already been added.
 * @param {boolean} force if true, will add the file even if it isn't in the white-list
 */
function addFile(file, files, added, force){
  file = prefix(file);
  if(!file) return; // angular will be added at the beginning;
  if(added[file]) return; // do not add a second time;
  if(!force && whitelist.indexOf(file) === -1){
    console.log([
      'not adding ' + file + ', it is has not been white-listed as a valid angular distribution.',
      'If you think this is incorrect, please file a bug or submit a PR at:',
      'https://github.com/jamestalmage/karma-angular. You can also force any module to be included',
      'using `angular` property of your karma config (see the docs)'
    ].join('\n'));
    return;
  }
  var filePattern = karmaFilePattern(file);
  console.log('adding ' + filePattern.pattern);
  files.unshift(filePattern);
  added[file] = true;
}

/**
 *
 * @param {string[]} files array to prepend dependency sources on
 * @param {string[]} keys the key names from `dependencies`, `devDependencies`, etc.
 * @param {Object} added a map of string file names to booleans telling us whether this file has already been added.
 */
function addFiles(files, keys, added){
  keys.forEach(function(key){
    if(regex.test(key)) addFile(key, files, added);
  });
}
