var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var answerSchema = new Schema({
	text:String,
	isCorrect:boolean,
	meta{}
});

var Answer = mongoose.model('Answer', answerSchema)

module.exports = Answer;