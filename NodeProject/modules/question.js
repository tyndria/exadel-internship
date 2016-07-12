var mongoose = require('mongoose');
var Schema = mongoose.Schema;

Answer = mongoose.models.Answer; 
Topic = mongoose.models.Topic; 

var questionSchema = new Schema({
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
	answers: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Answer'
	}]
});


module.exports = questionSchema;