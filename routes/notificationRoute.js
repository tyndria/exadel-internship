var router = require('express').Router();

var mongoose  = require('mongoose');

var Notifications = mongoose.models.Notifications;

router.post('/', function(req, res) {
	var newQuestion = new Question(req.body);

	newQuestion.save(function(err) {
		if (err) {
			res.send(err);
		}

		res.json(newQuestion);
	}); 

});

router.get('/', function (req, res) {
	var query = Question.find({});

	query.select('-__v');

	query.exec(function(err, notifications) {
		if (err) {
			res.send(err);
		}

    	res.json(notifications); 
	});
});

router.delete('/:id', function(req,res){
	Notifications.remove(req.params.id,function(err, questions) {
		if (err) {
           res.send(err);
		}
		res.send(req.params.id + 'Successefully deleted');
	});

});


module.exports = router;