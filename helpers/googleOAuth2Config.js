/**
 *  google oauth2 configurator
 *  ** https://www.npmjs.com/package/passport-google-oauth2
 */

var init = function(express, userModel) {
    
    var passport = require('passport');
    var GoogleOAuth2 = require('passport-google-oauth').OAuth2Strategy;

    passport.use(new GoogleOAuth2(
        {
            clientID: process.env['GOOGLE_APP_CLIENT_ID'],
            clientSecret: process.env['GOOGLE_APP_CLIENT_SECRET'],
            callbackURL: process.env['GOOGLE_APP_CALLBACK_URL'],
            passReqToCallback: true
        }, 
        // verify callback
        function(req, accessToken, refreshToken, googleProfile, done) {
            /*
            console.log('accessToken: '+accessToken);
            console.log('refreshToken: '+refreshToken);
            console.log('googleProfile: ');
            console.log(googleProfile);
            */
            
            var UserSchema = userModel.schema('google-users');
            var user = new UserSchema({
                provider: 'google',
                gender: googleProfile.gender,
                displayName: googleProfile.displayName,
                name: {
                    familyName: googleProfile.name.familyName,
                    givenName: googleProfile.name.givenName
                },
                id: googleProfile.id,
                photos: googleProfile.photos[0].value,
                accessToken: accessToken
            });

            /*
             *  find if any existing entry available
             *  true => update
             *  false => insert
             */
            UserSchema.findOne(
                { id: googleProfile.id, provider: googleProfile.provider }, 
                null, // projection
                null, // options
                function(err, results) {
                    if (err) return done(err, null);
                    
                    if (results) {
                        /*
                         *  _id field is auto populated... beware 
                         *  (hence, should not depend on _id in this case, use id and provider instead)
                         */
                        user['_id']=results['_id'];
                        UserSchema.update(
                            { id: googleProfile.id, provider: googleProfile.provider },
                            user, 
                            null, 
                            function(err, results) {
                                //console.log(results);   // { ok: 1, nModified: 1, n: 1 }
                                if (err) return done(err, null);
                                
                                // update the session -> set { session-id: googleProfile.id, session-provider: googleProfile.provider }   
                                updateUserSession(req, user);
                                /*
                                 *  1st parameter is err object
                                 *  2nd parameter is user object
                                 *  a) null => means failed to passportjs
                                 *  b) {} => failed to serialize user into session Exception
                                 */
                                return done(null, user);
                            }
                        );  // end -- UserSchema.update()
                        
                    } else {
                        UserSchema.create(user, function(err, results) {
                            //console.log(results); // results is the "User" model
                            if (err) return done(err, null);
                            
                            // update the session -> set { session-id: googleProfile.id, session-provider: googleProfile.provider }
                            updateUserSession(req, user);
                            
                            return done(null, user);
                        });
                    }   // end -- if (results have value or not)
                }
            ); 
            // end -- findOne
        }
    ));
    
    passport.serializeUser(function(user, done) {
        //console.log('** inside serializeUser: '+user.id);
        done(null, user.id);
    });
    
    passport.deserializeUser(function(id, done) {
        //console.log('** inside deserializeUser: '+id);
        var UserSchema = userModel.schema('google-users');
        
        // provider could be get from ... req.session['session-provider'] though
        UserSchema.findOne(
            { id: id, provider: 'google' },
            null, // projection (get all fields for now)
            null, 
            function(err, results) {
                // results = user model (google-users collection)
                if (err) done(err, null);
                
                done(null, results);
            }
        );
    });
    
    
    // setup routes
    var router = express.Router();
    
    // GET /auth/google
    //   Use passport.authenticate() as route middleware to authenticate the
    //   request.  The first step in Google authentication will involve redirecting
    //   the user to google.com.  After authorization, Google will redirect the user
    //   back to this application at /auth/google/callback
    // * { scope: 'https://www.google.com/m8/feeds' }
    // * { scope: 'profile' } 
    //
    // ** https://developers.google.com/identity/protocols/googlescopes
    router.get('/google-login', 
               passport.authenticate('google', { scope: [
                   'https://www.googleapis.com/auth/plus.login',
                   'https://www.googleapis.com/auth/contacts.readonly'
               ] } ));

    // GET /auth/google/callback
    //   Use passport.authenticate() as route middleware to authenticate the
    //   request.  If authentication fails, the user will be redirected back to the
    //   login page.  Otherwise, the primary route function function will be called,
    //   which, in this example, will redirect the user to the home page.    
    router.get('/callback', 
                passport.authenticate(
                    'google', 
                    { successRedirect: '/', failureRedirect: '/login' }
                )
              );
               /*,
                function(req, res) {
                    res.send('done seems');
                //res.redirect('/');
                }
                */

    
    return {
        passport: passport, 
        router: router
    };
};


/**
 *  method to update any session information necessary
 *  ** TODO: would become an event hook on future release
 */
var updateUserSession = function(req, user) {
    //update the session -> set { session-id: googleProfile.id, session-provider: googleProfile.provider }
    req.session['session-id'] = user.id;  // already auto populate by passportjs => passport: { user: 'id_value....' }
    req.session['session-provider'] = user.provider;
};

module.exports = init;