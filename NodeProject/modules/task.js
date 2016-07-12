var mongoose = require('mongoose');
var Schema = mongoose.Schema;

Topic = mongoose.models.Topic; 

var taskSchema = new Schema({
	title: String,
	description: String,
	topicId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Topic'
	}
});


module.exports = taskSchema;