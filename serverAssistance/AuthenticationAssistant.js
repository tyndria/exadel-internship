var mongoose  = require('mongoose');

var User = mongoose.models.User;

module.exports = (role) => {
	return function(req, res, next) {
		return User.findOne({token: req.body.token})
		.then(function(user) {
			if (user.role.toString() == role) {
				req.body.user = user;
				return next();
			}
			else {
				return res.sendStatus(401);
			}
		});
	}
};