var router = require('express').Router();

var mongoose = require('mongoose');

var Topic = mongoose.models.Topic;

router.post('/', function(req, res) {
	var newTopic = new Topic(req.body);

	newTopic.save(function(err) {
		if (err) {
			res.send(err);
		}

		res.send(newTopic);
	}); 

});

router.get('/', function (req, res) {
	var query = Topic.find({});

	query.select('-__v');

	query.exec(function(err, topics) {
		if (err) { 
			res.send(err);
		}

    	res.json(topics); 
	});
});

module.exports = router;