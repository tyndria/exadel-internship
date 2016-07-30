var mongoose = require('mongoose');
var Schema = mongoose.Schema;

Answer = mongoose.models.Answer;
Task = mongoose.models.Task;


var questionSchema = new Schema({
	description: String,
	taskId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Task'
	},
	level: String,
	questionType: Boolean,
	answerType: String,
	answersId: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Answer'
	}],
	cost: Number
});


module.exports = questionSchema;