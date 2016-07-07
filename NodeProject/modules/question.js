var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Answer = require('./models/answer.js');
var Topic = require('./models/topic.js');

var questionSchema = new Schema({
	text: String,
	questionType: boolean,
	answerType: String,
	level: String,
	cost: Number,
	topic: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Topic'
	},
	answers: [Answer.Schema]
});


module.exports = questionSchema;