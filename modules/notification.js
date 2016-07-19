var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var notificationSchema = new Schema({
	candidateId: { type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	reviewerId: { type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	event: Number,
	date: Date
});


module.exports = notificationSchema;