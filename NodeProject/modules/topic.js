var mongoose = require('mongoose');
var Schema = mongoose.Schema;

Question = mongoose.models.Question; 

var topicSchema = new Schema({
<<<<<<< HEAD
	name: {type: String, unique: true}
=======
	name: {type: String, unique: true},
	questions: [{ type: mongoose.Schema.Types.ObjectId,
		ref: 'Question'
	}],
>>>>>>> e77b1c7b90ea226e0479f171ded3782d35066ff1
});

module.exports = topicSchema;