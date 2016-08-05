var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var TweetSchema = new Schema({
	city: String,
	loc: [],
	pop: Number,
	state: String
});

module.exports = mongoose.model('zips', TweetSchema);
