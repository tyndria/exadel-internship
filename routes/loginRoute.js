var router = require('express').Router();  
var mongoose  = require('mongoose');

var User = mongoose.models.User;

var hash = require('../hashFunction');

router.post('/', authorization,  function (req, res) {
	var user = req.body.user;
	switch(user.role.toString()) {
		case "0":
			res.sendStatus(200);
			break;
		case "1":
			res.sendStatus(200);
			break;
		case "2":
			res.sendStatus(200);
			break;
		case "-1":
			res.sendStatus(401)
			break;
	}
});

function authorization(req, res, next) {
	var token = hash(req.body.login + req.body.password);
	return User.findOne({token: token.toString()}).then(function(user) {
		if (user) {
			req.body.user = user;
			return next();
		} else {
			return next(new Error("no authorization"));
		}

	});
}

/*function authentication(req, res) {
	var user = req.body.user;
	switch(user.role.toString()) {
		case "0":
			res.redirect('http://localhost:8083/api/users');
			break;
		case "1":
			res.redirect('https://www.google.by/');
			break;
		case "2":
			res.redirect('/some url for admin');
			break;
		case "-1":
			/// ?
			break;
	}
}*/


module.exports = router;