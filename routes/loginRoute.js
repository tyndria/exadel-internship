var router = require('express').Router();  
var mongoose  = require('mongoose');
var constants = require('../consts');

var User = mongoose.models.User;

var hash = require('../hashFunction');
var authentication = require('../serverAssistance/AuthenticationAssistant');

router.post('/', authorization, authentication(constants.USER_ROLE), function (req, res) {
	res.status(200).send(req.body.user.token);
});

function authorization(req, res, next) {
	var token = hash(req.body.login + req.body.password);
	return User.findOne({token: token.toString()}).then(function(user) {
		if (user) {
			req.body.token = token;
			return next();
		} else {
			return next(new Error("no authorization"));
		}
	});
}

module.exports = router;