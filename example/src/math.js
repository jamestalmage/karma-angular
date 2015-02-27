angular.module('math',[])
.value('add',function(lhs, rhs){ return lhs + rhs; })
.value('subtract',function(lhs, rhs){ return lhs - rhs; });