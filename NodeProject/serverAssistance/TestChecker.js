	var mongoose = require('mongoose');
	var Test = mongoose.models.Test;
	var Question = mongoose.models.Question;
	var UserAnswer = mongoose.models.UserAnswer;
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

	static checkAnswers(userAnswers) {
		var promises = [];
		userAnswers.forEach(function(userAnswer) {
			let answer = TestChecker.getCorrectAnswer(userAnswer);
			if (userAnswer.answer.toString() == TestChecker.getCorrectAnswer(userAnswer).text.toString()) {
				userAnswer.isCorrect = true;
				promises.push(userAnswer.save().then(console.log("success!")));
			}
		});
		return promises;
	}
}