
/* ******************************** */
/*  require / import starts here    */
/* ******************************** */

var express = require('express');   // express framework
var fs = require('fs');             // file io
var bluebird = require('bluebird'); // promise library for mongoose

var configMiddleware = require('./helpers/appConfig');
var testRouter = require('./middlewares/testRouter');
var mongoose = require('./helpers/mongooseConnector');

var userModel = require('./models/user');

/* **************************** */
/*  object inits starts here    */
/* **************************** */

var serverConf = JSON.parse(fs.readFileSync('conf/server.json'));
var app = express();

/* ******************** */
/*  setup middleware(s) */
/* ******************** */

// connect the mongoose
mongoose = mongoose(serverConf['mongodb-url'], { }, bluebird);

/* ******************** */
/*  setup dao model(s)  */
/* ******************** */

userModel = userModel(mongoose);

configMiddleware(express, app, serverConf, mongoose, userModel);

/* **************** */
/*  setup routes    */
/* **************** */

app.use('/test', testRouter(express, userModel));




/* **************************** */
/*  listen to server (start)    */
/* **************************** */

app.listen(serverConf['server-port'], function() {
    // this = server object (express)
    console.log('server running at port: %d', this.address().port);
});
