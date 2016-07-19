var mongoose = require('mongoose');
var Schema = mongoose.Schema;

UsersAnswer = mongoose.models.UsersAnswer;

var testSchema = new Schema({
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
	mark: Number,
	isChecked: Boolean
});


module.exports = testSchema;