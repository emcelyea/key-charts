var mongoose = require('mongoose');

//schema
var schema = new mongoose.Schema({

	name:{
		type:"string",
		required:true
	},
	color:{
		type:"string",
		required:true
	},
	gantt:{
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'Gantt',
		required:true
	}
});


module.exports = mongoose.model('Team', schema);