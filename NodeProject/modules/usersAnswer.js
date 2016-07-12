var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = mongoose.models.User;
var Test = mongoose.models.Test;
var Question = mongoose.models.Question;

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