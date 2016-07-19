var router = require('express').Router();
var constants = require('../consts');
var mongoose = require('mongoose');
var promise = require('bluebird');
var shuffle = require('knuth-shuffle').knuthShuffle;
var mongodb = require("mongodb");
var Engine = require('../serverAssistance/Engine');

var Test = mongoose.models.Test;
var Question = mongoose.models.Question;
var Task = mongoose.models.Task;

router.get('/', function (req, res) {
	var query = Test.find({}).populate('questionsId');

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


router.get('/:id/startTest', function(req, res) {

	Test.find({candidateId: req.params.id}, function(err, tests) {

		let engine = new Engine(tests[0]._id);

		tests[0].questionsId = [];
		engine.getLexicalGrammarTest().then(function(questions) {
			questions.forEach(function(question) {
				tests[0].questionsId.push(question._id);
			});

			tests[0].save(function(err) {
				if (err) {
					res.send(err);
				}
				res.json(tests[0]);
			});

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

        	/*questions.forEach(function(question) {
				tests[0].questionsId.push(question._id);
			});*/

			tests[0].save(function(err) {
				if (err) {
					res.send(err);
				}
				res.json(tests[0]);
			});

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
        	questions.forEach(function(question) {
				tests[0].questionsId.push(question._id);
			});

			tests[0].save(function(err) {
				if (err) {
					res.send(err);
				}
				res.json(tests[0]);
			});
        });

	});
});




router.get('/:id/getSpeakingTest', function(req, res) {
	Test.find({candidateId: req.params.id}, function(err, tests) {
		let engine = new Engine(tests[0]._id);


		if (err) {
        	res.send(err);
        }

        engine.getSpeakingTest().then(function(questions) {
        	questions.forEach(function(question) {
				tests[0].questionsId.push(question._id);
			});

			tests[0].save(function(err) {
				if (err) {
					res.send(err);
				}
				res.json(tests[0]);
			});
        });
	});
});



module.exports = router;