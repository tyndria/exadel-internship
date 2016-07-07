var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Question = require('./models/question.js')

var topicSchema = new Schema({
	name: String,
	questions: [{ type: mongoose.Schema.Types.ObjectId,
		ref: 'Question'
	}],
	description: String, 
	meta{}
});

module.exports = topicSchema;