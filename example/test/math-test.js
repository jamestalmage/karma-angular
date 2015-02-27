describe('math', function() {
  beforeEach(module('math'));

  var add, subtract;

  beforeEach(inject(function(_add_,_subtract_){
    add = _add_;
    subtract = _subtract_;
  }));

  it('add', function() {
    var result = add(2, 2);
    assert.equals(4, result);
  });

  it('subtract', function(){
    var result = subtract(4, 2);
    assert.equals(2, result);
  });

  var assert = {
    equals:function(expected, actual){
      if(expected != actual) throw new Error('expected ' + expected + ' to equal ' + actual);
    }
  }
});