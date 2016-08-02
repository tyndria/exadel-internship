var router = require('express').Router();  
var mongoose  = require('mongoose');
var constants = require('../consts');

var User = mongoose.models.User;

var hash = require('../hashFunction');
var authentication = require('../serverAssistance/AuthenticationAssistant');

router.post('/', authorization, authentication([constants.USER_ROLE, constants.ADMIN_ROLE, constants.TEACHER_ROLE), function (req, res) {
	res.status(200).send(req.body);
});

function authorization(req, res, next) {
	var token = hash(req.body.user.email + req.body.user.password);
	console.log(token);
	return User.findOne({token: token.toString()}).then( function(user) {
		console.log(user);
		if (user) {
			req.headers.authorization = token;
			req.body.success = true;
			req.body.auth_token = token;
			req.body.role = user.role;
			return next();
		} else {
			next(new Error("no authorization"));
		}
	});
}


// AAAAAAAA!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
module.exports = router;
