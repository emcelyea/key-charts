var Nodelist = require('../../models/flow/nodelist.js');
var NodeController = require('./node.js');
var error = "Nodelist Controller error: ";

module.exports = (function(){
	'use strict';
	return {
		create:function(){

		},
		update:function(){

		},
		delete:function(_id, cb){
			if (_id && cb) {
				Nodelist.remove({_id:_id}, (err, success) => {
					if(err){
						return cb(err, null);
					}else{
						removeRelatedNodes(_id, cb);
					}
				});
			}else{
				return cb(error + ' delete missing _id');
			}
		},
		deleteByFlowchart:function(flowchart, cb){
			if (flowchart && cb) {
				Nodelist.remove({flowchart:flowchart}, (err, success) =>{
					if (err) {
						return cb(err, null);
					} else {
						return removeRelatedNodes(_id, cb);
					}
				});
			} else {
				return cb(error + ' delete missing _id');
			}
		},
		read:function(_id, cb){
			if( _id && cb) {
				Nodelist.find({_id:_id}, (err, nodelist) => {
					if (err) {
						return cb(err, null);
					} else {
						return cb(null, nodelist[0]);
					}
				});
			} else {
				return cb(error + ' delete missing _id');
			}
		}
	};

	function removeRelatedNodes(_id, cb){
		NodeController.deleteByNodelist(_id, (err, success) => {
			if(err){
				return cb(err, null);
			}else{
				return cb(null, nodeSuccess);
			}
		});
	}
})();