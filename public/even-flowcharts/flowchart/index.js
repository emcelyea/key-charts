/*
	FLOWCHART
	returns the flowchart class which creates a new flowchart

*/
var FlowchartNode = require('../flowchart-node');
var errorMessage  = "Flowchart Error: ";

module.exports = class Flowchart {

	init(cb){
		var xmlHttp = new XMLHttpRequest();
		var URL     = "/api/flowchart";
		xmlHttp.onreadystatechange = function(){
			if(xmlHttp.readyState === XMLHttpRequest.DONE && xmlHttp.status === 200){

			}else if(xmlHttp.readyState === XMLHttpRequest.DONE && xmlHttp.status !== 200){
				console.error(errorMessage, xmlHttp.responseText);
				return cb(xmlHttp.responseText);
			}
		}
	}
	setSubtext(subtext){
		this.subtext = subtext;
	}
	setHover(hover){
		this.hover = hover;
	}
	//adds child node, defaults to down
	createChild(direction, header, subtext){
		var directions = ['right', 'left', 'down'];
		direction = directions.indexOf(direction) > -1 ? direction : 'down';

		if(direction)

		var newNode = new FlowchartNode(newId);
		this[direction] = newNode.id; 
		if(directions.indexOf(direction) > -1){
			this[direction] = node.id;
		}else{
			this.down = node.id;
		}
	}
}