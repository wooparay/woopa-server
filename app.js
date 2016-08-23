
/* ******************************** */
/*  require / import starts here    */
/* ******************************** */

var express = require('express');   // express framework
var fs = require('fs');             // file io

var configMiddleware = require('./helpers/appConfig');
var testRouter = require('./middlewares/testRouter');

/* **************************** */
/*  object inits starts here    */
/* **************************** */

var serverConf = JSON.parse(fs.readFileSync('conf/server.json'));
var app = express();

/* ******************** */
/*  setup middleware(s) */
/* ******************** */

configMiddleware(express, app, serverConf);

/* **************** */
/*  setup routes    */
/* **************** */

app.use('/test', testRouter(express));




/* **************************** */
/*  listen to server (start)    */
/* **************************** */

app.listen(serverConf['server-port'], function() {
    // this = server object (express)
    console.log('server running at port: %d', this.address().port);
});
