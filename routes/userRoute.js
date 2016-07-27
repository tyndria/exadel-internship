var router = require('express').Router();  
var authentication = require('../serverAssistance/AuthenticationAssistant');
var constants = require('../consts');
var mongoose  = require('mongoose');

var User = mongoose.models.User;

router.post('/:token/', authentication([constants.ADMIN_ROLE]), function(req, res) {
	var newUser = new User(req.body.user);

	newUser.save(function(err) {
		if (err) {
			res.send(err);
		}

		res.send(newUser);
	}); 

});

router.put('/:token/:id/role/:role', authentication([constants.ADMIN_ROLE]), function(req, res) {
	User.findById(req.params.id, function(err, user) {
		if (err)
			res.send(err);
		user.role = req.params.role;

		user.save(function(err) {
			if (err)
				res.send(err);
			res.send(user);
		});
	})
}); 

router.post('/:token/role/:role', authentication([constants.ADMIN_ROLE]), function(req, res) {
	var newUser = new User(req.body);
	newUser.role = req.params.role;

	newUser.save(function(err) {
		if (err) {
			res.send(err);
		}

		res.send(newUser);
	}); 

});

router.get('/role/:role', function (req, res) {
	var query = User.find({role: req.params.role});

	query.select('-__v');

	query.exec(function(err, users) {
		if (err) { 
			res.send(err);
		}

    	res.json(users); 
	});
});

router.get('/', function (req, res) {
	var query = User.find();

	query.select('-__v');

	query.exec(function(err, users) {
		if (err) { 
			res.send(err);
		}

    	res.json(users); 
	});
});

router.get('/:token/id/:id', authentication([constants.ADMIN_ROLE]), function(req, res) {
	User.findById(req.params.id, function(err, user) {
		if (err) {
           res.send(err);
		}

		res.send(user);
	});
});

module.exports = router;