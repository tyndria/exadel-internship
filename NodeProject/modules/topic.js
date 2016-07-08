var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.model('Question', require('../modules/question')); 

var topicSchema = new Schema({
	name: String,
	questions: [{ type: mongoose.Schema.Types.ObjectId,
		ref: 'Question'
	}],
	description: String
});

module.exports = topicSchema;