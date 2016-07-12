var router = require('express').Router();

var mongoose = require('mongoose');

var Task = mongoose.models.Task;

router.post('/', function(req, res) {
	var newTask = new Task(req.body);

	newTask.save(function(err) {
		if (err) {
			res.send(err);
		}

		res.send(newTask);
	}); 

});

router.get('/', function (req, res) {
	var query = Task.find({});

	query.select('-__v');

	query.exec(function(err, tasks) {
		if (err) { 
			res.send(err);
		}

    	res.json(tasks); 
	});
});

router.get('/:id', function(req, res) {
	Task.findById(req.params.id, function(err, task) {
		if (err) {
           res.send(err);
		}

		res.send(task);
	});
});


module.exports = router;