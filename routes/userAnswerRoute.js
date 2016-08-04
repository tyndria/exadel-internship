var router = require('express').Router();
var mongoose  = require('mongoose');
var promise = require('bluebird');
var multer  = require('multer');
var upload = multer({ dest: 'public/listening/answers'});
var TestAssistant = require('../serverAssistance/TestAssistant');
var promise = require('bluebird');

var UserAnswer = mongoose.models.UserAnswer;
var Test = mongoose.models.Test;
var ObjectId = mongoose.Types.ObjectId;

var ModelAssistant = require('../serverAssistance/ModelAssistant');
var authentication = require('../serverAssistance/AuthenticationAssistant');
var constants = require('../consts');

router.get('/', function (req, res) {
	var query = UserAnswer.find({});

	query.select('-__v');

	query.exec(function(err, userAnswers ) {
		if (err) {
			res.send(err);
		}

		res.json(userAnswers);
	});
});


router.post('/:candidateId/:seqNumber/sendAudio', upload.single('audioFromUser'), function (req, res, next) {
	var file = req.file;
	Test.find({candidateId: req.params.candidateIdid})
		.then(function(tests) {

			var CURRENT_TEST = req.params.seqNumber - 1;
			var test = tests[CURRENT_TEST];

			var newUsersAnswer = new UserAnswer({
				userId: ObjectId(req.params.id.toString()),
				testId: ObjectId(test._id.toString()),
				questionId: ObjectId(req.body.questionId.toString()),
				answer: file.path
			});

			test.userAnswersId.push(ObjectId(newUsersAnswer._id.toString()));

			newUsersAnswer.save().then(function(err) {
				if (err)
					console.log(err);
				res.send(newUsersAnswer);
			});

		});

})


router.post('/:candidateId', authentication([constants.USER_ROLE, constants.TEACHER_ROLE]), function(req, res) {

	Test.find({candidateId: req.params.candidateId}).
	then(function(tests) {
		var promises = []
		var CURRENT_TEST = tests.length - 1;

		var test = tests[CURRENT_TEST];
		var answers = req.body.answers;
		var TOPIC = req.body.topic;

		answers.forEach(function (userAnswer){

			var newUsersAnswer = ModelAssistant.createUserAnswer(userAnswer, req.params.candidateId, test._id);

			test.userAnswersId[TOPIC].push(ObjectId(newUsersAnswer._id));
			promises.push(newUsersAnswer.save().then(function(err) {
				if (err) console.log(err);
			}));
		});


		promise.all(promises).then(function() {
			TestAssistant.summarize(test.userAnswersId[TOPIC]).then(function(sum) {

				test.testResult[TOPIC] = sum;

				test.save(function(err) {
					if(err)
						res.send(err);
					
					res.sendStatus(200);
				})
			});
		});

	});

});


router.get('/:candidateId/statistics/:seqNumber', authentication([constants.ADMIN_ROLE]), function(req, res) {
	Test.find({candidateId: req.params.candidateId}).then(function(tests) {

		var CURRENT_TEST = req.params.seqNumber - 1;
 		var test = tests[CURRENT_TEST];
 
 		var statistics = {};

		var topics = ['LEXICAL_GRAMMAR_ID', 'READING_ID', 'LISTENING_ID', 'READING_ID'];
 
 		var userAnswers = {};
		
		topics.forEach(function(topic) {
			userAnswers[topic] = [];
			Array.prototype.push.apply(userAnswers[topic], test.userAnswersId[topic]);
			userAnswers[topic].push(test.testResult[topic]);
		});
 
 		statistics.lexicalGrammar = userAnswers['LEXICAL_GRAMMAR_ID'];
 		statistics.reading = userAnswers['READING_ID'];
 		statistics.listening = userAnswers['LISTENING_ID'];
 		statistics.speaking = userAnswers['SPEAKING_ID'];
 
 		res.send(statistics);
	});

});

router.get('/:testId', authentication([constants.TEACHER_ROLE]), function(req, res) {

	var query = Test.findById(req.params.testId);

	query.populate({path: 'userAnswersId.LISTENING_ID', populate: {path: 'questionId'}});
	query.populate({path: 'userAnswersId.SPEAKING_ID', populate: {path: 'questionId'}});

	var statistics = {};
	var userAnswers = {};

	var topics = ['LISTENING_ID', 'SPEAKING_ID'];

 	query.exec(function(err, test) {

	 	topics.forEach(function(topic) {
			userAnswers[topic] = [];
			test.userAnswersId[topic].forEach(function(userAnswer) {
				var object = {};
				if (userAnswer.questionId.questionType) {
					userAnswers[topic].push({
						answer: userAnswer.answer,
						answerId: userAnswer._id,
						question: userAnswer.questionId.description,
						cost: userAnswer.questionId.cost
					});
				}
			});
		});
	 
	 	statistics.listening = userAnswers['LISTENING_ID'];
	 	statistics.speaking = userAnswers['SPEAKING_ID'];
		
		res.send(statistics);

	 });
		
});

router.post('/checked/:testId', function(req, res) {

	var userAnswersChecked = req.body.userAnswersChecked; // cost, id
	var topic = req.body.topic;

	var promises = [];
	var sum = 0;

	userAnswersChecked.forEach(function(userAnswer) {
		promises.push(
			UserAnswer.findById(userAnswer.id).then(function(answer) {

				answer.cost = userAnswer.cost;
				if (answer.cost > 0){
					answer.isCorrect = true;
				}

				answer.save().then(function() {
					console.log("success");
					return answer.cost;
				});
			})
		);
	});

	promise.all(promises).then(function(result) {
		Test.findById(req.body.params).then(function(test) {
			var sum = result.reduce((prev, cur) => prev + cur);
			test.testResult[topic] += sum;
			res.sendStatus(200);
		});
	});
});

module.exports = router;