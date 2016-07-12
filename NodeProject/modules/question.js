var mongoose = require('mongoose');
var Schema = mongoose.Schema;

Answer = mongoose.models.Answer; 
Topic = mongoose.models.Topic; 

var questionSchema = new Schema({
<<<<<<< HEAD
	description: String,
	taskId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Task'
	},
=======
	header: {type: String, unique: true},
	text: String,
>>>>>>> e77b1c7b90ea226e0479f171ded3782d35066ff1
	questionType: Boolean,
	answerType: String,
	level: String,
	cost: Number,
<<<<<<< HEAD
	answersId: [{
=======
	topic: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Topic'
	},
	answers: [{
>>>>>>> e77b1c7b90ea226e0479f171ded3782d35066ff1
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Answer'
	}]
});


module.exports = questionSchema;