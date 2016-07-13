var router = require('express').Router();
var constants = require('../consts');
var mongoose = require('mongoose');
var promise = require('bluebird');
var shuffle = require('knuth-shuffle').knuthShuffle;


var Test = mongoose.models.Test;
var Topic = mongoose.models.Topic;
var Question = mongoose.models.Question;

var Task = mongoose.models.Task;




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


function getRandomQuestionsByLevel(questions, timesToGenerate) {
	return shuffle(questions.slice(0)).slice(0, timesToGenerate);
}

function getRandomIndex(length) {
	return Math.floor(Math.random()*length);
}



router.get('/:id/startTest', function(req, res) {

	function getLexicalGrammarTest() {

		var LEXICAL_GRAMMAR_ID = constants.LEXICAL_GRAMMAR_ID;

		var filteredQuestions = [];

		Question.find({}).exec(function(err, results){

			var promisesArrayFirst = [];
			var filteredQuestionsByTopic = [];

			results.forEach(function(question) {

				if(question.taskId) {

					promisesArrayFirst.push(
						Task.findById(question.taskId).then(function(res){
							if (res.topicId == LEXICAL_GRAMMAR_ID) {
								filteredQuestionsByTopic.push(question);
							}
						}, function(){
							console.log('error');
						})
					);
				}
			});

			promise.all(promisesArrayFirst).then(function() {

				//var taskId = getRandomTaskId(filteredQuestionsByTopic);

				var promisesArrayByTask = [];
				var filteredQuestionsByLevel = [];

				filteredQuestionsByTopic.forEach(function(question) {

					if (question.taskId === "5784f099b46b64c824577be3")
						filteredQuestions.push(question);

				});

				var levels = ['A1', 'A2', 'B1', 'B2', 'C1'];

				levels.forEach(function(level) {
					promisesArrayByTask.push(
						Question.find({'level': level}).then(function(res) {
							Array.prototype.push.apply(filteredQuestionsByLevel, getRandomQuestionsByLevel(res, 2));
						})
					);
				});

				promise.all(promisesArrayByTask).then( function() {


					Test.find({candidateId: req.params.id}, function(err, tests) {

						if (err) {
           					res.send(err);
						}

						console.log("filteredQuestions:" + filteredQuestionsByLevel);
						tests[0].questionsId = filteredQuestionsByLevel;


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

	}

	getLexicalGrammarTest();

});



router.get('/:id/getReadingTest', function(req, res) {

	var READING_ID = constants.READING_ID;


	Test.find({candidateId: req.params.id}, function(err, tests) {

		if (err) {
           res.send(err);
		}

		Question.find({topic: mongoose.Types.ObjectId(READING_ID)}, function(err, questions) {

			if (err) {
           		res.send(err);
			}

			Array.prototype.push.apply(tests[0], questions);

			res.json(questions);


		});

		tests[0].save(function(err) {
				if (err) {
					res.send(err);
				}
		});

	});
});

router.get('/:id/getListeningTest', function(req, res) {

});

module.exports = router;