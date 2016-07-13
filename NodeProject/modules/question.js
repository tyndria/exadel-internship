var mongoose = require('mongoose');
var Schema = mongoose.Schema;

Answer = mongoose.models.Answer; 
Topic = mongoose.models.Topic; 

var questionSchema = new Schema({
	description: String,
	taskId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Task'
	},

	header: {type: String, unique: true},
	text: String,

	questionType: Boolean,
	answerType: String,
	level: String,
	cost: Number,

	topic: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Topic'
	},
	answersId: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Answer'
	}]
});


module.exports = questionSchema;