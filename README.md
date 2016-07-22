# promise-throttle

This is a Javascript module that wraps a function to limit the rate at
which that function is called. For example:

    var throttle = require('promise-throttle');
    
    function foo(a0, a1) {
      ...
    }

    var bar = throttle(foo, 5, 1*1000);
    bar('baz', 42).then(...);

Calling the wrapping function (`bar()`) will defer calls to the
wrapped function (`foo()`) as needed to limit the call rate to 5 calls
per 1000 milliseconds. The wrapping function returns a Javascript
Promise whose value is the result of the wrapped function.

promise-throttle is primarily intended for use with `fetch()` for
calling web APIs with a rate limit. Because of variation in network
propagation, it is possible that invoking fetch at a rate within the
limits may result in requests arriving at the server in violation of
the rate. In order to prevent this, promise-throttle measures its rate
using the completion time of any Promise returned by a wrapped
function.