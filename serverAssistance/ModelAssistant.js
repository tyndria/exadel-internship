var mongoose = require('mongoose');
var constants = require('../consts');
var shuffle = require('knuth-shuffle').knuthShuffle;
var promise = require('bluebird');
var ObjectId = mongoose.Types.ObjectId;
var TestChecker = require('../serverAssistance/TestChecker');

var UserAnswer = mongoose.models.UserAnswer;
var Test = mongoose.models.Test;
var Question = mongoose.models.Question;
var Task = mongoose.models.Task;
var Notifiction = mongoose.models.Notifiction;

'use strict';

class ModelAssistant {

	static createQuestion(question, taskId, questionType, answerType) {

		var newQuestion = new Question({
			taskId: ObjectId(taskId) || null,
			description: question.description || null,
		    level: question.level || null,
			questionType: question.questionType || questionType,
			answerType: question.answerType || answerType,
		    cost: question.cost || constants.MAP_LEVEL_COST[question.level.toString()]
		});

		return newQuestion;
	}

	static createTask(task, parentTaskId) {

		var newTextTask = new Task({
			title: task.title || 'Listen or read the text',
			description: task.description || null,
			parentTaskId: ObjectId(parentTaskId) || null,
			level: task.level || null
		});

		return newTextTask;
	}

	static createUserAnswer(answer, userId, testId){

		var newUsersAnswer = new UserAnswer({
			userId: ObjectId(userId) || null,
			testId: ObjectId(testId) || null,
			questionId: ObjectId(answer.questionId) || null,
			answer: answer.answer || null,
			});
		if (answer.isCorrect) { // for handle posting
			newUsersAnswer.isCorrect = true;
		}
		return newUsersAnswer;
	}
	
}

module.exports = ModelAssistant;