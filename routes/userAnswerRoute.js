var router = require('express').Router();
var mongoose  = require('mongoose');
var promise = require('bluebird');
var multer  = require('multer');
var upload = multer({ dest: 'public/listening/answers'});

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


router.post('/:id/:seqNumber/sendAudio', upload.single('audioFromUser'), function (req, res, next) {
  var file = req.file;
  Test.find({candidateId: req.params.id})
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

		var userAnswers = req.body.userAnswers;

		userAnswers.forEach(function (userAnswer){

			var newUsersAnswer = ModelAssistant.createUserAnswer(userAnswer, req.params.candidateId, test._id);

			test.userAnswersId.push(ObjectId(newUsersAnswer._id));
			promises.push(newUsersAnswer.save().then(function(err) {
				if (err) console.log(err);
			}));
		});


		promise.all(promises).then(function() {
			test.save(function() {
				console.log(test);
			})
		});

	});

});


router.get('/:id/statistics/:seqNumber', authentication([constants.ADMIN_ROLE]), function(req, res) {
	Test.find({candidateId: req.params.id}).populate('userAnswersId').then(function(tests) {

		var CURRENT_TEST = req.params.seqNumber - 1;
		var test = tests[CURRENT_TEST];

		var statistics = {};


		var userAnswers = test.userAnswersId;
		console.log("success:" +  userAnswers);

		statistics.lexicalGrammar = userAnswers.slice(0, 10);
		statistics.reading = userAnswers.slice(10, 14);
		statistics.listening = userAnswers.slice(14, 18);
		statistics.speaking = userAnswers.slice(18, 20);

		statistics.lexicalGrammar.push(test.resultLexicalGrammarTest);
		statistics.reading.push(test.resultReadingTest);
		statistics.listening.push(test.resultListeningTest);
		statistics.speaking.push(test.resultSpeakingTest);

		res.send(statistics);

	});

});

module.exports = router;
