/*
*	Timeperiod Schema -
*	stores data 
*/
var mongoose = require('mongoose');

//schema
var schema = new mongoose.Schema({

	gantt:{
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'Gantt',
		required:true
	},
	startTime:{
		type:"Number",
		required:true
	},
	endTime:{
		type:"Number",
		required:true
	}
});


module.exports = mongoose.model('Timeperiod', schema);