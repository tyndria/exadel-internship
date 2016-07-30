var router = require('express').Router();
var mongoose  = require('mongoose');
var constants = require('../consts');

var Notification = mongoose.models.Notification;
var User = mongoose.models.User;


router.post('/', function(req, res) { // candidateId, event, date

	var newNotification = new Notification(req.body);

	User.findById(req.body.candidateId, function(err, user) {

		newNotification.save(function(err) {
		if (err) {
			res.send(err);
		}

		res.json(constants.MAP_NOTIFICATION[req.body.event](user.firstName + " " + user.lastName));

		}); 
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