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

router.get('/test-session', function(req, res) {
    res.send('inside test-session route~');
});

module.exports = router;
