'use strict';

var flowchartError = "Flowchart Class Error:";

//init chart and chart state
var Flowchart = function(name){
	if(name){
		this.create(type);
	}
};

Flowchart.nodeTypes = ['terminal', 'process', 'decision'];

Flowchart.prototype.create = function(name){
	if(name || this.name){
		return HttpUtil.post('/api/flowchart', {name:name||this.name}).then((success) =>{
			//setup fields
			this._id 	= success._id;
			this.name = success.name;

			//create entry node
			var newNode = new Node();
			return newNode.create({type:'terminal', positionX:0, positionY:0, flowchart:this._id}).then( () => {

				this.nodes = [];
				this.nodes.push(newNode);

			});
		}, (err) => {
			console.error(flowchartError, ' return from server, ', err)
		});
	}else{
		console.error(flowchartError, ' create type invalid');
	}
}

Flowchart.prototype.update = function(){
	if(this._id){
		return HttpUtil.put('/api/flowchart/' + this._id, this);
	}else{
		console.error(flowchartError, ' cannot run an update before chart created');
	}
}

Flowchart.prototype.read = function(id){
	if(id){
		return HttpUtil.get('/api/flowchart/' + id).then( success => { 
			this.name = success.name;
			this._id  = success._id;
		});
	}else{
		console.error(flowchartError, ' Get id param missing');
	}
}

Flowchart.prototype.delete = function(){
	if(this._id){
		return HttpUtil.delete('/api/flowchart/' + this._id).then( success => {
			delete this._id;
			delete this.name;	
		});
	} else {
		console.error(flowchartError, ' cannot delete an uncreated flowchart');
	}
}

//insert line type node unless coords are all even
Flowchart.prototype.insertNode = function(coords){
	var type;
	var newNode = new Node();
	if(coords.x % 2 === 0 && coords.y % 2 === 0){
		type = 'process';
	}else if(coords.x % 2 !== 0){
		type = "line-horizontal";
	}else if(coords.y % 2 !== 0){
		type ="line-vertical";
	}
	this.nodes.push(newNode);
	return newNode.create({type:type,positionX:coords.x, positionY:coords.y, flowchart:this._id})
}

Flowchart.prototype.setSelectedNodeType = function(selected, type){

}

Flowchart.prototype.setSelectedNodeContent = function(selected, content){
	var node = this.nodeExists(selected);
	if(node){
		if(node.settingContent){
			clearTimeout(node.settingContent);
		}
		if(node.content){
			if(content){
				node.content += content;
			}else{
				node.content = node.content.slice(0,node.content.length-1);
			}
		}else{
			if(content)
				node.content = content;
		}
		node.settingContent = setTimeout( () => {
		//	node.update();
		}, 3000);
	}
}

Flowchart.prototype.nodeExists = function(selected){
	var found = false;
	this.nodes.map(function(elem){
		if(elem.positionX === selected.x && elem.positionY === selected.y){
			return found = elem; 
		}
	});
	return found;
}
