/**
 *  testing purpose, exports a function to create the testing-router
 */
var createRouter = function(express, userModel) {
    var router = express.Router();

    /* **************** */
    /*  setup routes    */
    /* **************** */

    // ** https://www.npmjs.com/package/express-session
    router.get('/test-session', function(req, res) {
        var name = req.session.username;

        if (!name) {
            req.session.username = 'name-1';
        }

        res.send('inside test-session route~~ '+name);
    });
    
    router.post('/test-save-user', function(req, res) {
        /*
         *  params => route param
         *  query => either body or form param
         */
        var name = req.body.name;
        var userSchema = userModel.schema('google-user');
        var user = new userSchema({
            provider: 'google',
            id: '111111',
            displayName: name,
            name: {
                familyName: name,
                middleName: 'testing'
            }
        });
        
        /*
         *  a) save
         *  b) if save is ok, query
         */
        user.save(function(err) {
            if (err) {
                res.send('error found: '+err);
            } else {
                // save done, re-query
                userSchema.findOne({ displayName: name }).exec(function(err, googleUser) {
                    if (err) res.send('error found : '+err);
                
                    res.send('done~ saved: > '+googleUser._id);
                });
            }
        });
    });
    
    
    return router;
};

module.exports = createRouter;