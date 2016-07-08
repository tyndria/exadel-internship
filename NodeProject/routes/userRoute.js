var router = require('express').Router();  

var mongoose  = require('mongoose');
mongoose.model('User', require('../modules/user')); 
var User = mongoose.models.User;

router.post('/', function(req, res) {
	var newUser = new User(req.body);

	newUser.save(function(err) {
		if (err) {
			res.send(err);
		}

		res.send(newUser);
	}); 

});


router.get('/', function (req, res) {
	var query = User.find({});

	query.select('-__v');

	query.exec(function(err, users ) {
		if (err) { 
			res.send(err);
		}

    	res.json(users); 
	});
});

router.get('/:id', function(req, res) {
	User.findById(req.params.id, function(err, user) {
		if (err) {
           res.send(err);
		}

		res.send(user);
	});
});

module.exports = router;