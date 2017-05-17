var mongoose = require('mongoose');

//schema
var schema = new mongoose.Schema({

	name:{
		type:"string",
		required:true
	},
	startTime:{
		type:Number,
		required:true
	},
	endTime:{
		type:Number
	},
	team:{
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'Team'
	},
	gantt:{
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'Gantt',
		required:true
	}
});


module.exports = mongoose.model('Task', schema);