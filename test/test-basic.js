'use strict';

var throttle = require('..');

var test = require('tape');

test('basic operation', function(t) {
  var N = 10;
  t.plan(N);
  t.timeoutAfter(10000);

  var start = Date.now();
  
  var f = throttle(function(a) {
    console.log('elapsed ' + a + ': ' + (Date.now() - start));
    t.assert(true);
  }, 3, 1000);

  for (var i = 0; i < N; ++i)
    f(i);
});
