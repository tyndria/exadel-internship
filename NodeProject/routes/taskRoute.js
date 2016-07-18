var router = require('express').Router();
var constants = require('../consts');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var promise = require('bluebird');

var Task = mongoose.models.Task;
var Question = mongoose.models.Question;
var Answer = mongoose.models.Answer;

router.post('/:id', function(req, res) {
	var topicId = req.params.id;
	if (topicId.toString() == constants.LEXICAL_GRAMMAR_ID) {
		postLexGrTask(req, res);
	} else if (topicId.toString() == constants.READING_ID) {
		postReadingTask(req);
	} else if (topicId.toString() == constants.LISTENING_ID) {
		postListeningTask(req);
	} else if (topicId.toString() == constants.SPEAKING_ID) {
		postSpeakingTask(req);
	}
});

function postLexGrTask(req, res) {
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