var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.model('Answer', require('../modules/answer')); 
mongoose.model('Topic', require('../modules/topic')); 

var questionSchema = new Schema({
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