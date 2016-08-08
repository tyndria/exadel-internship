var router = require('express').Router();
var authentication = require('../serverAssistance/AuthenticationAssistant');
var constants = require('../consts');
var mongoose = require('mongoose');
var promise = require('bluebird');

var User = mongoose.models.User;
var Test = mongoose.models.Test;

router.get('/', authentication([constants.ADMIN_ROLE]), function(req, res) {
	var promises = [

		User.find({}).then(function(users) {
			var object = {
				userCount: 0,
				teacherCount: 0,
				name: 'people'
			};
			users.forEach(function(user) {
				switch(user.role.toString()) {
					case '0':
						object.userCount ++;
						break;
					case '1':
						object.teacherCount ++;
						break;
				}
			});

			return object;
		}),

		Test.find({}).then(function(tests) {
			var object = {
				checkedTestCount: 0,
				passedTestCount: 0,
				name: 'tests'
			};
			tests.forEach(function(test) {
				if (test.isPassed) {
					object.passedTestCount ++;
				} else if (test.isChecked) {
					object.checkedTestCount ++;
				}
			});

			return object;
		})

	];

	promise.all(promises).then(function(objects){
		res.send(objects);
	});
});

module.exports = router;