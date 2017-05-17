var mongoose = require('mongoose');

//schema
var schema = new mongoose.Schema({
	flowchart:{
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'FlowChart',
		required:true
	}
});


module.exports = mongoose.model('Nodelist', schema);