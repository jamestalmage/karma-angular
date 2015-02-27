describe('framework',function(){
  var sinon = require('sinon');
  var chai = require('chai');
  chai.use(require('sinon-chai'));
  var expect = chai.expect;
  var proxyquire = require('proxyquire').noCallThru();
  var actualPath = require('path');

  var path = {
    resolve:sinon.stub(),
    join:sinon.stub()
  };

  var framework, json, files;


  beforeEach(function(){
    json = {};
    files = [];
    framework = proxyquire('../',{
      'path':path,
      '../../package.json':json
    })['framework:angular'][1];
    path.join.reset();
    path.resolve.reset();
    path.resolve.returns('../../package.json');
  });

  function join(file){
    return path.join.withArgs( process.cwd(), 'node_modules', file, file + '.js');
  }

  function depPath(file){
    return 'node_modules/'+file+'/'+file+'.js';
  }

  function defaultJoin(mods){
    for(var i = 0; i < arguments.length; i++){
      join(arguments[i]).returns(depPath(arguments[i]));
    }
  }

  function pattern(file){
    return {pattern: file, included: true, served: true, watched: false};
  }

  function compare(a,b){
    return a.pattern === b.pattern ? 0 : a.pattern > b.pattern ? 1 : -1;
  }

  function assertAngularCoreIsFirst(){
    expect(files[0]).to.eql(pattern(depPath('angular')));
  }

  function sortedEquals(expected){
    expected = Array.prototype.slice.call(arguments);
    for(var i = 0; i < expected.length; i++) expected[i] = pattern(depPath(expected[i]));
    assertAngularCoreIsFirst();
    files.shift();
    expected.sort(compare);
    files.sort(compare);
    expect(files).to.eql(expected);
  }

  it('will automatically load up devDependencies',function(){
    json.devDependencies = {
      "angular":"1.3",
      "angular-mocks":"1.3",
      "angular-route":"1.3"
    };
    defaultJoin('angular','angular-mocks','angular-route');
    framework(files);
    sortedEquals('angular-mocks','angular-route');
  });

  it('will automatically load up dependencies',function(){
    json.dependencies = {
      "angular":"1.3",
      "angular-mocks":"1.3",
      "angular-route":"1.3"
    };
    defaultJoin('angular','angular-mocks','angular-route');
    framework(files);
    sortedEquals('angular-mocks','angular-route');
  });

  it('will automatically load up peer dependencies',function(){
    json.peerDependencies = {
      "angular":"1.3",
      "not-an-angular-depo":"",
      "angular-mocks":"1.3",
      "angular-route":"1.3"
    };
    defaultJoin('angular','angular-mocks','angular-route');
    framework(files);
    sortedEquals('angular-mocks','angular-route');
  });

  it('will allow custom list of functions', function(){
    json.peerDependencies = {
      "angular":"1.3",
      "not-an-angular-depo":"",
      "angular-mocks":"1.3",
      "angular-route":"1.3"
    };
    defaultJoin('angular','angular-mocks','angular-route');
    framework(files,['angular-mocks']);
    sortedEquals('angular-mocks');
  });

  it('will not double add items', function(){
    json.peerDependencies = {
      "angular":"1.3",
      "not-an-angular-depo":"",
      "angular-mocks":"1.3",
      "angular-route":"1.3"
    };
    defaultJoin('angular','angular-mocks');
    framework(files,['angular-mocks','angular-mocks']);
    sortedEquals('angular-mocks');
  });

  it('will always add angular core at the beginning', function(){
    json.peerDependencies = {
      "angular":"1.3",
      "not-an-angular-depo":"",
      "angular-mocks":"1.3",
      "angular-route":"1.3"
    };
    defaultJoin('angular','angular-mocks');
    framework(files,['angular-route','angular','angular-mocks']);
    sortedEquals('angular-mocks','angular-route');
  });

  it('config can use short names', function(){
    json.peerDependencies = {
      "angular":"1.3",
      "not-an-angular-depo":"",
      "angular-mocks":"1.3",
      "angular-route":"1.3"
    };
    defaultJoin('angular','angular-mocks');
    framework(files,['route','angular','mocks']);
    sortedEquals('angular-mocks','angular-route');
  });

  it('will not add found dependencies that are not on the white-list', function(){
    json.peerDependencies = {
      "angular":"1.3",
      "angular-funkymodule":"",
      "angular-mocks":"1.3",
      "angular-route":"1.3"
    };
    defaultJoin('angular','angular-mocks','angular-route');
    framework(files);
    sortedEquals('angular-mocks','angular-route');
  });

  it('will throw if it gets passed a non angulary name', function() {
    json.peerDependencies = {
      "angular": "1.3",
      "not-an-angular-depo": "",
      "angular-mocks": "1.3",
      "angular-route": "1.3"
    };
    defaultJoin('angular', 'angular-mocks','not-an-angular-depo');
    expect(function(){
      framework(files, ['angular-route', 'not-an-angular-depo', 'angular-mocks']);
    }).to.throw();
  });

  it('will throw with a helpful message if files is not injected', function() {
    expect(function(){
      framework();
    }).to.throw(/karma config must contain/);
  });
});
