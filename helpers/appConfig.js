/**
 *  export a function to configure the middlewares; routes are excluded
 */

var compression = require('compression');   // http compression (gzip?)
var morgan = require('morgan');             // logging http messages

// {optional} if need to create http session based on cookies
//var sessionCreator = require('./../middlewares/sessionCreator');

var configureAppServer = function(express, app, serverConf) {
    // ** https://github.com/senchalabs/connect#readme
    // must be the first middleware
    app.use(compression());

    // {optional} create http session based on cookies
    //app.use(sessionCreator('WOOPA_SESSION_SECRET', 'mongodb://localhost/woopa', 'woopa-sessions'));

    // set static file path (usually pointing to the client app)
    app.use(express.static(serverConf['static-files']));

    // * setup morgan (only non-static routes would be recorded)
    app.use(morgan('combined'));
};

module.exports = configureAppServer;