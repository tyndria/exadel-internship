


//  I have an idea to make method "getLevel()" static and do like this:
//	var level = TestChecker.getLevel(testId); 

class TestChecker {

	var mongoose = require('mongoose');
	var Test = mongoose.models.Test;
	var Question = mongoose.models.Question;
	var UserAnswer = mongoose.models.UserAnswer;


	constructor(testId) {
		this.testId = testId;
	}


	function getUserAnswers() {
		Test.findById(this.testId).populate({path: 'userAnswersId', 
									populate: {path: 'questionId', 														
									populate: {path: 'answersId'}}})
		.then(function(test) {
			return test.userAnswersId;
		});
	}

	function getCorrectAnswer(userAnswer) {
			userAnswer.questionId.answersId.forEach(function(answer) {
				if (answer.isCorrect) {
					return answer;
				}
			});
	}


	function saveTest() {
		Test.findById(this.testId).
		.then(function(test) {
			test.save();
	}


	function checkAnswers() {
		var userAnswers = getUserAnswers();
		userAnswers.forEach(function(userAnswer) {
			if (userAnswer.answer == getCorrectAnswer(userAnswer)) {
				userAnswer.isCorrect = true;
			}
		});
	}

	saveTest();
	/*function getLevel() { //get

		checkAnswers();

		var sum = 0;
		var userAnswers = getUserAnswers();
		userAnswers.forEach(function (answer) {
			if (answer.isCorrect) {
				sum += answer.questionId.cost;
			}
		});
		return sum;
	}
*/
}