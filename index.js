'use strict';

var path = require('path');

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

var pattern = function(file) {
  file =  path.join(process.cwd(), 'node_modules', file, file + '.js');
  return {pattern: file, included: true, served: true, watched: false};
};

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

function framework(files, ngConfig){
  if(!files) throw new Error('Your karma config must contain a files array');
  var added = {};
  if( Array.isArray(ngConfig) ) {
    ngConfig.forEach(function(file){
      addFile(file, files, added, true);
    });
  } else {
    var pkg = require(path.resolve(__dirname, process.cwd(),'package.json'));
    ['devDependencies', 'peerDependencies', 'dependencies'].forEach(function(prop){
      if(pkg[prop]) addFiles(files, Object.keys(pkg[prop]), added);
    });
  }
  files.unshift(pattern('angular'));
}

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
  var filePattern = pattern(file);
  console.log('adding ' + filePattern.pattern);
  files.unshift(filePattern);
  added[file] = true;
}

function addFiles(files, keys, added){
  keys.forEach(function(key){
    if(regex.test(key)) addFile(key, files, added);
  });
}

framework.$inject = ['config.files', 'config.angular'];
module.exports = {'framework:angular': ['factory', framework]};

var regex = /^angular-[a-z]+$/;

