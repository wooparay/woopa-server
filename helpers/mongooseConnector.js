
/**
 *  exports the function for creating a mongodb connection
 */

const mongoose = require('mongoose');

var connectMongoose = function(dbUrl, connectOptions, promiseLib) {
    mongoose.connect(dbUrl, connectOptions);
    mongoose.Promise = promiseLib;  // set promiseLibrary
    
    return mongoose;
};

module.exports = connectMongoose;