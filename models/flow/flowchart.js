var mongoose = require('mongoose');

//schema
var schema = new mongoose.Schema({

	name:{
		type:'string',
		required:true
	},
	description:{
		type:'string'
	},
	user:{
		type:'string'
	},
	share:{
		type:'boolean'
	}
	
});


module.exports = mongoose.model('FlowChart', schema);