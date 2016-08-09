var router = require('express').Router();
var mongoose  = require('mongoose');
var constants = require('../consts');
var authentication = require('../serverAssistance/AuthenticationAssistant');

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

router.get('/', authentication([constants.ADMIN_ROLE]), function(req, res) {

	Notification.find({}).populate('auth_id').then(function(notifications) {
		var notificationsToSend = [];
		notifications.forEach(function(notification) {
			var newNotification = {
				type: notification.event,
				userId: notification.auth_id._id,
				userName: notification.auth_id.firstName + " " + notification.auth_id.lastName,
				_id: notification._id 
			}
			if (notification.reviewerId) {
				newNotification.reviewerId = notification.reviewerId._id;
				newNotification.reviewerName = notification.reviewerId.firstName + " " + notification.reviewerId.lastName;
			}
			notificationsToSend.push(newNotification);
		});
		res.send(notificationsToSend);
	});
});

router.delete('/:id', function(req,res){
	Notification.remove({_id: req.params.id}, function(err) {
		if (err) {
           res.send(err);
		} else{
			res.send(req.params.id + 'Successefully deleted');
		}
	});

});


module.exports = router;