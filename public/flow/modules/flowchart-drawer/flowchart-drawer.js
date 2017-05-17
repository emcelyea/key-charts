/*Flowchart Drawer, has knowledge of entire draw field:
	uses that to calculate x/y/width/height nodes/text should be drawn at
	and invokes nodeDrawer and textDrawer class to handle those functions
*/
var drawerError = "FlowchartDrawer Error : ";

var FlowchartDrawer = function(){}

/* Containing Div Dimensions */
FlowchartDrawer.containerWidth = "95%";
FlowchartDrawer.border = "1px solid #0285ea";

/* Node dimension variables*/
FlowchartDrawer.nodeWidthToHeightRatio = .7;
FlowchartDrawer.paddingX = 0.05;
FlowchartDrawer.paddingY = 0.05;

FlowchartDrawer.prototype.initialize = function(container, nodes){
	this.container = container;
	this.nodeDrawer = new NodeDrawer();
	this.textDrawer = new TextDrawer();
	if(!this.container){
		return console.error(controllerError, 'failed to initialize drawer with those parameters', nodes, container);
	}else{
		this.createContainer();
	}
}

FlowchartDrawer.prototype.createContainer = function(){
	this.container.style.width = FlowchartDrawer.containerWidth;
	this.container.style.border = FlowchartDrawer.border;
}

FlowchartDrawer.prototype.prepareDrawDimensions = function(nodes){
	//width & nodeWidth
	this.width  	 = Math.floor(this.container.offsetWidth * 0.96);
	this.xCount 	 = maxX(nodes);
	if(this.xCount % 2 === 0){this.xCount++;}
	this.nodeWidth = (this.width - (2 * FlowchartDrawer.paddingX * this.width))  / this.xCount;
	//height and nodeHeight function of width
	this.yCount = maxY(nodes);
	this.height = Math.floor(this.width * ((this.yCount / this.xCount) * FlowchartDrawer.nodeWidthToHeightRatio));
	this.nodeHeight = (this.height - 2 * FlowchartDrawer.paddingY) / this.yCount;
}

FlowchartDrawer.prototype.createOrUpdateSvg = function(nodes){
	this.container.style.height = this.height + 'px';
	if(this.svg){
		this.container.removeChild(this.svg);
		stripNodeElements(nodes);
	}
	this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	this.svg.setAttribute('height', this.height);
	this.svg.setAttribute('width', this.width);
	this.svg.style.marginLeft = "2%";
	this.container.appendChild(this.svg);
}

//For drawing Chart entirely from scratch
FlowchartDrawer.prototype.drawChart = function(nodes){
	if (nodes) {
		this.prepareDrawDimensions(nodes);
		this.createOrUpdateSvg(nodes);
		this.nodeDrawer.initialize(this.svg);
		this.textDrawer.initialize(this.svg);
	}else{
		return console.error(drawerError, 'missing params in drawChart command', nodes);
	}
	for(var i = 0; i < nodes.length; i++){
		nodes[i].element = this.drawNode(nodes[i]);
		if(nodes[i].content){
			this.drawText(false, false, false, nodes[i]);
		}
	}	
}

//redraw a single node
FlowchartDrawer.prototype.drawNode = function(node, selected, nodes){
	if(selected && nodes){
		node = findNodeByCoords(nodes, selected.x, selected.y);
	}
	if(node.element){
		this.svg.removeChild(node.element);
		node.element = false;
	}
	var nodeCoords = this.getNodeCoordinates(node);
	node.element = this.nodeDrawer.draw(nodeCoords, node);
	this.svg.appendChild(node.element);
	return node.element;
}

