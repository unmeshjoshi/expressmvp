Model View Presenter framework for Express
==========================

Model View Presenter is a useful pattern to organize web projects. Its helps organizing code in a way that is closer to HTTP verbs,
than the standard MVC web frameworks. Presenters handle GET request and present a representation. Commands handle POST requests and execute updates.
This kind of structuring allows us to better handle different requirements that objects handling GET requests have as compared to objects handling POST requests.
e.g. GET requests can add cache headers, they need to idempotent etc.

Post-Redirect-Get is well known pattern and commonly used with MVP. In this pattern, POST requests always send 302 redirects.
This takes care of common problems like browser back button handling.

Expressmvp is built on top of well known web framework Express for nodejs. It auto registers Presenters for handling Get requests and Commands for handling POST requests.

QuickStart
==========================

To install, use "npm install expressmvp"

Writing presenters and commands.
==========================

Here is how you can add simple presenter.

1) Create a file called HelloPresenter.js anywhere in app folder.
   Expressmvp recursively searches for files named *Presenter.js inside app folder and register the show method against the uri for handling GET requests.
   So this can really be in any subdirectory of app.

2) In HelloPresenter write following code.

    var presenter = module.exports;

    presenter.uri = '/hello';

    presenter.show = function (req, res) {
        res.send('Hello World!');
    };


3) Add following lines to app.js.

    var expmvp = require('expressmvp');
    expmvp.configure(app)


4) Start the app. and hit /hello url. You should see 'Hello World!'

Writing commands.
==========================
This is very similar to presenters, except the file name should end with *Command.js.

1) Create a file called HelloCommand.js anywhere in app folder.
Expressmvp recursively searches for files named *Command.js inside app folder and register the execute method against the uri for handling POST requests.
So this can really be in any subdirectory of app.

2) In HelloCommand write following code.

    var command = module.exports;

    command.uri = '/say-hello';

    command.execute = function (req, redirectCallback) {
        redirectCallback("/hello")
    }


3)   Add following lines to app.js. (Or if you already have these, just ignore this step).

       var expmvp = require('expressmvp');
       expmvp.configure(app)

4) Start the app. and try 'curl -d "" <yourhost>/say-hello', you should see

          HTTP/1.1 302 Moved Temporarily
          X-Powered-By: Express
          Location: /hello

As you can see. Commands accept a function that takes a url to redirect to, forcing the Post-Redirect-Get pattern.
