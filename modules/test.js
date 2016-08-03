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
	userAnswersId: {
		LEXICAL_GRAMMAR_ID : [{type: mongoose.Schema.Types.ObjectId, ref: 'UserAnswer'}],
		READING_ID : [{type: mongoose.Schema.Types.ObjectId, ref: 'UserAnswer'}],
		LISTENING_ID : [{type: mongoose.Schema.Types.ObjectId, ref: 'UserAnswer'}],
		SPEAKING_ID : [{type: mongoose.Schema.Types.ObjectId, ref: 'UserAnswer'}]
	},
	resultLexicalGrammarTest: Number,
	resultReadingTest: Number,
	resultListeningTest: Number,
	resultSpeakingTest: Number,
	isPassed: Boolean, 
	isChecked: Boolean,
	isBreaked: Boolean
});


module.exports = testSchema;