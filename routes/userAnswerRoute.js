 var router = require('express').Router();

var mongoose  = require('mongoose');
var promise = require('bluebird');

var UserAnswer = mongoose.models.UserAnswer;
var Test = mongoose.models.Test;
var ObjectId = mongoose.Types.ObjectId;

router.post('/:id', function(req, res) {

	Test.find({candidateId: req.params.id}).
	then(function(tests) {
		var promises = []

		var currentTest = tests[0];
		currentTest.userAnswersId = [];

		var userAnswers = req.body.userAnswers;

		userAnswers.forEach(function (userAnswer){
			var newUsersAnswer = new UserAnswer({
				userId: req.params.id,
				testId: currentTest._id,
				questionId: userAnswer.questionId,
				answer: userAnswer.answer
			});

			currentTest.userAnswersId.push(ObjectId(newUsersAnswer._id));
			promises.push(newUsersAnswer.save().then(function(err) {
				if (err) console.log(err);
			}));
		});


		promise.all(promises).then(function() {
			currentTest.save(function() {
				console.log(currentTest);
			})
		});

	});

});

module.exports = router;
