var Node = require('../../models/flow/node.js');
var error = "Node Controller error: ";

module.exports = (function(){
	'use strict';
	return {
		create:function(){

		},
		update:function(){

		},
		delete:function(_id, cb){
			if (_id && cb) {
				Node.remove({_id:_id}, function(err, success){
					if(err){
						return cb(err, null);
					}else{
						return cb(null, success);
					}
				});
			}else{
				return cb(error + ' delete missing _id');
			}
		},
		deleteByNodelist:function(nodelist, cb){
			if (_id && cb) {
				Node.remove({nodelist:nodelist}, function(err, success){
					if (err) {
						return cb(err, null);
					} else {
						return cb(null, success);
					}
				});
			} else {
				return cb(error + ' delete missing _id');
			}
		},
		read:function(){

		}
	};
})();