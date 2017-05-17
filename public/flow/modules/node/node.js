'use strict';

var nodeError = "Node Class Error:";

var Node = function(nodelist, type){
	if(nodelist && type){
		this.create(type);
	}
};

Node.potentialTypes = ['terminal', 'process', 'decision', 'line-horizontal', 'line-vertical'];

Node.prototype.create = function(node){
	var err = Node.preSaveValidation(node);
	this.type = node.type;
	this.positionX = node.positionX;
	this.positionY = node.positionY;
	if(!err){
		/*return HttpUtil.post('/api/node', node).then((success) =>{
			this._id 	= success._id;
		}, (err) =>{
			console.error(nodeError, ' create node return from server, ', err);
			Node.prototype.recoverFromError('create', node);
		});*/
		this._id = Math.random().toString();
	}else{
		console.error(nodeError, ' creating new node:', err);
	}
}

Node.prototype.update = function(){
	if(this._id){
		return HttpUtil.put('/api/node/' + this._id, {type:this.type, content:this.content, positionX:this.positionX, positionY:this.positionY})
		.then( (success) => {

		}, (err) => {
			console.error(nodeError, ' update node return from server ', err);
		});
	} else {
		console.error(nodeError, ' cannot update node without _id');
	}
}

Node.prototype.delete = function(){
	if(this._id){
		return HttpUtil.delete('/api/node/' + this._id).then( (success) => {
			this._id = null;
			this.positionX = null;
			this.positionY = null;
		}, (err) => {
			console.error(nodeError, ' delete node return from server, ', err);
		});
	}else{
		console.error(nodeError, ' cannot delete node without _id');
	}
}

Node.prototype.recoverFromError = function(request, data){

}

Node.preSaveValidation = function(node){
	var errs = '';
	var cpNode = {};
	if(!node.type || Node.potentialTypes.indexOf(node.type) === -1){
		errs += '"type" field invalid: ' + node.type;
	}else if(!Number.isInteger(node.positionX)) {
		errs += '"positionX" field invalid ' + node.positionX; 
	}else if(!Number.isInteger(node.positionY)) {
		errs += '"positionY" field invalid ' + node.positionY;
	}else if(!node.flowchart){
		errs += '"flowchart" field invalid ' + node.flowchart;
	}
	return errs;
}