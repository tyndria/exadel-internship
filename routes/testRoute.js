var router = require('express').Router();
var authentication = require('../serverAssistance/AuthenticationAssistant');
var constants = require('../consts');
var mongoose = require('mongoose');
var promise = require('bluebird');
var shuffle = require('knuth-shuffle').knuthShuffle;
var mongodb = require("mongodb");
var TestAssistant = require('../serverAssistance/TestAssistant');
var ObjectId = mongoose.Types.ObjectId;

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

router.get('/isPassed', function (req, res) {
	var query = Test.find({});

	query.select('__id');

	query.exec(function(err, tests) {
		if (err) {
			res.send(err);
		}

		else {
			console.log(tests);
    		res.send(tests);
    	}
	});
});


router.post('/:reviewerId', authentication([constants.ADMIN_ROLE]), function(req, res) {
	var testsId = req.body.testsId;

	testsId.forEach(function(testId) {
		console.log(testId);
		Test.findById(ObjectId(testId), function(err, test) {
			test.reviewerId = req.params.reviewerId;

			test.save(function(err) {
				if (err)
					res.send(err);
				res.send(test);
			});
		});
	});

});


router.post('/', authentication([constants.ADMIN_ROLE]), function(req, res) {

	var newTest = new Test({
		candidateId: mongoose.Types.ObjectId(req.body.candidateId),
		startTime: req.body.startTime,
		finishTime: req.body.finishTime,
		duration: req.body.duration
	});

	newTest.save(function(err) {
		if (err) {
			res.send(err);
		}

		res.json(newTest);
	});
});


router.get('/:id/startTest', authentication([constants.USER_ROLE]), function(req, res) {

	Test.find({candidateId: req.params.id}, function(err, tests) {
		var objectsToSend = [];

		var CURRENT_TEST = tests.length - 1;

		tests[CURRENT_TEST].questionsId = [];

		TestAssistant.getLexicalGrammarTest().then(function(questions) {
			questions.forEach(function(question) {
				tests[CURRENT_TEST].questionsId.push(question._id);

				var object = {};
				object.answersId = [];
				object.description = question.description;
				object.questionType = question.questionType;
				object.title = question.taskId.title;
				object.questionId = question._id;

				question.answersId.forEach(function(answer) {
					object.answersId.push(answer.text);
				});

				objectsToSend.push(object);
			});

			tests[CURRENT_TEST].save(function(err) {

				if (err) {
					console.log("err", err)
					res.send(err);
				}
				res.json(objectsToSend);
			});

        });
	});
});


router.get('/:id/getReadingTest/', authentication([constants.USER_ROLE]), function(req, res) {

	Test.find({candidateId: req.params.id}, function(err, tests) {
			if (err) {
	        	res.send(err);
	        }

			var CURRENT_TEST = tests.length - 1;

			var userAnswers = tests[CURRENT_TEST].userAnswersId;
		
			/*TestAssistant.summarize(userAnswers).then(function(sum) {*/

				//tests[CURRENT_TEST].resultLexicalGrammarTest = sum;
			
				var level = 'B1';
				TestAssistant.getReadingTest(level).then(function(questions) {

					let objectToSend = {};
				
					objectToSend.textTitle = questions[0].taskId.parentTaskId.title;
					objectToSend.text = questions[0].taskId.parentTaskId.description;
					objectToSend.questions = [];
					
		        	questions.forEach(function(question) {
		        		let object = {};
		        		object.title = question.taskId.title;
		        		object.description = question.description;
		        		object.questionType = question.questionType;
		        		object.questionId = question._id;
		        		object.answersId = [];

		        		question.answersId.forEach(function(answer) {
		        			object.answersId.push(answer.text);
		        		});
		        		objectToSend.questions.push(object);

						tests[CURRENT_TEST].questionsId.push(question._id);
					});

					tests[CURRENT_TEST].save(function(err) {
						if (err) {
							res.send(err);
						}
						res.json(objectToSend);
					});

	        	});
			/*});*/
	});
});


router.get('/:id/getListeningTest', authentication([constants.USER_ROLE]), function(req, res) {
	Test.find({candidateId: req.params.id}, function(err, tests) {

		var CURRENT_TEST = tests.length - 1;

		if (err) {
        	res.send(err);
        }

        var objectToSend = {};
        TestAssistant.getListeningTest().then(function(questions) {

        	objectToSend.textTitle = questions[0].taskId.parentTaskId.title;
			objectToSend.text = questions[0].taskId.parentTaskId.description;
        	objectToSend.questions = []

        	questions.forEach(function(question) {
        		var object = {};
		        object.title = question.taskId.title;
		        object.description = question.description;
		        object.questionType = question.questionType;
		        object.questionId = question._id;
		        object.answersId = [];

		        question.answersId.forEach(function(answer) {
		        	object.answersId.push(answer.text);
		        });

		        objectToSend.questions.push(object);
				tests[CURRENT_TEST].questionsId.push(question._id);
			});

			tests[CURRENT_TEST].save(function(err) {
				if (err) {
					res.send(err);
				}
				res.json(objectToSend);
			});
        });

	});
});




router.get('/:id/getSpeakingTest', authentication([constants.USER_ROLE]), function(req, res) {
	Test.find({candidateId: req.params.id}, function(err, tests) {

		var CURRENT_TEST = tests.length - 1;

		if (err) {
        	res.send(err);
        }

        var objectToSend = [];
        TestAssistant.getSpeakingTest().then(function(questions) {

        	questions.forEach(function(question) {

        		var object = {};
				
				object.description = question.description;
				object.questionType = question.questionType;
				object.title = question.taskId.title;
				object.questionId = question._id;

        		objectToSend.push(object);
        		console.log("object" + object);
				tests[CURRENT_TEST].questionsId.push(question._id);
			});

        	console.log(objectToSend);
			tests[CURRENT_TEST].save(function(err) {
				if (err) {
					res.send(err);
				}
				res.json(objectToSend);
			});
        });
	});
});



module.exports = router;