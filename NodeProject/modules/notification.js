var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var notificationSchema = new Schema({
	candidate: [{ type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}],
	reviewer: [{ type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}],
	event: Number,
	date: Date
});


module.exports = notificationSchema;