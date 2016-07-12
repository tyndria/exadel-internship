var mongoose = require('mongoose');
var Schema = mongoose.Schema;

Question = mongoose.models.Question; 

var topicSchema = new Schema({
	name: {type: String, unique: true},
	questions: [{ type: mongoose.Schema.Types.ObjectId,
		ref: 'Question'
	}],
});

module.exports = topicSchema;