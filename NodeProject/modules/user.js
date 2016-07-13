var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	firstName:String,
	lastName:String,
	role: Number,
	mail: String,
	meta: {}
});


module.exports = userSchema;