var mongoose = require('mongoose');
var Schema = mongoose.Schema;

Question = mongoose.models.Question;

var topicSchema = new Schema({
	name: {type: String, unique: true}
});

module.exports = topicSchema;