var mongoose = require('mongoose');

//schema
var schema = new mongoose.Schema({

	type:{
		type:'string',
		required:true,
		enum:['terminal', 'process', 'decision', 'line-vertical', 'line-horizontal']
	},
	flowchart:{
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'Flowchart'
	},
	content:{
		type:'string',
	},
	positionX:{
		type:'string'
	},
	positionY:{
		type:'number'
	}
});


module.exports = mongoose.model('Node', schema);