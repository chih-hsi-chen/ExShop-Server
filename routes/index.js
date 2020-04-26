var express = require('express');
var router = express.Router();
var passport = require('passport');

const ensureAuthenticated = function (req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.status(200).send({
		logstatus: false,
		uid: 'guest',
		times: 1,
	});
}

/* GET home page. */
router.get('/home', ensureAuthenticated, function (req, res, next) {

	res.status(200).send({
		logstatus: true,
		uid: req.user.username,
		times: req.session.times,
	});
});
router.get('/signout', function (req, res, next) {
	req.logout();
	req.session.username = '';
	req.session.times = 1;

	res.redirect('/');
});


router.post('/signin',
	function (req, res, next) {
		passport.authenticate('login', function (err, user, info) {
			if (err) { return next(err); }
			if (!user) { 
				return res.status(200).send({
					message: 'login fail',
					user: false,
					info,
				});
			}

			req.logIn(user, function (err) {
				if (err) { return next(err); }
				const { username } = req.body;

				if (req.session.username === username) {
					req.session.times++;
				} else {
					req.session.username = username;
					req.session.times = 1;
				}

				return res.status(200).send({
					message: 'login success',
					user: {
						username: req.user.username,
					}
				});
			});
		})(req, res, next);
	}
);
router.post('/signup',
	passport.authenticate('signup', { failureRedirect: '/signup' }),
	function (req, res) {
		req.session.times = 1;
		req.session.username = req.body.username;
		res.redirect('/home');
	}
);

module.exports = router;
