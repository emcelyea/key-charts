/*
	FLOWCHART-NODE
	returns the flowchartNode class which creates/inserts and maintains state for flowchart data

*/

module.exports = class FlowchartNode {
	constructor(id){
		this.right  = false;
		this.left   = false;
		this.down   = false;
		this.id     = id || '1';
	}
	setHeader(header){
		this.header = header;
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