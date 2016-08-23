/**
 *  testing purpose, exports a function to create the testing-router
 */
var createRouter = function(express) {
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
    
    return router;
};

module.exports = createRouter;