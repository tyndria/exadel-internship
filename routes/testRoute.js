var router = require('express').Router();
var authentication = require('../serverAssistance/AuthenticationAssistant');
var constants = require('../consts');
var mongoose = require('mongoose');
var promise = require('bluebird');
var shuffle = require('knuth-shuffle').knuthShuffle;
var mongodb = require("mongodb");
var TestAssistant = require('../serverAssistance/TestAssistant');
var ObjectId = mongoose.Types.ObjectId;
var promise = require('bluebird');

var Test = mongoose.models.Test;
var Question = mongoose.models.Question;
var Task = mongoose.models.Task;
var Notification = mongoose.models.Notification;
var User = mongoose.models.User;	
var UserAnswer = mongoose.models.UserAnswer;

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


router.post('/:id/isPassed', function(req, res){

	Test.findById(req.params.id).populate('candidateId').then(function(test){
		test.isPassed = true;
		test.candidateId.isPassingTest = false;

		test.candidateId.isPassingTest.save(function(err) {
			if (err) {
				res.send(err);
			} else {
				test.save(function(err, test) {

					saveNotification(req.body.notification).then(function(err) {
						if (err) 
							res.send(err);
						res.sendStatus(200);
					});

				})
			}
		});
	})
});


router.post('/isRequested', function(req, res){

	saveNotification(req.body.notification).then(function(err) {
		if (err)
			res.send(err);
		res.sendStatus(200);
	});
});

router.post('/:id/isChecked', function(req, res){

	Test.findById(req.params.id, function(err, test){
		test.isChecked = true;

		test.save(function(err, test) {

			saveNotification(req.body.notification).then(function(err) {
				if (err) 
					res.send(err);
				res.sendStatus(200);
			});

		})
	})
});


function saveNotification(notification) { // candidateId, event, date

	var newNotification = new Notification(notification);

	return newNotification.save(function(err) {
		if (err) throw err;
	});

};


router.get('/isPassed', function (req, res) { // LEXICAL-GRAMMAR TEST IS PASSED
	var query = Test.find({isPassed: true});

	query.select('__id');

	query.exec(function(err, tests) {
		if (err) {
			res.send(err);
		}
		res.send(tests.filter((test) => !test.reviewerId));
	});
});

router.get('/isChecked', function (req, res) { //  TEST IS PASSED AND  CHECKED
	var query = Test.find({isChecked: true});

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


router.post('/reviewerId/:reviewerId', authentication([constants.ADMIN_ROLE]), function(req, res) {
	var testsId = req.body.testsId;
	var promises = []; 

	testsId.forEach(function(testId) {
		promises.push(
		
			Test.findById(ObjectId(testId), function(err, test) {
				test.reviewerId = req.params.reviewerId;

				test.save(function(err) {
					if (err)
						throw err;
					console.log("success");
				});
			})
		);
	});

	promise.all(promises).then(function() {
		res.sendStatus(200);
	});

});


router.post('/', authentication([constants.ADMIN_ROLE]), function(req, res) {

	var newTest = new Test({
		candidateId: req.body.test.candidateId,
		startTime: req.body.test.startTime,
		finishTime: req.body.test.finishTime,
		duration: req.body.test.duration
	});

	User.findById(req.body.test.candidateId, function(err, user) {
		if (err) {
			res.send(err);
		}
		else {
			user.isPassingTest = true;

			user.save(function(err) {
				if (err) {
					res.send(err);
				}
				else {
					newTest.save(function(err) {
						if (err) {
							res.send(err);
						}

						res.json(newTest);
					});
				}
			});
		}
	});
});

router.get('/assign/:personId', authentication([constants.USER_ROLE, constants.TEACHER_ROLE]), function(req, res) {

	User.findById( req.params.personId).then(function(user){
		console.log("user", user);

		switch(user.role.toString()) {
			case '0':
				Test.find({"candidateId": req.params.personId}).then(function(tests) {
					res.send(tests.filter((test) => !test.isPassed && !test.isBreaked).map((test) => test._id)); 
				});
				break;
			case '1':
				Test.find({"reviewerId": req.params.personId}).then(function(tests) {
					console.log(tests)
					res.send(tests.filter((test) => !test.isChecked && !test.reviewerId).map((test) => test._id));
				});
				break;
		}
	});
});

router.get('/:id/startTest', authentication([constants.USER_ROLE]), function(req, res) {
	console.log("getLexicalGrammarTest");
	Test.find({candidateId: req.params.id}, function(err, tests) {
		var objectsToSend = [];
		console.log("getLexicalGrammarTest");
		var CURRENT_TEST = tests.length - 1;

		tests[CURRENT_TEST].questionsId = [];

		TestAssistant.getLexicalGrammarTest().then(function(questions) {
			questions.forEach(function(question) {
				tests[CURRENT_TEST].questionsId.push(ObjectId(question._id));

				console.log("getLexicalGrammarTest");

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

			console.log(objectsToSend);
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
	console.log("getReadingTest");
	Test.find({candidateId: req.params.id}, function(err, tests) {
		if (err) {
			res.send(err);
		}

		var CURRENT_TEST = tests.length - 1;

		var sum = tests[CURRENT_TEST].testResult['LEXICAL_GRAMMAR_ID'];
		var level = constants.MAP_RESULT(sum);

		console.log("level", level);

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


router.get('/:id/getListeningTest', authentication([constants.USER_ROLE]), function(req, res) {
	Test.find({candidateId: req.params.id}, function(err, tests) {

		var CURRENT_TEST = tests.length - 1;

		if (err) {
			res.send(err);
		}
		
		var sum = tests[CURRENT_TEST].testResult['LEXICAL_GRAMMAR_ID'];
		var level = constants.MAP_RESULT(sum);

		console.log("getListeningTest", level);

		var objectToSend = {};
		TestAssistant.getListeningTest(level).then(function(questions) {

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
		
		var sum = tests[CURRENT_TEST].testResult['LEXICAL_GRAMMAR_ID'];
		var level = constants.MAP_RESULT(sum);

		TestAssistant.getSpeakingTest(level).then(function(questions) {
			console.log("getSpeakingTest", level);

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