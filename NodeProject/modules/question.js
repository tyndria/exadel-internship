var mongoose = require('mongoose');
var Schema = mongoose.Schema;

UserAnswer = mongoose.models.UserAnswer; 
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

	topicId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Topic'
	},
	userAnswersId: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'UserAnswer'
	}]
});


module.exports = questionSchema;