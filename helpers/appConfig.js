/**
 *  export a function to configure the middlewares; routes are excluded
 */

var compression = require('compression');   // http compression (gzip?)
var morgan = require('morgan');             // logging http messages
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// {optional} if need to create http session based on cookies
var sessionCreator = require('./../middlewares/sessionCreator');
var googlePassport = require('./googleOAuth2Config');


var configureAppServer = function(express, app, serverConf, mongoose) {
    // ** https://github.com/senchalabs/connect#readme
    // must be the first middleware
    app.use(compression());
    
    // ** https://www.npmjs.com/package/cookie-parser
    app.use(cookieParser());    
    
    // ** https://www.npmjs.com/package/body-parser
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());

    // {optional} create http session based on cookies
    app.use(sessionCreator(
        'WOOPA_SESSION_SECRET', 
        serverConf['mongodb-url'], 
        serverConf['mongodb-http-session-collection'],
        mongoose
    ));
    
    googlePassport = googlePassport(express);
    app.use(googlePassport.passport.initialize());
    app.use(googlePassport.passport.session());
    app.use('/oauth2', googlePassport.router);

    // set static file path (usually pointing to the client app)
    app.use(express.static(serverConf['static-files']));

    // * setup morgan (only non-static routes would be recorded)
    app.use(morgan('combined'));
};

module.exports = configureAppServer;