var router = require('express').Router();
var authentication = require('../serverAssistance/AuthenticationAssistant');
var constants = require('../consts');
var mongoose = require('mongoose');
var promise = require('bluebird');

var User = mongoose.models.User;
var Test = mongoose.models.Test;

router.get('/levels', authentication([constants.ADMIN_ROLE]), function(req, res) {
	var statistics = {
		A1: 0, A2: 0, B1: 0, B2: 0, C1: 0
	};
	console.log("!");
	Test.find({isChecked: true}).then(function(tests) {
		tests.forEach(function(test) {
			var result = test.testResult.LEXICAL_GRAMMAR_ID;
			statistics[constants.MAP_RESULT(result)] ++;
		});

		res.send(statistics);
	});
});

router.get('/amounts', authentication([constants.ADMIN_ROLE]), function(req, res) {
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