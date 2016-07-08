var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = require('./models/user');
var Test = require('./models/test');
var Question = require('./models/question');

var usersAnswerSchema = new Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	test: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Test'
	},
	question: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Question'
	},
	answer: String
});

module.exports = usersAnswerSchema;