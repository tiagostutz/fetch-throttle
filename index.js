// The exported function takes a function returning a Promise
// (e.g. fetch) and returns a function that automatically
// delays calls to the original function such that the
// rate is kept below the specified number of calls in the
// specified number of milliseconds.
module.exports = function(f, calls, milliseconds) {
  var queue = [];
  var complete = [];
  var inflight = 0;
  
  var processQueue = function() {
    if (!queue.length)
      return;

    // Remove old complete entries.
    var now = Date.now();
    while (complete.length && complete[0] < now - milliseconds)
      complete.shift();

    // Make calls from the queue that fit within the limit.
    while (queue.length && complete.length + inflight < calls) {
      var request = queue.shift();
      ++inflight;
      
      // Call the deferred function, fulfilling the Promise with
      // whatever results and logging the completion time.
      f.apply(request.this, request.arguments).then((result) => {
        request.resolve(result);
      }, (error) => {
        request.reject(error);
      }).then(() => {
        --inflight;
        complete.push(Date.now());

        if (queue.length && complete.length === 1)
          setTimeout(milliseconds, processQueue);
      });
    }

    // Check the queue on the next expiration.
    if (queue.length && complete.length)
      setTimeout(complete[0] + milliseconds - now, processQueue);
  };
  
  return function() {
    return new Promise((resolve, reject) => {
      queue.push({
        this: this,
        arguments: arguments,
        resolve: resolve,
        reject: reject
      });

      processQueue();
    });
  };
};
