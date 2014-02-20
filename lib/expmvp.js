var fs = require('fs');
var path = require('path');

var expmvp = module.exports = {};

function registerHandlers(app, basedir, fileMatcher, callback) {
    fs.readdirSync(basedir).forEach(function (fname) {
        var filePath = basedir + '/' + fname;
        fs.stat(filePath, function (err, stat) {
            if (stat.isDirectory()) {
                return registerHandlers(app, filePath, fileMatcher, callback);
            }
            if (fileMatcher.test(fname)) {
                var name = path.basename(fname, '.js')
                    , realpath = fs.realpathSync(filePath)
                    , httphandler = require(realpath);
                console.log("requiring " + realpath);
                console.log("registering " + httphandler.uri);
                callback(httphandler);

            }
        })
    });
}


expmvp.FlashScope = require("./flashscope.js").FlashScope
expmvp.configure = function (app) {
    registerHandlers(app, 'app/', /.*Presenter\.js$/, function (httpHandler) {

        function getRequestHandler(req, res) {
            if (httpHandler.cache_headers) {
                app.disable('etag')
                for (headerName in httpHandler.cache_headers) {
                    console.log("Setting cache header " + headerName + ":" + httpHandler.cache_headers[headerName]);
                    res.setHeader(headerName, httpHandler.cache_headers[headerName]);
                }
            }
            httpHandler.show(req, res);
        };

        if (httpHandler.middleware) {
            app.get(httpHandler.uri, httpHandler.middleware, getRequestHandler);
        } else {
            app.get(httpHandler.uri, getRequestHandler);
        }
    });

    registerHandlers(app, 'app/', /.*Command\.js$/, function (httpHandler) {
        function postRequestHandler(req, res) {
            httpHandler.execute(req, function (redirectUrl) {
                res.redirect(redirectUrl)
            });
        }

        if (httpHandler.middleware) {
            app.post(httpHandler.uri, httpHandler.middleware, postRequestHandler)
        } else {
            app.post(httpHandler.uri, postRequestHandler)
        }
    });

};
