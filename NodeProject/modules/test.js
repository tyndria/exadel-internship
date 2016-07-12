var mongoose = require('mongoose');
var Schema = mongoose.Schema;

UsersAnswer = mongoose.models.UsersAnswer; 

var testSchema = new Schema({
	candidateId: { type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	reviewer: { type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	questions: [{ type: mongoose.Schema.Types.ObjectId,
		ref: 'Question'
	}],
	usersAnswers: [{type: mongoose.Schema.Types.ObjectId,
		ref: 'UsersAnswer'}],
	mark: Number, 
	isChecked: Boolean
});


module.exports = testSchema;