var router = require('express').Router();  
var mongoose  = require('mongoose');
var constants = require('../consts');

var User = mongoose.models.User;

var hash = require('../hashFunction');
var authentication = require('../serverAssistance/AuthenticationAssistant');

router.post('/', authorization, authentication([constants.USER_ROLE, constants.ADMIN_ROLE]), function (req, res) {
	res.status(200).send(res);
});

function authorization(req, res, next) {
	var token = hash(req.body.user.email + req.body.user.password);
	console.log(token);
	return User.findOne({token: token.toString()}).then( function(user) {
		console.log(user);
		if (user) {
			req.headers.authorization=token;
			console.log("шмотки "+req.headers.authorization);
			res.body.success = true;
			console.log("подождут "+res.body.success);
			res.body.auth_token = token;
			console.log("тем более не звонили "+res.body.success);
			return next();
		} else {
			next(new Error("no authorization"));
		}
	});
}


// AAAAAAAA!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
module.exports = router;
