
var mongoose = require('mongoose');
var UserAnswer = mongoose.models.UserAnswer;
var Test = mongoose.models.Test;
var Question = mongoose.models.Question;
var Task = mongoose.models.Task;
var constants = require('../consts');
var shuffle = require('knuth-shuffle').knuthShuffle;
var promise = require('bluebird');
var TestChecker = require('../serverAssistance/TestChecker');

'use strict';

class TestAssistant {

	static get Level() {
		return this.level;
	}


	static summarize(userAnswers) {
		return TestChecker.checkAnswers(userAnswers).then(function(userAnswers) {
			var sum = 0;
			userAnswers.forEach(function(userAnswer) {
				sum += userAnswer.questionId.cost;
			});
			return sum;
		});
	}

	static getReadingTest(level) {
		this.level = level;
		let arrayPromises = [];
		let data = [];
		return Task.find({}).populate('parentTaskId')
			.then( function(tasks) {
				var filteredTasksByTopic = TestAssistant.getTasksById(tasks, constants.READING_ID);
				var task = TestAssistant.getTaskByLevel(filteredTasksByTopic, level)[0];
				let tasksByParentTask = TestAssistant.getTasksById(tasks, task._id);
				tasksByParentTask.forEach(function(task) {
					arrayPromises.push(TestAssistant.getQuestionsByTask(task).then(function(question){
						Array.prototype.push.apply(data, question);
					}));
				});
				return promise.all(arrayPromises).then(function() {
					return data;
				});
			})
	}


	static getLexicalGrammarTest() {
		return Task.find({}).populate('parentTaskId', 'title')
		.then(function(tasks) {
			var filteredTasksByTopic = TestAssistant.getTasksById(tasks, constants.LEXICAL_GRAMMAR_ID);
			return TestAssistant.getQuestionsByTask(filteredTasksByTopic[0])
			.then(function(questions) {
				var questionsByRandomTask = TestAssistant.getAllQuestionsByRandomTask(questions);
				var resultQuestions = TestAssistant.getAllQuestionsByLevels(questionsByRandomTask, constants.LEVELS);

				return resultQuestions;
			});
		});
	}


	static getListeningTest() {
		var that = this;
		return Task.find({}).populate('parentTaskId')
			.then( function(tasks) {
				let arrayPromises = [];
				let data = [];
				var filteredTasksByTopic = TestAssistant.getTasksById(tasks, constants.LISTENING_ID);
				var task = TestAssistant.getTaskByLevel(filteredTasksByTopic, 'B1')[0];
				let tasksByParentTask = TestAssistant.getTasksById(tasks, task._id);
				tasksByParentTask.forEach(function(task) {
					arrayPromises.push(TestAssistant.getQuestionsByTask(task).then(function(question){
						Array.prototype.push.apply(data, question);
					}));
				});
				return promise.all(arrayPromises).then(function() {
					return data;
				});
			})
	}

	static getSpeakingTest() {
		var that = this;
		return Task.find({}).populate('parentTaskId')
			.then( function(tasks) {
				var filteredTaskByTopic = TestAssistant.getTasksById(tasks, constants.SPEAKING_ID)[0];
				return TestAssistant.getQuestionsByTask(filteredTaskByTopic)
					.then(function(questions) {
						return TestAssistant.getAllQuestionsByLevels(questions, ['B1']);
					});
			});
	}


static getRandomArray(questions, timesToGenerate) {
	return shuffle(questions.slice(0)).slice(0, timesToGenerate);
}

static getRandomIndex(length) {
	return Math.floor(Math.random()*length);
}

static getAllQuestionsByLevels(questions, levels) {
	let resultQuestions = [];

	levels.forEach(function(level) {
		let array = [];

		questions.forEach(function(question){
			if (question.level == level) {
				array.push(question);
			}
		});
		Array.prototype.push.apply(resultQuestions, TestAssistant.getRandomArray(array, 2));
	});

	return resultQuestions;
}

static getTaskByLevel(tasks, level) {
	let allTasks = [];

	tasks.forEach(function(task) {
		if (task.level) {
			if (task.level.toString() == level) {
				allTasks.push(task);
			}
		}
	});

	let task = TestAssistant.getRandomArray(allTasks, 1);

	return task;
}

static getAllQuestionsByRandomTask(questions) {
	let filteredQuestionsByTask = [];

	let randomTaskId = questions[TestAssistant.getRandomIndex(questions.length)].taskId;

	questions.forEach(function(question) {

		if (question.taskId.toString() == randomTaskId.toString()) {
			filteredQuestionsByTask.push(question);
		}
	});

	return filteredQuestionsByTask;
}


static getTasksById(tasks, taskId) {
			var resultTasks = [];
			tasks.forEach(function(task) {
				if (task.parentTaskId) {
					if (task.parentTaskId._id.toString() == taskId.toString()) {
						resultTasks.push(task);
					}
				}
			});
			return resultTasks;
		}

static getQuestionsByTask(task) {
			return Question.find({}).populate('taskId').populate('answersId')
			.then(function(questions) {
				let resultQuestions = [];
				questions.forEach(function(question) {
					if (question.taskId._id.toString() == task._id) {
						if (task.parentTaskId) {
							question.taskId.parentTaskId = task.parentTaskId;
						}
						resultQuestions.push(question);
					}
				});
				return resultQuestions;
			});
		}


}

module.exports = TestAssistant;