var router = require('express').Router();
var constants = require('../consts');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var promise = require('bluebird');
var Engine = require('../serverAssistance/Engine');

var Task = mongoose.models.Task;
var Question = mongoose.models.Question;
var Answer = mongoose.models.Answer;

router.post('/', function(req, res) {
	var newTask = new Task(req.body);

	newTask.save(function(err) {
		if (err) {
			res.send(err);
		}

		res.send(newTask);
	}); 

});

router.post('/:id', function(req, res) {
	var topicId = req.params.id;
	if (topicId.toString() == constants.LEXICAL_GRAMMAR_ID) {
		postLexicalGrammarTask(req, res);
	} else if (topicId.toString() == constants.READING_ID) {
		postReadingTask(req, res);
	} else if (topicId.toString() == constants.LISTENING_ID) {
		postListeningTask(req, res);
	} else if (topicId.toString() == constants.SPEAKING_ID) {
		postSpeakingTask(req, res);
	}
});

function postSpeakingTask(req, res) {
	Task.find({parentTaskId: req.params.id})
	.then(function(tasks) {
		var task = tasks[0];

		var newQuestion = new Question();

		newQuestion.taskId = ObjectId(task._id.toString());
		newQuestion.description = req.body.description;
		newQuestion.level = req.body.level;
		newQuestion.questionType = req.body.questionType;
		newQuestion.answerType = req.body.answerType;
		newQuestion.cost = req.body.cost;		

		newQuestion.save(function() {
			res.send(newQuestion);
		});
	});
}

function postListeningTask(req, res) {
	var tasksforText = req.body.tasksForText;
	var textTask = req.body.text;

	var newTextTask = new Task({
		title: textTask.title,
		description: textTask.description,
		parentTaskId: ObjectId(req.params.id),
		level: textTask.level
	});

	newTextTask.save(function() {

		tasksforText.forEach(function(taskForText) {

			var questions = taskForText.questions;

			var newTask = new Task({
				title: taskForText.title,
				parentTaskId: ObjectId(newTextTask._id.toString()),
			});


			newTask.save(function(){
				questions.forEach(function(question) {

					var promises = [];

					var newQuestion = new Question({
						taskId: ObjectId(newTask._id.toString()),
						description: question.description,
						questionType: question.questionType,
						answerType: question.answerType,
						cost: question.cost	
					});

					var answers = question.answersId;
					if (answers) {
						answers.forEach(function(answer) {
							var newAnswer = new Answer(answer);
							newQuestion.answersId.push(ObjectId(newAnswer._id.toString()));
							promises.push(newAnswer.save().then(function(answer, err) {
								console.log(err);
							}));
						});
					}

					promise.all(promises).then(function() { // what happenes with promise?
						newQuestion.save(function() {
							console.log(newQuestion);
						});
					});
				});
			});
		});
	})
	.then(function() {
		res.send(textTask);
	});
}


function postReadingTask(req, res) {
	var tasksforText = req.body.tasksForText;
	var textTask = req.body.text;

	var newTextTask = new Task({
		title: textTask.title,
		description: textTask.description,
		parentTaskId: ObjectId(req.params.id),
		level: textTask.level
	});

	newTextTask.save(function() {

		tasksforText.forEach(function(taskForText) {

			var questions = taskForText.questions;

			var newTask = new Task({
				title: taskForText.title,
				parentTaskId: ObjectId(newTextTask._id.toString()),
			});


			newTask.save(function(){
				questions.forEach(function(question) {

					var promises = [];

					var newQuestion = new Question({
						taskId: ObjectId(newTask._id.toString()),
						description: question.description,
						questionType: question.questionType,
						answerType: question.answerType,
						cost: question.cost	
					});

					var answers = question.answersId;

					answers.forEach(function(answer) {
						var newAnswer = new Answer(answer);
						newQuestion.answersId.push(ObjectId(newAnswer._id.toString()));
						promises.push(newAnswer.save().then(function(answer, err) {
							console.log(err);
						}));
					});

					promise.all(promises).then(function() {
						newQuestion.save(function() {
							console.log(newQuestion);
						});
					});
				});
			});
		});
	})
	.then(function() {
		res.send(textTask);
	});

}



function postLexicalGrammarTask(req, res) {
	Task.find({parentTaskId: req.params.id})
	.then(function(tasks) {

		var promises = [];

		var task = tasks[0];

		var newQuestion = new Question();

		newQuestion.taskId = ObjectId(task._id.toString());
		newQuestion.description = req.body.description;
		newQuestion.level = req.body.level;
		newQuestion.questionType = req.body.questionType;
		newQuestion.answerType = req.body.answerType;
		newQuestion.cost = req.body.cost;		

		var answers = req.body.answersId;

		answers.forEach(function(answer) {
			var newAnswer = new Answer(answer);
			newQuestion.answersId.push(ObjectId(newAnswer._id.toString()));
			promises.push(newAnswer.save().then(function(answer, err) {
				console.log(err);
			}));
		});

		promise.all(promises).then(function() {
			console.log(newQuestion);
			newQuestion.save(function() {
				res.send(newQuestion);
			});
		});
	});
}

router.get('/', function (req, res) {
	var query = Task.find({});

	query.select('-__v');

	query.exec(function(err, tasks) {
		if (err) {
			res.send(err);
		}

    	res.json(tasks);
	});
});

router.get('/:id', function(req, res) {
	Task.findById(req.params.id, function(err, task) {
		if (err) {
           res.send(err);
		}

		res.send(task);
	});
});


module.exports = router;