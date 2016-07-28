var router = require('express').Router();  
var mongoose  = require('mongoose');
var constants = require('../consts');

var User = mongoose.models.User;

var hash = require('../hashFunction');
var authentication = require('../serverAssistance/AuthenticationAssistant');

router.post('/', authorization, authentication(constants.USER_ROLE), function (req, res) {
	res.status(200).send(res);
});

function authorization(req, res, next) {
	var token = hash(req.body.user.email + req.body.user.password);
	console.log(token);
	return User.findOne({token: token.toString()}).then( function(user) {
		console.log(user);
		if (user) {
			req.headers.authorization = token;
			res.success = true;
			res.auth_token = token;
			return next();
		} else {
			next(new Error("no authorization"));
		}
	}, next());
}


// AAAAAAAA!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
module.exports = router;