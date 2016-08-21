
/* ******************************** */
/*  require / import starts here    */
/* ******************************** */

var express = require('express');   // express framework
var fs = require('fs');             // file io
var log = require('morgan');        // logging http messages

/* **************************** */
/*  object inits starts here    */
/* **************************** */

var serverConfFile = 'conf/server.json'; 
var serverConf = JSON.parse(fs.readFileSync(serverConfFile));

var app = express();
var appServer = null;

/* ******************** */
/*  setup middleware(s) */
/* ******************** */
app.use(express.static(serverConf['static-files']));

app.listen(serverConf['server-port'], function() {
    // this = server object (express)
    console.log('server running at port: %d', this.address().port);
    
    // to output env variable
    //console.log(process.env['WOOPA_SESSION_SECRET']);
});

