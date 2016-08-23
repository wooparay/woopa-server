/**
 *  exports a function for creating http sessions based on cookie
 */

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

/**
 *  function to create a http session based on cookie
 *  ref: ** https://github.com/expressjs/session
 */
var creationSessionMiddleware = function(sessionSecret, 
    mongodbUrl, 
    mongodbCollectionName, 
    mongoose) {
    
    sessionSecret = sessionSecret || 'WOOPA_SESSION_SECRET';
    mongodbUrl = mongodbUrl || 'mongodb://localhost/woopa';
    mongodbCollectionName = mongodbCollectionName || 'woopa-sessions';
    
    return session({
        secret: process.env[sessionSecret],
        resave: false,
        saveUninitialized: true,
        store: new MongoStore({
            /*
             *  strategy: either to re-use the connection from mongoose
             *      OR to supply a url and create a new connection (performance penalty)
             *
             *  url: mongodbUrl,
             */
            mongooseConnection: mongoose.connection,
            /*
             *  use default values for others
             *  stringify, fallbackMemory, serialize, unserialize, transformId
             */    
            collection: mongodbCollectionName
        })
    });
};


module.exports = creationSessionMiddleware;