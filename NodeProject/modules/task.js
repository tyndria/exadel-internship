var mongoose = require('mongoose');
var Schema = mongoose.Schema;

Topic = mongoose.models.Topic; 
Task = mongoose.models.Task;

var taskSchema = new Schema({
	title: String,
	description: String,
	parentId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Task'
	}
});


module.exports = taskSchema;