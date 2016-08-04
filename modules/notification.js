var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = mongoose.models.User;

var notificationSchema = new Schema({
	auth_id: { type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	reviewerId: { type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	event: Number,
	date: Date
});


module.exports = notificationSchema;