var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//UserAnswer = mongoose.models.UserAnswer;
Task = mongoose.models.Task;


var questionSchema = new Schema({
	description: String,
	taskId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Task'
	},
	level: String
});


module.exports = questionSchema;