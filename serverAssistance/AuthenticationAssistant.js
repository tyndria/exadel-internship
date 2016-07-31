var mongoose  = require('mongoose');

var User = mongoose.models.User;

module.exports = (roles) => {
	return (req, res, next) => {
		return User.findOne({token: req.headers.authorization})
		.then(function(user) {
			var isAuthorizated = false;
			roles.forEach(function(role) {
				if (user.role.toString() == role) {
					console.log("user.role:" + user.role + ":" + role);
					isAuthorizated = true;
				}
			});
			if(isAuthorizated)
				return next();
			else
				return res.sendStatus(401);
		});
	}
};
