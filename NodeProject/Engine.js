
var mongoose = require('mongoose');
var UserAnswer = mongoose.models.UserAnswer;
var Test = mongoose.models.Test;
var Question = mongoose.models.Question;
var Task = mongoose.models.Task;
var constants = require('./consts');
var shuffle = require('knuth-shuffle').knuthShuffle;
var promise = require('bluebird');

'use strict';

class Engine {

	constructor(testId) {
		this.testId = testId;
	}


	get Level() {
		return this.level;
	}

	summarize() {
		var sum = 0;
		Test.findById(this.testId).populate({path: 'userAnswersId', 
									populate: {path: 'questionId'}})
		.then(function(test) {
			userAnswers = test.userAnswersId;
			userAnswers.forEach(function(answer) {
				if (answer.isCorrect) {
					sum += answer.questionId.cost;
				}
			});
			this.level = sum;
		});
	}


	getReadingTest() {
		let level = 'B1';
		let arrayPromises = [];
		let data = [];
		return Task.find({}).populate('parentTaskId')
			.then( function(tasks) {
				let	allTasks = tasks;
				let tasks1 =  Engine.getTasksById(tasks, constants.READING_ID);
				let task = Engine.getTaskByLevel(tasks1, level)[0];
				let tasks2 = Engine.getTasksById(allTasks, "5788e3cf53a32e8419afd93e");
				tasks2.forEach(function(task) {
					arrayPromises.push(Engine.getQuestionsByTask(task).then(function(question){
						Array.prototype.push.apply(data, question);
					}));
				});
				return promise.all(arrayPromises).then(function() {
					return data;
				});
			})
	}


	getLexicalGrammarTest() {
		return Task.find({}).populate('parentTaskId', 'answersId')
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
		
		let allTasks = [];
		return Task.find({}).populate('parentTaskId')
		.then( function(tasks) {
			allTasks = tasks;
			let tasks1 =  Engine.getTasksById(tasks, constants.LISTENING_ID);
			let task = Engine.getTaskByLevel(tasks1, level)[0];
			let tasks2 = Engine.getTasksById(allTasks, task._id);
			tasks2.forEach(function(task) {
				arrayPromises.push(Engine.getQuestionsByTask(task));
			});
			debugger;
			return promise.all(arrayPromises);
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
			return Question.find({}).populate('taskId').then(function(questions) {
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