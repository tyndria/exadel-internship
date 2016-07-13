var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = mongoose.models.User;
var Test = mongoose.models.Test;
var Question = mongoose.models.Question;

var userAnswerSchema = new Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	testId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Test'
	},
	questionId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Question'
	},
	answer: String
});

module.exports = userAnswerSchema;