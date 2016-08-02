	var mongoose = require('mongoose');
	var Test = mongoose.models.Test;
	var Question = mongoose.models.Question;
	var UserAnswer = mongoose.models.UserAnswer;
	var promise = require('bluebird');
'use strict'

module.exports = class TestChecker {

	static getCorrectAnswer(userAnswer) {
		var correctAnswer = {};
		userAnswer.questionId.answersId.forEach(function(answer) {
			if (answer.isCorrect.toString() == "true") {
				correctAnswer = answer;
			}
		});
		return correctAnswer;
	}

	static checkAnswers(userAnswersId) {
		var promises = [];
		var promisesUsersAnswers = [];
		var userAnswers = [];
		var answers = [];

		userAnswersId.forEach(function(userAnswer) {
			promisesUsersAnswers.push(UserAnswer.findById(userAnswer).populate({path: 'questionId', 
										populate: {path: 'answersId'}}).then(function(userAnswer) {
				userAnswers.push(userAnswer);
			}));
		});

		return promise.all(promisesUsersAnswers).then(function(){
			userAnswers.forEach(function(userAnswer){
				console.log(userAnswer.answer.toString() + ":" + TestChecker.getCorrectAnswer(userAnswer).text.toString());
				if(userAnswer.answer.toString() == TestChecker.getCorrectAnswer(userAnswer).text.toString()) {
					userAnswer.isCorrect = true;
					userAnswer.cost = userAnswer.questionId.cost;
					promises.push(userAnswer.save().then(function() { answers.push(userAnswer);}))
				}
			});

			return promise.all(promises).then(function() {
				return answers;
			});
		});
		
	}
}