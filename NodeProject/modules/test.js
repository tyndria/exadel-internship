var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = require('./models/user.js');
var Question = require('./models/question.js');

var testSchema = new Schema({
	candidate: { type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	reviewer: { type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	questions: [{ type: mongoose.Schema.Types.ObjectId,
		ref: 'Question'
	}],
	mark: Number, 
	isChecked: Boolean
});


module.exports = testSchema;