# promise-throttle

This is a Javascript module that wraps a function to limit the rate at
which that function is called. Although it can wrap any function, it
is primarily intended for use with `fetch()` to call rate-limited web
APIs. For example:

    var throttle = require('promise-throttle');
    
    var throttledFetch = throttle(fetch, 5, 1000);
    fetch('http://rest.example.com/').then(...);

Calling the wrapper function (`throttledFetch()`) will defer calls to
the wrapped function (`fetch()`) as needed to limit the call rate (5
calls per 1000 milliseconds). The wrapper function returns a
Javascript Promise whose value is the result of the wrapped function.

Other throttle implementations limit the rate of *invocation* of the
function argument. This is not guaranteed to work when calling web
APIs with a rate limit. Because of variation in network propagation,
rate limiting invocation at the client can still result in exceeding
the rate at the server. For this reason, promise-throttle instead
measures its rate using the *completion* time of the function
argument, where completion is determined by converting the returned
value to a `Promise` (using `Promise.resolve()`) and waiting for it to
settle.

The strategy of using completion time does mean that every `Promise`
returned by the wrapped function should eventually resolve or reject.
"Zombie" `Promise` instances that never settle will eventually clog
the throttle queue. This can generally be addressed by adding a
timeout, e.g. with `Promise.race()`.