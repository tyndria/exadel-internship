var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var answerSchema = new Schema({
	text: String,
	isCorrect: Boolean,
	meta: {}
});

module.exports = answerSchema;