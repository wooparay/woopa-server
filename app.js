
/* ******************************** */
/*  require / import starts here    */
/* ******************************** */

var express = require('express');   // express framework
var fs = require('fs');             // file io
var log = require('morgan');        // logging http messages

var router = require('./middlewares/router');

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

/* **************************** */
/*  object inits starts here    */
/* **************************** */

var serverConfFile = 'conf/server.json'; 
var serverConf = JSON.parse(fs.readFileSync(serverConfFile));

var app = express();

/* ******************** */
/*  setup middleware(s) */
/* ******************** */

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

app.use(express.static(serverConf['static-files']));

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

