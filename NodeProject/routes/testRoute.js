var router = require('express').Router();
var constants = require('../consts');
var mongoose = require('mongoose');
var promise = require('bluebird');
var shuffle = require('knuth-shuffle').knuthShuffle;
var mongodb = require("mongodb");
var Engine = require('../Engine');

var Test = mongoose.models.Test;
var Question = mongoose.models.Question;
var Task = mongoose.models.Task;

router.get('/', function (req, res) {
	var query = Test.find({});

	query.select('-__v');

	query.exec(function(err, tests) {
		if (err) {
			return res.send(err);
		}

		else {
    		return res.json(tests);
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


router.get('/:id/startTest', function(req, res) {

	Test.find({candidateId: req.params.id}, function(err, tests) {

		let engine = new Engine(tests[0]._id);

		engine.getLexicalGrammarTest().then(function(questions) {
			console.log(questions);
        	Array.prototype.push.apply(tests[0].questionsId, questions);

			tests[0].save(function(err) {
				if (err) {
					res.send(err);
				}
			});
		 	res.json(questions);

        });
	});
});


router.get('/:id/getReadingTest/', function(req, res) {

	Test.find({candidateId: req.params.id}, function(err, tests) {
		let engine = new Engine(tests[0]._id);

		if (err) {
        	res.send(err);
        }

        engine.getReadingTest().then(function(questions) {
        	Array.prototype.push.apply(tests[0].questionsId, questions);

			tests[0].save(function(err) {
				if (err) {
					res.send(err);
				}
			});
		 	res.json(questions);

        });
	});
});



router.get('/:id/getListeningTest', function(req, res) {
	Test.find({candidateId: req.params.id}, function(err, tests) {
		let engine = new Engine(tests[0]._id);

		if (err) {
        	res.send(err);
        }

        engine.getListeningTest().then(function(questions) {
        	Array.prototype.push.apply(tests[0].questionsId, questions);

			res.json(result);

			tests[0].save(function(err) {
				if (err) {
					res.send(err);
				}
			});
        });

	});
});




router.get('/:id/getSpeakingTest', function(req, res) {
	var level = 'B2';

	Task.find({}).populate('parentTaskId')
		.then( function(tasks) {
			return getTasksById(tasks, constants.SPEAKING_ID)[0];
		})
		.then(function(task) {
			return getQuestionsByTask(task);
		})
		.then (function(questions) {
			var filteredQuestionsByLevel = getAllQuestionsByLevels(questions, [level]);
			Test.find({candidateId: req.params.id}, function(err, tests) {

				if (err) {
        			res.send(err);
        		}

        		Array.prototype.push.apply(tests[0].questionsId, filteredQuestionsByLevel);

				res.json(filteredQuestionsByLevel);

				tests[0].save(function(err) {
					if (err) {
						res.send(err);
					}
				});
			});
		});
});



module.exports = router;