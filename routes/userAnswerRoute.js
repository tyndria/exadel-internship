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

function saveAudio(outFile) {
	binaryServer = BinaryServer({port: 9003});

	return binaryServer.on('connection').then(function(client) {
		console.log('new connection');

		var fileWriter = new wav.FileWriter(outFile, {
			channels: 1,
			sampleRate: 50000,
			bitDepth: 16
		});

		client.on('stream', function(stream, meta) {
			console.log('new stream + meta', meta);
			stream.pipe(fileWriter);

			stream.on('end', function() {
				fileWriter.end();
				console.log('wrote to file ' + outFile);
			});
		});
	});
}


router.post('/:candidateId/sendAudio', function (req, res, next) {

	Test.find({candidateId: req.params.candidateId})
		.then(function(tests) {
			var outFile = '../public/listening/' + req.body.answer.questionId + '.wav';
			console.log('outFile' + outFile);

			var CURRENT_TEST = req.params.seqNumber - 1;
			var test = tests[CURRENT_TEST];

			var newUsersAnswer = new UserAnswer({
				userId: ObjectId(req.params.candidateId.toString()),
				testId: ObjectId(test._id.toString()),
				questionId: ObjectId(req.body.answer.questionId.toString()),
				answer: outFile
			});

			test.userAnswersId[SPEAKING_ID].push(ObjectId(newUsersAnswer._id.toString()));

			saveAudio.then(function(err){
				if(err) res.send(err);

				newUsersAnswer.save().then(function(err) {
					if (err)
						console.log(err);
					res.send(newUsersAnswer);
				});
			});

		});

});


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
			test.save(function(err) {
				if(err)
					res.send(err);
				console.log(test);
				res.sendStatus(200);
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

		statistics.lexicalGrammar = userAnswers[LEXICAL_GRAMMAR_ID];
		statistics.reading = userAnswers[READING_ID];
		statistics.listening = userAnswers[LISTENING_ID];
		statistics.speaking = userAnswers[SPEAKING_ID];

		statistics.lexicalGrammar.push(test.resultLexicalGrammarTest);
		statistics.reading.push(test.resultReadingTest);
		statistics.listening.push(test.resultListeningTest);
		statistics.speaking.push(test.resultSpeakingTest);

		res.send(statistics);

	});

});

module.exports = router;