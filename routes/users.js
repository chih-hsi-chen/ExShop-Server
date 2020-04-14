var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET users listing. */
router.get('/', function (req, res, next) {
	res.redirect('/signin.html');
});

router.post('/login',
	passport.authenticate('local', { failureRedirect: '/' }),
	// if authenticate success, then call below function
	function(req, res) {
		res.redirect('/loggedin.html');
	}
);

module.exports = router;
