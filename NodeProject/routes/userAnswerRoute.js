var router = require('express').Router();
var mongoose  = require('mongoose');
var promise = require('bluebird');
var multer  = require('multer');
var upload = multer({ dest: 'public/listening/answers'});

var UserAnswer = mongoose.models.UserAnswer;
var Test = mongoose.models.Test;
var ObjectId = mongoose.Types.ObjectId;

var ModelAssistant = require('../serverAssistance/ModelAssistant');

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

router.post('/:id/sendAudio', upload.single('audioFromUser'), function (req, res, next) {
  console.log('success' + req);
  var file = req.file;
  Test.find({candidateId: req.params.id}).
	then(function(tests) {
		var currentTest = tests[0];
		
		var newUsersAnswer = new UserAnswer({
			userId: req.params.id,
			testId: currentTest._id,
			questionId: req.body.userAnswer.questionId,
			answer: req.file.path
		});

		currentTest.userAnswersId.push(ObjectId(newUsersAnswer._id));

		newUsersAnswer.save().then(function(err) {
			if (err) 
				console.log(err);
			res.send(newUsersAnswer);
		});
		
	});

})

router.post('/:id', function(req, res) {

	Test.find({candidateId: req.params.id}).
	then(function(tests) {
		var promises = []

		var currentTest = tests[0];
		currentTest.userAnswersId = [];

		var userAnswers = req.body.userAnswers;

		userAnswers.forEach(function (userAnswer){

			var newUsersAnswer = ModelAssistant.createUserAnswer(userAnswer, req.params.id, currentTest._id);

			currentTest.userAnswersId.push(ObjectId(newUsersAnswer._id));
			promises.push(newUsersAnswer.save().then(function(err) {
				if (err) console.log(err);
			}));
		});


		promise.all(promises).then(function() {
			currentTest.save(function() {
				console.log(currentTest);
			})
		});

	});

});

router.get('/:id/getLexicalGrammarTest', function(req, res) {
	Test.find({candidateId: req.params.id}).populate({path: 'userAnswersId',
										populate: {path: 'questionId',
										populate: {path: 'taskId',
										populate: {path: 'parentTaskId'}}}})
	.then(function(tests) {
		var test = tests[0];

	});

});

module.exports = router;
