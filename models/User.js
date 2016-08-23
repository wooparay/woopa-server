/**
 *  User = login; holds related information of a "login/user"
 *
 *  ** http://mongoosejs.com/docs/queries.html
 */

var ctor = function(mongoose) {
    /*
     *  create a schema 
     */
    const UserSchema = mongoose.Schema({
        provider: { type:String, default: null }, // eg. facebook, google
        id: { type:String, default: null },     // id of the user (depends on provider)
        displayName: { type:String, default: null }, 
        name: {
            familyName: { type:String, default: null },
            givenName: { type:String, default: null }, 
            middleName: { type:String, default: null }
        },
        emails: [{
            value: { type:String, default: null },  // value of email (e.g. abc@gmail.com)
            type: { type:String, default: null }    // type (e.g. biz, home)
        }],
        photos: [{ type:String, default: null }]    // url of photos
    });
    
    // add methods (model methods) here if any...
    // UserSchema.methods.methodXXX = function() {};
    
    return {
        /*
         *  return the UserSchema (built from the given CollectionName)
         */
        schema: function(collectionName) {
            return mongoose.model(collectionName, UserSchema);
        }
        // other methods...
    };
};


module.exports = ctor;