//redraw a single text element:
// if called with selected/nodes/evt params will attempt to draw super fast for keypress responsiveness
// if invoked with node will redraw text using node content
FlowchartDrawer.prototype.drawText = function(selected, nodes, evt, node){
	//keypress listener fast redraw
	if(selected && nodes){
		var node = findNodeByCoords(nodes, selected.x, selected.y);
		var nodeCoords = this.getNodeCoordinates(node);
		this.textDrawer.updateText(node, nodeCoords, evt);		
	
	//redraw entire text element
	} else if(node){
		//trigger for complete redraw
		if(node.textElement){
			this.svg.removeChild(node.textElement);
			node.textElement = false;
		}		
		this.textDrawer.drawText(this.getNodeCoordinates(node), node);
	
	} else { 
		console.error(drawerError, 'Draw text parameter error', selected, nodes);
	}
}

//toggle state display on currently selected node
FlowchartDrawer.prototype.setSelectedStateDisplay = function(nodes, selected, state){
	var node = findNodeByCoords(nodes, selected.x, selected.y);
	return this.nodeDrawer.switchState(node, this.getNodeCoordinates(node), state);
}

FlowchartDrawer.prototype.getNodeCoordinates = function(node){
	var coords = {};
	//sets x position as if 0 is center of chart
	var normalizeXPosition =  (Math.ceil(this.xCount/2) + node.positionX)
	var paddingY = FlowchartDrawer.paddingY * this.height;
	var paddingX = FlowchartDrawer.paddingX * this.width;

	coords.x0 = Math.floor(paddingX + normalizeXPosition * (this.nodeWidth) - this.nodeWidth);
	coords.x1 = Math.floor(coords.x0 + this.nodeWidth);
	coords.y0 = Math.floor(paddingY + (node.positionY * this.nodeHeight));
	coords.y1 = Math.floor(coords.y0 + this.nodeHeight);
	return coords;
}

//listener for nodes in type state changes state
FlowchartDrawer.prototype.setSelectedNodeType = function(nodes, selected, direction){
	var node = findNodeByCoords(nodes, selected.x, selected.y);
	if(direction === 'forward'){
		node.type = getNodeType(node, 1);
	}else {
		node.type = getNodeType(node, -1);
	}
	if(node.element){
		this.svg.removeChild(node.element);
		node.element = false;
	}
	var nodeCoords = this.getNodeCoordinates(node);
	node.element = this.nodeDrawer.draw(nodeCoords, node);
	this.svg.appendChild(node.element);
	this.nodeDrawer.switchState(node, false);
	return this.nodeDrawer.switchState(node, nodeCoords, 'toggle');
	/*NEXT TIME FINSIH THIS TOTGGGLE NODE TYPES FUNCTIONS*/
}

/* Helper Math functions*/
function maxX(nodes){
	var max = 2;
	var min = 0;
	nodes.map(function(node){
		min = min > node.positionX ? node.positionX : min;
		max = max < node.positionX ? node.positionX : max;
	});
	max = (max > Math.abs(min)) ? 2 * max : 2 * Math.abs(min);
	return max;
}

function maxY(nodes){
	var max = 3;
	nodes.map(function(node){
		max = max < node.positionY + 1 ? node.positionY + 1 : max;
	});
	return max + 1;
}

function stripNodeElements(nodes){
	for(var i = 0; i < nodes.length; i++){
		nodes[i].element = null;
		nodes[i].textElement = null;
	}
	return nodes;
}

function findNodeByCoords(nodes, x, y){
	for(var i = 0; i < nodes.length; i++){
		if(nodes[i].positionX === x && nodes[i].positionY === y){
			return nodes[i];
		}
	}
	console.error('Could not find node in drawer nodes with coordinates: ', x, ', ', y);
}

//finds next node type in list of node types on the Flowchart object
function getNodeType(node, move){
	var current = Flowchart.nodeTypes.indexOf(node.type);
	if(current + move > Flowchart.nodeTypes.length - 1){
		current = 0;
	}else if(current + move < 0){
		current = Flowchart.nodeTypes.length - 1;
	} else {
		current += move;
	}
	return Flowchart.nodeTypes[current];
}
