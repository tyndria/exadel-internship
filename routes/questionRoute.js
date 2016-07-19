var router = require('express').Router();

var mongoose  = require('mongoose');

var Question = mongoose.models.Question;

router.post('/', function(req, res) {
	var newQuestion = new Question(req.body);

	newQuestion.save(function(err) {
		if (err) {
			return res.send(err);
		}
		else {
			return res.json(newQuestion);
		}
	});

});

router.get('/', function (req, res) {
	var query = Question.find({});

	query.select('-__v');

	query.exec(function(err, questions) {
		if (err) {
			return res.send(err);
		}

		else {
    		return res.json(questions);
    	}
	});
});

router.get('/:id', function(req, res) {
	Question.findById(req.params.id, function(err, questions) {
		if (err) {
           res.send(err);
		}

		res.send(questions);
	});
});

module.exports = router;