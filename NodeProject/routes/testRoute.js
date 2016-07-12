var router = require('express').Router();

var constants = require('../consts');

var mongoose = require('mongoose');

var Test = mongoose.models.Test;
var Topic = mongoose.models.Topic;
var Question = mongoose.models.Question;



router.post('/', function(req, res) {
	var candidateId = req.body.candidateId;

	var newTest = new Test({
		candidateId: mongoose.Types.ObjectId(candidateId)
	});
		
	newTest.save(function(err) {
		if (err) {
			res.send(err);
		}

		res.json(newTest);
	});
});



router.get('/:id/startTest', function(req, res) {

	function getLexicalGrammarTest(test) {

		Question.find({}).limit(2).exec(function(err, results){
			test.questions = results.map(function(question) {
				return question._id;
			})

			test.questions = results;
			res.json(test);

			test.save(function(err) {
				if (err) {
					res.send(err);
				}
			});
		});
	}

	Test.find({candidateId: req.params.id}, function(err, tests) {

		if (err) {
           res.send(err);
		}

		getLexicalGrammarTest(tests[0]);
	
	});
});
 


router.get('/:id/getReadingTest', function(req, res) {

	var READING_ID = constants.READING_ID;


	Test.find({candidateId: req.params.id}, function(err, tests) {

		if (err) {
           res.send(err);
		}

		Question.find({topic: mongoose.Types.ObjectId(READING_ID)}, function(err, questions) {

			if (err) {
           		res.send(err);
			}

			Array.prototype.push.apply(tests[0], questions);

			res.json(questions);


		});

		tests[0].save(function(err) {
				if (err) {
					res.send(err);
				}
		});
	
	});
});

router.get('/:id/getListeningTest', function(req, res) {
	
});

module.exports = router;