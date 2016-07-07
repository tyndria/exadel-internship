var router = require('express').Router();  

var mongoose  = require('mongoose');
mongoose.model('Answer', require('../modules/answer')); 
var Answer = mongoose.models.Answer;

router.post('/createAnswer', function(req, res) {
	var newAnswer = new Answer(req.body);

	newAnswer.save(function(err) {
		if (err) {
			res.send(err);
		}

		res.send(newAnswer);
	}); 

});

router.get('/getAnswers', function (req, res) {
	Answer.find({},function(err,answers){
		if (err) { 
			res.send(err);
		}

		var answerMap = {};
   		answers.forEach(function(answer) {
    	
      		answerMap[answer._id] = answer;
    });

    res.send(answerMap);  
  });
});

module.exports = router;