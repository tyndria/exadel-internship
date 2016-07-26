var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	firstName:String,
	lastName:String,
	role: Number,
	status: Number, 
	mail: String,
	photo: String,
	token: String
});


module.exports = userSchema;