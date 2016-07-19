
var mongoose = require('mongoose');
var UserAnswer = mongoose.models.UserAnswer;
var Test = mongoose.models.Test;
var Question = mongoose.models.Question;
var Task = mongoose.models.Task;
var constants = require('../consts');
var shuffle = require('knuth-shuffle').knuthShuffle;
var promise = require('bluebird');
var TestChecker = require('../TestChecker');

'use strict';

class Engine {

	constructor(testId) {
		this.testId = testId;
	}


	static get Level() {
		return this.level;
	}


	getReadingTest() {
		var testChecker = new TestChecker(this.testId);
		return testChecker.summarize().then(function(level) {
			let levelDef = 'B1';
			console.log("level:" + level);
			let arrayPromises = [];
			let data = [];
			return Task.find({}).populate('parentTaskId')
				.then( function(tasks) {
					var filteredTasksByTopic =  Engine.getTasksById(tasks, constants.READING_ID);
					var task = Engine.getTaskByLevel(filteredTasksByTopic, levelDef)[0];
					let tasksByParentTask = Engine.getTasksById(tasks, task._id);
					tasksByParentTask.forEach(function(task) {
						arrayPromises.push(Engine.getQuestionsByTask(task).then(function(question){
							Array.prototype.push.apply(data, question);
						}));
					});
					return promise.all(arrayPromises).then(function() {
						return data;
					});
				})
		});

	}


	getLexicalGrammarTest() {
		return Task.find({}).populate('parentTaskId', 'title')
		.then(function(tasks) {
			var filteredTasksByTopic = Engine.getTasksById(tasks, constants.LEXICAL_GRAMMAR_ID);
			return Engine.getQuestionsByTask(filteredTasksByTopic[0])
			.then(function(questions) {
				var questionsByRandomTask = Engine.getAllQuestionsByRandomTask(questions);
				var resultQuestions = Engine.getAllQuestionsByLevels(questionsByRandomTask, constants.LEVELS);

				return resultQuestions;
			});
		});
	}


	getListeningTest() {
		let level = 'B1';
		let arrayPromises = [];
		let data = [];
		return Task.find({}).populate('parentTaskId')
			.then( function(tasks) {
				var filteredTasksByTopic =  Engine.getTasksById(tasks, constants.LISTENING_ID);
				var task = Engine.getTaskByLevel(filteredTasksByTopic, level)[0];
				let tasksByParentTask = Engine.getTasksById(tasks, task._id);
				tasksByParentTask.forEach(function(task) {
					arrayPromises.push(Engine.getQuestionsByTask(task).then(function(question){
						Array.prototype.push.apply(data, question);
					}));
				});
				return promise.all(arrayPromises).then(function() {
					return data;
				});
			})
	}

	getSpeakingTest() {
		var level = 'B1';

		return Task.find({}).populate('parentTaskId')
			.then( function(tasks) {
				var filteredTaskByTopic =  Engine.getTasksById(tasks, constants.SPEAKING_ID)[0];
				return Engine.getQuestionsByTask(filteredTaskByTopic)
					.then(function(questions) {
						return Engine.getAllQuestionsByLevels(questions, [level]);
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
		Array.prototype.push.apply(resultQuestions, Engine.getRandomArray(array, 2));
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

	let task = Engine.getRandomArray(allTasks, 1);

	return task;
}

static getAllQuestionsByRandomTask(questions) {
	let filteredQuestionsByTask = [];

	let randomTaskId = questions[Engine.getRandomIndex(questions.length)].taskId;

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

module.exports = Engine;