var router = require('express').Router();

var mongoose  = require('mongoose');

var Answer = mongoose.models.Answer;

router.post('/', function(req, res) {
	var newAnswer = new Answer(req.body);

	newAnswer.save(function(err) {
		if (err) {
			res.send(err);
		}

		res.send(newAnswer);
	});
});

router.get('/', function (req, res) {
	Answer.find({},function(err,answers){
		if (err) {
			res.send(err);
		}
		res.json(answers);
    });
});

module.exports = router;