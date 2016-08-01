var router = require('express').Router();
var multer  = require('multer');
var upload = multer({ dest: 'public/listening/answers'});
var authentication = require('../serverAssistance/AuthenticationAssistant');
var constants = require('../consts');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var promise = require('bluebird');

var ModelAssistant = require('../serverAssistance/ModelAssistant');
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


router.post('/:topicId', authentication([constants.ADMIN_ROLE]), function(req, res) {
	var topicId = req.params.topicId;
	switch(topicId.toString()) {
		case constants.LEXICAL_GRAMMAR_ID:
			postLexicalGrammarTask(req, res);
			break;
		case constants.READING_ID:
			postReadingTask(req, res);
			break;
		case constants.LISTENING_ID:
			postListeningTask(req, res);
			break;
		case constants.SPEAKING_ID:
			postSpeakingTask(req, res);
	}
});

function postSpeakingTask(req, res) {
	Task.find({parentTaskId: req.params.topicId})
	.then(function(tasks) {
		var task = tasks[0];

		var questions = req.body.questions;

		questions.forEach(function(question) {

			var newQuestion = ModelAssistant.createQuestion(question, task._id.toString(), true, "audio");

			newQuestion.save(function(err) {
				if (err) {
					res.send(err);
				}
				console.log(newQuestion);
			});
		});

		res.sendStatus(200);

	});
}

function postListeningTask(req, res) {

	var tasksforText = [];
	tasksforText.push(req.body.task.questionTask); 
	tasksforText.push(req.body.task.completeTheSentencesTask);

	var newTextTask = ModelAssistant.createTask(req.body.text, req.params.topicId);

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

					var newQuestion = ModelAssistant.createQuestion(question, newTask._id.toString());

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


function postReadingTask(req, res) {

	var tasksforText = [];

	tasksforText.push(req.body.task.translationTask);
	tasksforText.push(req.body.task.statementTask);

	var newTextTask = ModelAssistant.createTask(req.body.task.text, req.params.topicId);

	newTextTask.save(function() {

		tasksforText.forEach(function(taskForText) {

			var questions = taskForText.questions;

			var newTask = new Task({
				title: taskForText.title || 'Do this task',
				parentTaskId: ObjectId(newTextTask._id.toString()),
			});


			newTask.save(function(){
				questions.forEach(function(question) {

					var promises = [];

					var newQuestion = ModelAssistant.createQuestion(question, newTask._id.toString());

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

	Task.find({parentTaskId: req.params.topicId})
	.then(function(tasks) {

		var task = tasks[0];

		var questions = req.body.questions;

		questions.forEach(function(question) {
			var promises = [];

			var newQuestion = ModelAssistant.createQuestion(question, task._id.toString(), false, "string");

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

		res.sendStatus(200);

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