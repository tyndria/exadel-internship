var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.model('UsersAnswer', require('../modules/usersAnswer')); 

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