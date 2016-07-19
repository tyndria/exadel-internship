var mongoose = require('mongoose');
var Schema = mongoose.Schema;

Task = mongoose.models.Task;

var taskSchema = new Schema({
	title: String,
	description: String,
	parentTaskId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Task'
	},
	level: String
});


module.exports = taskSchema;