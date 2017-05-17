var Flowchart = require('../../models/flow/flowchart.js');
var NodelistController = require('./nodelist.js');

var error = "Flowchart Controller error: ";
module.exports = (function(){
	'use strict';
	return {
		create:function(){

		},
		update:function(){

		},
		delete:function(_id, cb){
			if (_id && cb) {
				Flowchart.remove({_id:_id}, function(err, success){
					if(err){
						return cb(err, null);
					}else{
						NodelistController.deleteByFlowchart(_id, cb);
					}
				});
			}else{
				return cb(error + ' delete missing _id');
			}
		},
		read:function(){

		}
	};
})();