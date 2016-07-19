 var router = require('express').Router();

var mongoose  = require('mongoose');

router.post('/create', function(req, res) {
	var newUsersAnswer = new UsersAnswer(req.body);

	newUsersAnswer.save(function(err) {
		if (err) {
			res.send(err);
		}

		res.json(newUsersAnswer);
	});

});

module.exports = router;
