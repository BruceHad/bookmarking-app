# CORS

https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS
http://stackoverflow.com/questions/11001817/allow-cors-rest-request-to-a-express-node-js-application-on-heroku

A resource makes a cross-origin http request when it requests a resource from a different domain. For security reasons, request from within scripts, e.g. XMLHttpRequests, browser may block such requests.

Cross Origin Resource Sharing (CORS) works by adding new HTTP headers
that allow servers to describe the set of origins that are permitted to read that information.

So it's the server providing the API that controls who can read that information, not the client that controls which domains it can request from.

In node/express app:

    var allowCrossDomain = function(req, res, next) {
        res.header('Access-Control-Allow-Origin', 'http://treerock.me');
        res.header('Access-Control-Allow-Methods', 'GET,POST');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

        // intercept OPTIONS method
        if ('OPTIONS' == req.method) {
          res.send(200);
        }
        else {
          next();
        }
    };

And remember and put in the:

    app.use(allowCrossDomain)
