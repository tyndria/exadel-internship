var mongoose = require('mongoose');
var Schema = mongoose.Schema;

UsersAnswer = mongoose.models.UsersAnswer;

var testSchema = new Schema({
	startTime: Number,
	finishTime: Number,
	duration: Number, 
	candidateId: { type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	reviewerId: { type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	questionsId: [{ type: mongoose.Schema.Types.ObjectId,
		ref: 'Question'
	}],
	userAnswersId: [{type: mongoose.Schema.Types.ObjectId,
		ref: 'UserAnswer'}],
	resultLexicalGrammarTest: Number,
	resultReadingTest: Number,
	resultListeningTest: Number,
	resultSpeakingTest: Number,
	isChecked: Boolean
});


module.exports = testSchema;