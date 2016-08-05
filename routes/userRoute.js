var router = require('express').Router();  
var authentication = require('../serverAssistance/AuthenticationAssistant');
var constants = require('../consts');
var mongoose  = require('mongoose');

var User = mongoose.models.User;


// req.headers.authorization
router.post('/',  function(req, res) {
	
	var newUser = new User(req.body.user);

	newUser.role = 3;
	newUser.photo = Math.floor(Math.random()*100)%4 + '.jpeg'; 

	newUser.save(function(err) {
		if (err) {
			res.send(err);
		}

		res.send(newUser);
	}); 

});

//change the role
router.put('/:id', authentication([constants.ADMIN_ROLE]), function(req, res) {
	User.findById(req.params.id, function(err, user) {
		if (err)
			res.send(err);
		user.role = req.body.role;

		user.save(function(err) {
			if (err)
				res.send(err);
			res.send(user);
		});
	})
}); 


router.get('/role/:role', authentication([constants.ADMIN_ROLE]), function (req, res) {
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

router.get('/:id', authentication([constants.ADMIN_ROLE]), function(req, res) {
	User.findById(req.params.id, function(err, user) {
		if (err) {
           res.send(err);
		}
		else{
			res.send(user);
		}
	});
});

module.exports = router;