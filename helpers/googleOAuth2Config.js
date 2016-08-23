/**
 *  google oauth2 configurator
 */

var init = function(express) {
    
    var passport = require('passport');
    var GoogleOAuth2 = require('passport-google-oauth').OAuth2Strategy;

    passport.use(new GoogleOAuth2(
        {
            clientID: process.env['GOOGLE_APP_CLIENT_ID'],
            clientSecret: process.env['GOOGLE_APP_CLIENT_SECRET'],
            callbackURL: process.env['GOOGLE_APP_CALLBACK_URL']
        }, 
        // verify callback
        function(accessToken, refreshToken, googleProfile, done) {

            console.log('accessToken');
            console.log(accessToken);
            console.log('refreshToken');
            console.log(refreshToken);
            console.log('googleProfile');
            console.log(googleProfile);
            console.log('done');
            console.log(done);

            // find the user in your mongodb and return it out (serialize or deserialize etc)
            // err, user
            return done(null, null);
        }
    ));
    
    // setup routes
    var router = express.Router();
    
    // GET /auth/google
    //   Use passport.authenticate() as route middleware to authenticate the
    //   request.  The first step in Google authentication will involve redirecting
    //   the user to google.com.  After authorization, Google will redirect the user
    //   back to this application at /auth/google/callback
    // * { scope: 'https://www.google.com/m8/feeds' }
    router.get('/google-login', 
               passport.authenticate('google', { scope: 'profile' } ));

    // GET /auth/google/callback
    //   Use passport.authenticate() as route middleware to authenticate the
    //   request.  If authentication fails, the user will be redirected back to the
    //   login page.  Otherwise, the primary route function function will be called,
    //   which, in this example, will redirect the user to the home page.    
    router.get('/callback', 
                passport.authenticate('google', { failureRedirect: '/login' }),
                function(req, res) {
                    res.send('done seems');
//res.redirect('/');
                });
    
    return {
        passport: passport, 
        router: router
    };
};

module.exports = init;