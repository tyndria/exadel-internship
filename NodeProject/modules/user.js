var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	firstName:{type: String, /*required: true*/},
	lastName:String,
	role: Number, 
	mail: String,
	meta: {}
});

var User = mongoose.model('User', userSchema);
module.exports = User;