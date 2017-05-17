var mongoose = require('mongoose');

//schema
var schema = new mongoose.Schema({

	title:{
		type:"string",
		required:true
	},
	/*owner:{
		type: Schema.Types.ObjectId, 
		ref: 'User',
		required:true
	}*/
});


module.exports = mongoose.model('Gantt', schema);