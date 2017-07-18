var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	user: {
		type: String,
		trim: true,
		required: "Username required"
	},

	comment: {
		type: String,
		required: "A comment requires content",
		validate: [
		function(input){
			input.length >= 3;
		},
		"+1 is not an acceptable comment on this forum."
		]
	},

	article: [{
		type: Schema.Types.ObjectId,
		ref: "Article"
	}]
});

var Comment = mongoose.model("Comment", UserSchema);