	var mongoose = require('mongoose');
	var Test = mongoose.models.Test;
	var Question = mongoose.models.Question;
	var UserAnswer = mongoose.models.UserAnswer;
'use strict'

module.exports = class TestChecker {

	static getUserAnswers(id) {
		return Test.findById(id).populate({path: 'userAnswersId', 
									populate: {path: 'questionId', 														
									populate: {path: 'answersId'}}})
		.then(function(test) {
			return test.userAnswersId;
		});
	}

	static getCorrectAnswer(userAnswer) {
		var correctAnswer = {};
			userAnswer.questionId.answersId.forEach(function(answer) {
				if (answer.isCorrect.toString() == "true") {
					correctAnswer = answer;
				}
			});
		return correctAnswer;
	}


	static saveTest() {
		return Test.findById(this.testId)
		.then(function(test) {
			return test.save();
		});
	}


	static checkAnswers(id) {
		return TestChecker.getUserAnswers(id).then(function(userAnswers) {
			userAnswers.forEach(function(userAnswer) {
				let answer = TestChecker.getCorrectAnswer(userAnswer);
				if (userAnswer.answer.toString() == TestChecker.getCorrectAnswer(userAnswer).text.toString()) {
					userAnswer.isCorrect = true;
				}
			});
			return userAnswers;
		});
	}

	static summarize(testId) {
		var id = testId;
		return TestChecker.checkAnswers(id).then(function(userAnswers) {
			var sum = 0;
			userAnswers.forEach(function(userAnswer) {
				sum += userAnswer.questionId.cost;
			});
			return sum;
		});
	}
}