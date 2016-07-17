var router = require('express').Router();
var constants = require('../consts');
var mongoose = require('mongoose');
var promise = require('bluebird');
var shuffle = require('knuth-shuffle').knuthShuffle;
var mongodb = require("mongodb");

var Test = mongoose.models.Test;
var Question = mongoose.models.Question;
var Task = mongoose.models.Task;

router.get('/', function (req, res) {
	var query = Test.find({});

	query.select('-__v');

	query.exec(function(err, tests) {
		if (err) {
			return res.send(err);
		}

		else {
    		return res.json(tests);
    	}
	});
});

router.post('/', function(req, res) {
	var candidateId = req.body.candidateId;

	var newTest = new Test({
		candidateId: mongoose.Types.ObjectId(candidateId)
	});

	newTest.save(function(err) {
		if (err) {
			res.send(err);
		}

		res.json(newTest);
	});
});


function getRandomArray(questions, timesToGenerate) {
	return shuffle(questions.slice(0)).slice(0, timesToGenerate);
}

function getRandomIndex(length) {
	return Math.floor(Math.random()*length);
}

function getAllQuestionsByLevels(questions, levels) {
	var resultQuestions = [];

	levels.forEach(function(level) {
		var array = [];

		questions.forEach(function(question){
			if (question.level == level) {
				array.push(question);
			}
		});
		Array.prototype.push.apply(resultQuestions, getRandomArray(array, 2));
	});

	return resultQuestions;
}

function getTaskByLevel(tasks, level) {
	var allTasks = [];

	tasks.forEach(function(task) {
		if (task.level) {
			if (task.level.toString() == level) {
				allTasks.push(task);
			}
		}
	});

	task = getRandomArray(allTasks, 1);

	return task;
}

function getAllQuestionsByRandomTask(questions) {
	var filteredQuestionsByTask = [];

	var randomTaskId = questions[getRandomIndex(questions.length)].taskId;

	questions.forEach(function(question) {
		
		if (question.taskId.toString() == randomTaskId.toString()) {
			filteredQuestionsByTask.push(question);
		}
	});

	return filteredQuestionsByTask;
}


function getTasksById(tasks, taskId) {
			var resultTasks = [];
			tasks.forEach(function(task) {
				if (task.parentTaskId) {
					if (task.parentTaskId._id.toString() == taskId) {
						resultTasks.push(task);
					}
				}	
			});
			return resultTasks;
		}

function getQuestionsByTask(task) {
			return Question.find({}).populate('taskId').then(function(questions) {
				var resultQuestions = [];
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


router.get('/:id/startTest', function(req, res) {

	function getLexicalGrammarTest() {

		Task.find({}).populate('parentTaskId').
		then( function(tasks) {
			return getTasksById(tasks, constants.LEXICAL_GRAMMAR_ID);
		})
		.then(function(tasks) {
			return getQuestionsByTask(tasks[0]);
		})
		.then(function (questions) {
			return getAllQuestionsByRandomTask(questions);
		})
		.then(function (questions) {
			return getAllQuestionsByLevels(questions, constants.LEVELS)
		})
		.then (function(questions) {
			Test.find({candidateId: req.params.id}, function(err, tests) {

					if (err) {
           				res.send(err);
					}

					tests[0].questionsId = questions;

					res.json(questions);

					tests[0].save(function(err) {
						if (err) {
							res.send(err);
						}
					});
			});
		});
	}

	getLexicalGrammarTest();
});



router.get('/:id/getReadingTest/', function(req, res) {

	var level = 'B1';

	var allTasks = [];

	Task.find({}).populate('parentTaskId')
		.then( function(tasks) {
			allTasks = tasks;
			return getTasksById(tasks, constants.READING_ID);
		})
		.then(function(tasks) {
			return getTaskByLevel(tasks, level)[0];
		})
		.then(function (task) {
			return getTasksById(allTasks, task._id);
		})
		.then (function(tasks) {
			var arrayPromises = [];
			tasks.forEach(function(task) {
				arrayPromises.push(
					getQuestionsByTask(task)
				)
			});

			promise.all(arrayPromises).then(function(result) {
				Test.find({candidateId: req.params.id}, function(err, tests) {

					if (err) {
        				res.send(err);
        			}

        			Array.prototype.push.apply(tests[0].questionsId, result);

					res.json(result);

					tests[0].save(function(err) {
						if (err) {
							res.send(err);
						}
					});
				});
			});

		});
});



router.get('/:id/getListeningTest', function(req, res) {
	var level = 'B1';

	Task.find({}).
		then( function(tasks) {
			return getTasksById(tasks, constants.LISTENING_ID);
		})
		.then(function(tasks) {
			return getTaskByLevel(tasks, level)[0];
		})
		.then(function (task) {
			var resultTasks = [];
			return Task.find({}).then(function(tasks) {
				tasks.forEach(function(onetask) {
					if (onetask.parentTaskId) {
						if (onetask.parentTaskId.toString() == task._id) {
							resultTasks.push(onetask);
						}
					}
				});
				return resultTasks;
			});
		})
		.then (function(tasks) {

			var arrayPromises = [];
			tasks.forEach(function(task) {
				arrayPromises.push(
					//getQuestionsByTask(task._id)
					Question.find({}).then(function(questions) {
						var resultQuestions = [];
						questions.forEach(function(question) {
							if (question.taskId.toString() == task._id) {
								resultQuestions.push(question);
							}
						});
						return resultQuestions;
					})
				
				)
			});

			promise.all(arrayPromises).then(function(result) {
				Test.find({candidateId: req.params.id}, function(err, tests) {

					if (err) {
        				res.send(err);
        			}

        			Array.prototype.push.apply(tests[0].questionsId, result);

					res.json(tests[0]);

					tests[0].save(function(err) {
						if (err) {
							res.send(err);
						}
					});
				});
			});

		});
});




router.get('/:id/getSpeakingTest', function(req, res) {
	var level = 'B2';

	Task.find({}).
		then( function(tasks) {
			return getTasksById(tasks, constants.SPEAKING_ID)[0];
		})
		.then(function(task) {
			var resultQuestions = [];
			return Question.find({}).then(function(questions) {
				questions.forEach(function(question) {
					if (question.taskId.toString() == task._id) {
						resultQuestions.push(question);
					}
				});
				return resultQuestions;
			});
		})
		.then (function(questions) {
			var filteredQuestionsByLevel = getAllQuestionsByLevels(questions, [level]);
			Test.find({candidateId: req.params.id}, function(err, tests) {

				if (err) {
        			res.send(err);
        		}

        		Array.prototype.push.apply(tests[0].questionsId, filteredQuestionsByLevel);

				res.json(tests[0]);

				tests[0].save(function(err) {
					if (err) {
						res.send(err);
					}
				});
			});
		});
});



module.exports = router;