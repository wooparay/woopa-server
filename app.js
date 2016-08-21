
/* ******************************** */
/*  require / import starts here    */
/* ******************************** */

var express = require('express');
var fs = require('fs');
var log = require('morgan');

/* **************************** */
/*  object inits starts here    */
/* **************************** */

var serverConfFile = 'conf/server.json'; 
var serverConf = JSON.parse(fs.readFileSync(serverConfFile));

var app = express();
var appServer = null;

app.use(express.static(serverConf['static-files']));
app.listen(serverConf['server-port'], function() {
    // this = server object (express)
    console.log('server running at port: %d', this.address().port);
});

