'use strict';

var throttle = require('..');

var test = require('tape');

test('basic operation', function(t) {
  var N = 10;
  t.plan(N);
  t.timeoutAfter(10000);

  var start = Date.now();
  
  var f = throttle(function(a) {
    return new Promise(function(resolve, reject) {
      console.log('elapsed ' + a + ': ' + (Date.now() - start));
      t.assert(true);
      resolve();
    });
  }, 3, 1000);

  for (var i = 0; i < N; ++i)
    f(i);
});

test('simulate', function(t) {
  var THROTTLE_COUNT = 10;
  var THROTTLE_WINDOW = 0.1;
  var REQUESTS = 1000;
  var DURATION = 5;
  var MAX_DELAY = 0.025;

  t.timeoutAfter((REQUESTS*(THROTTLE_WINDOW/THROTTLE_COUNT + MAX_DELAY) + DURATION)*1000);
  t.plan(1);

  var rateExceeded = 0;
  var timestamps = [];
  var f = throttle(function() {
    return new Promise(function(resolve, reject) {
      // Simulate network delay to a server.
      setTimeout(function() {
        // Verify the rate at the server.
        var timestamp = Date.now();
        if (timestamps.length >= THROTTLE_COUNT &&
            timestamp - timestamps[timestamps.length - THROTTLE_COUNT] < THROTTLE_WINDOW)
          ++rateExceeded;
        
        timestamps.push(timestamp);
        resolve();

        if (timestamps.length == REQUESTS)
          t.equal(rateExceeded, 0);
      }, Math.random()*MAX_DELAY*1000);
    });
  }, THROTTLE_COUNT, THROTTLE_WINDOW * 1000);

  // Call the throttled function at random times.
  for (var i = 0; i < REQUESTS; ++i)
    setTimeout(f, Math.random(DURATION*1000));
});
