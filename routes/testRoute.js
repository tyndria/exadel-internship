var router = require('express').Router();
var constants = require('../consts');
var mongoose = require('mongoose');
var promise = require('bluebird');
var shuffle = require('knuth-shuffle').knuthShuffle;
var mongodb = require("mongodb");
var TestAssistant = require('../serverAssistance/TestAssistant');

var Test = mongoose.models.Test;
var Question = mongoose.models.Question;
var Task = mongoose.models.Task;

router.get('/', function (req, res) {
	var query = Test.find({}).populate('questionsId').populate('userAnswersId');

	query.select('-__v');

	query.exec(function(err, tests) {
		if (err) {
			res.send(err);
		}

		else {
    		res.send(tests);
    	}
	});
});

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


/*router.get('/:id/:seqNumber', function(req, res) {

	Test.findById({candidateId: req.params.id}, function(err, tests) {
		if (err) {
			res.send(err);
		}
		if (req.params.seqNumber > tests.length + 1)
			res.send("bad request");

		res.send(tests[req.params.seqNumber - 1]);
	});
});*/

router.get('/:id/startTest', function(req, res) {

	Test.find({candidateId: req.params.id}, function(err, tests) {

		console.log(tests);
		var CURRENT_TEST = tests.length - 1;

		tests[CURRENT_TEST].questionsId = [];

		TestAssistant.getLexicalGrammarTest().then(function(questions) {
			questions.forEach(function(question) {
				tests[CURRENT_TEST].questionsId.push(question._id);
			});

			tests[CURRENT_TEST].save(function(err) {
				if (err) {
					res.send(err);
				}
				res.json(questions);
			});

        });
	});
});


router.get('/:id/getReadingTest/', function(req, res) {

	Test.find({candidateId: req.params.id}, function(err, tests) {
			if (err) {
	        	res.send(err);
	        }

			var CURRENT_TEST = tests.length - 1;

			var userAnswers = tests[CURRENT_TEST].userAnswersId;
		
			TestAssistant.summarize(userAnswers).then(function(sum) {

				tests[CURRENT_TEST].resultLexicalGrammarTest = sum;
			
				var level = 'B1';
				TestAssistant.getReadingTest(level).then(function(questions) {

		        	questions.forEach(function(question) {
						tests[CURRENT_TEST].questionsId.push(question._id);
					});

					tests[CURRENT_TEST].save(function(err) {
						if (err) {
							res.send(err);
						}
						res.json(questions);
					});

	        	});
			});
	});
});


router.get('/:id/getListeningTest', function(req, res) {
	Test.find({candidateId: req.params.id}, function(err, tests) {

		var CURRENT_TEST = tests.length - 1;

		if (err) {
        	res.send(err);
        }

        TestAssistant.getListeningTest().then(function(questions) {
        	questions.forEach(function(question) {
				tests[CURRENT_TEST].questionsId.push(question._id);
			});

			tests[CURRENT_TEST].save(function(err) {
				if (err) {
					res.send(err);
				}
				res.json(questions);
			});
        });

	});
});




router.get('/:id/getSpeakingTest', function(req, res) {
	Test.find({candidateId: req.params.id}, function(err, tests) {

		var CURRENT_TEST = tests.length - 1;

		if (err) {
        	res.send(err);
        }

        TestAssistant.getSpeakingTest().then(function(questions) {
        	questions.forEach(function(question) {
				tests[CURRENT_TEST].questionsId.push(question._id);
			});

			tests[CURRENT_TEST].save(function(err) {
				if (err) {
					res.send(err);
				}
				res.json(questions);
			});
        });
	});
});



module.exports = router;