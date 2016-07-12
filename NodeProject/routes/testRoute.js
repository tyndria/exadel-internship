var router = require('express').Router();

var constants = require('../consts');

var mongoose = require('mongoose');
<<<<<<< HEAD
var promise = require('bluebird');
=======
>>>>>>> e77b1c7b90ea226e0479f171ded3782d35066ff1

var Test = mongoose.models.Test;
var Topic = mongoose.models.Topic;
var Question = mongoose.models.Question;
<<<<<<< HEAD
var Task = mongoose.models.Task;
=======
>>>>>>> e77b1c7b90ea226e0479f171ded3782d35066ff1



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



<<<<<<< HEAD
/*function getRandomTaskId(questions) {
			return questions[Math.floor(Math.random()*questions.length)].taskId;
}*/

 


router.get('/:id/startTest', function(req, res) {

	function getLexicalGrammarTest() {


		var questionsResult;

		var LEXICAL_GRAMMAR_ID = constants.LEXICAL_GRAMMAR_ID;

		var promisesArraySecond = [];

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

				filteredQuestionsByTopic.forEach(function(question) {
					if (question.taskId == "5784f099b46b64c824577be3")
						filteredQuestions.push(question);
				});

				Test.find({candidateId: req.params.id}, function(err, tests) {

					if (err) {
           				res.send(err);
					}

					tests[0].questions = filteredQuestions;

					res.json(tests[0]);


					tests[0].save(function(err) {
						if (err) {
							res.send(err);
						}
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