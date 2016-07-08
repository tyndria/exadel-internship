var router = require('express').Router();

var mongoose = require('mongoose');

mongoose.model('Test', require('../modules/test'));
var Test = mongoose.models.Test;

mongoose.model('Topic', require('../modules/topic'));
var Topic = mongoose.models.Topic;

router.post('/', function(req, res) {
	var candidateId = req.body.candidateId;

	var newTest = new Test({
		candidateId: mongoose.Types.ObjectId(candidateId);
	});
		
	newTest.save(function(err) {
		if (err) {
			res.send(err);
		}

		res.send(newTest);
	});
});

function getQForTopic(topicId){};


// there should be a function that get n random questions from topic "Close test"(for example)
// that's way is "startTest"
router.get(':id/startTest', function(req, res) {  
	Test.findById(req.params.id, function(err, test) {
		if (err) {
           res.send(err);
		}

		//form questions
		questions.findAll()limit:10 (function (err, results) {
			test.questions = results.map((q) => q._id);
			test.save()

			test.questions = results
			res.json(test);
		})


	});
})

//there is a function that from my point of view should give as questions
// from ALL TOPIC EXCEPT OF "CLOSE TEST"
//because user could choose an order of passing topics 
router.get(':id/continueTest', function(err, ))

module.exports = router;