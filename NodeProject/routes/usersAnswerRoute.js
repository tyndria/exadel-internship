var router = require('express').Router();  

var mongoose  = require('mongoose');

mongoose.model('UsersAnswer', require('../modules/usersAnswer')); 

router.post('/create', function(req, res) {
	var newUsersAnswer = new UsersAnswer(req.body);

	newUsersAnswer.save(function(err) {
		if (err) {
			res.send(err);
		}

		res.send(newUsersAnswer);
	}); 

});

module.exports = router;
