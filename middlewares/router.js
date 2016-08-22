/* ************************ */
/*  require dependencies    */
/* ************************ */

var express = require('express');

/* **************** */
/*  router object   */
/* **************** */

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


/* ************************************ */
/*  export the router object for re-use */
/* ************************************ */

module.exports = router;
