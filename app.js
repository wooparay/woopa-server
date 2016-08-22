
/* ******************************** */
/*  require / import starts here    */
/* ******************************** */

var express = require('express');   // express framework
var fs = require('fs');             // file io
var log = require('morgan');        // logging http messages
var compression = require('compression');

var router = require('./middlewares/router');

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

/* **************************** */
/*  object inits starts here    */
/* **************************** */

var serverConf = JSON.parse(fs.readFileSync('conf/server.json'));

var app = express();

/* ******************** */
/*  setup middleware(s) */
/* ******************** */

// ** https://github.com/senchalabs/connect#readme
// must be the first middleware
app.use(compression());

// ** https://github.com/expressjs/session
app.use(session({
    secret: process.env['WOOPA_SESSION_SECRET'],
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
        url: 'mongodb://localhost/woopa',
        /*
         *  use default values for others
         *  stringify, fallbackMemory, serialize, unserialize, transformId
         */    
        collection: 'woopa-sessions'
    })
}));

// set static file path (usually pointing to the client app)
app.use(express.static(serverConf['static-files']));

// * setup morgan (only non-static routes would be recorded)
app.use(log('combined'));

// setup of routing (for this case '/test')
app.use('/test', router);



/* **************************** */
/*  listen to server (start)    */
/* **************************** */

app.listen(serverConf['server-port'], function() {
    // this = server object (express)
    console.log('server running at port: %d', this.address().port);
    
    // to output env variable
    //console.log(process.env['WOOPA_SESSION_SECRET']);
});

