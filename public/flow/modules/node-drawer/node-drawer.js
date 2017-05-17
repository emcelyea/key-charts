

var nodeDrawerError = 'NodeDrawer Error : ';

var NodeDrawer = function(){};

NodeDrawer.strokeWidth      = '2';
NodeDrawer.lineStrokeWidth  = '6';
NodeDrawer.selectedStroke   = '#2FACE0';
NodeDrawer.selectedFill     = "#fff";
NodeDrawer.defaultStroke    = "#000";
NodeDrawer.defaultFill      = "#fff";

NodeDrawer.movementArrowHeight = 0.04;
NodeDrawer.movementArrowWidth = 0.2;

NodeDrawer.fontSize = "14";
NodeDrawer.fontFamily = "Serif";

NodeDrawer.prototype.initialize = function(svg){
	this.svg = svg;
}

//draw call, input is coords/node returns path element 
NodeDrawer.prototype.draw = function(coords, node){
	var path = document.createElementNS('http://www.w3.org/2000/svg','path');
	path.setAttribute('stroke', NodeDrawer.defaultStroke);
	if(node.type === 'line-horizontal' || node.type === 'line-vertical'){
		path.setAttribute('stroke-width', NodeDrawer.lineStrokeWidth);		
	}else{
		path.setAttribute('stroke-width', NodeDrawer.strokeWidth);
	}
	path.setAttribute('fill', 'none');
	switch(node.type){
		case('terminal'):
			path.setAttribute('d', this.drawTerminal(coords));
			break;
		case('process'):
			path.setAttribute('d', this.drawProcess(coords));
			break;
		case('decision'):
			path.setAttribute('d', this.drawDecision(coords));
			break;
		case('line-horizontal'):
			path.setAttribute('d', this.drawLineHorizontal(coords));
			break;
		case('line-vertical'):
			path.setAttribute('d', this.drawLineVertical(coords));
			break;
	}
	return path;
}

//switch state call, updates state (toggle/movement/text)
NodeDrawer.prototype.switchState = function(node, coords, state){
	if(this.moveStateOverlay && this.moveStateOverlay.nodeType > 0){
		this.svg.removeChild(this.moveStateOverlay);
		this.moveStateOverlay = null;
	}

	this.unselectedState(node);
	if(node.element){
		switch(state){
			case('toggle'): return this.selectedState(node);
			case('movement'): return this.moveState(node,coords);
			case('text'): return this.textState(coords);
			default: return this.unselectedState(node);
		}
	}else{
		console.error(nodeDrawerError, 'attempted to toggle state on a node with no element', node);
	}
} 

//terminal is a pill shape
NodeDrawer.prototype.drawTerminal = function(coords){
	var width  = coords.x1 - coords.x0;
	var height = coords.y1 - coords.y0;

	var terminalArcWidth = Math.floor(width * 0.2);

	var midpointY = Math.floor(coords.y1 - height/2);
	var control1Y  = Math.floor(coords.y1);
	var control0Y  = Math.floor(coords.y0);
	var controlRightX = Math.floor(coords.x1 + terminalArcWidth/2);
	var controlLeftX  = Math.floor(coords.x0 - terminalArcWidth/2);

	var d;
	//top line
	d  = ' M ' + (coords.x0 + terminalArcWidth).toString() + ' ' + coords.y0;
	d += ' L ' + (coords.x1 - terminalArcWidth).toString() + ' ' + coords.y0;
	//right arc
	d += ' C ' + controlRightX + ' ' + control0Y + ' ' + controlRightX + ' ' + control1Y + ' ' + (coords.x1 - terminalArcWidth) + ' ' + coords.y1;
	//bottom
	d += ' L ' + (coords.x0 + terminalArcWidth).toString() + ' ' + coords.y1;
	//left arc
	d += ' C ' + controlLeftX + ' ' + control1Y + ' ' + controlLeftX + ' ' + control0Y + ' ' + (coords.x0 + terminalArcWidth) + ' ' +  coords.y0;

	return d;
}

//decision node is horizontal diamond shape
NodeDrawer.prototype.drawDecision = function(coords){
	var width  = coords.x1 - coords.x0;
	var height = coords.y1 - coords.y0;

	var midpointY = Math.floor(coords.y1 - height/2);
	var midpointX = Math.floor(coords.x1 - width/2);

	var d = '';
	//upper middle
	d += ' M ' + midpointX + ' ' + coords.y0;
	d += ' L ' + coords.x1 + ' ' + midpointY;
	d += ' L ' + midpointX + ' ' + coords.y1;
	d += ' L ' + coords.x0 + ' ' + midpointY + ' Z';

	return d;
}

//process shape is just a rect
NodeDrawer.prototype.drawProcess = function(coords){
	var d = '';
	d += 'M ' + coords.x0 + ' ' + coords.y0;
	d += ' L ' + coords.x1 + ' ' + coords.y0;
	d += ' L ' + coords.x1 + ' ' + coords.y1;
	d += ' L ' + coords.x0 + ' ' + coords.y1 + ' Z';
	return d;
}

NodeDrawer.prototype.drawLineVertical = function(coords){
	var width  = coords.x1 - coords.x0;

	var midpointX = Math.floor(coords.x0 + width/2);
	var d = '';
	d += ' M ' + midpointX + ' ' + coords.y0;
	d += ' L ' + midpointX + ' ' + coords.y1;
	return d;
}

NodeDrawer.prototype.drawLineHorizontal = function(coords){
	var height  = coords.y1 - coords.y0;

	var midpointY = Math.floor(coords.y0 + height/2);
	var d = '';
	d += ' M ' + coords.x0 + ' ' + midpointY;
	d += ' L ' + coords.x1 + ' ' + midpointY;
	return d;
}

NodeDrawer.prototype.unselectedState = function(node){
	node.element.setAttribute('stroke', NodeDrawer.defaultStroke);
	node.element.classList.remove('pulse-element-white');
	if(node.type === 'line'){
		node.element.setAttribute('fill', NodeDrawer.defaultFill);
	}
}

NodeDrawer.prototype.selectedState = function(node){
	this.selectedElement = node.element;
	node.element.setAttribute('stroke', NodeDrawer.selectedStroke);
	node.element.classList.add('pulse-element-white');
	if(node.type === 'line'){
		node.element.setAttribute('fill', NodeDrawer.selectedFill);
	}
}

NodeDrawer.prototype.moveState = function(node, coords){
	var height 		= coords.y1 - coords.y0;
	var width  		= coords.x1 - coords.x0;
	var midpointY = Math.floor(coords.y1 - height/2);
	var midpointX = Math.floor(coords.x1 - width/2);

	var arrowHeightVertical 	= Math.floor(height * NodeDrawer.movementArrowWidth);
	var arrowWidthVertical = Math.floor(height * NodeDrawer.movementArrowHeight);

	var arrowHeightHorizontal = Math.floor(width * NodeDrawer.movementArrowHeight); 
	var arrowWidthHorizontal = Math.floor(width * NodeDrawer.movementArrowWidth);

	var drawSide = {top:true, right:true, bottom:true, left:true};
	if(node.positionY === 0){
		drawSide.top = false;
	}
	if(node.positionY % 2 !== 0){
		drawSide.right = false;
		drawSide.left  = false;
	}
	if(node.positionX % 2 !== 0){
		drawSide.top = false;
		drawSide.bottom = false;
	}

	var d = '';
	if(drawSide.top){
		d 	+= " M " + midpointX + ' ' + (coords.y0 - arrowHeightHorizontal).toString();
		d 	+= " L " + (midpointX + arrowWidthHorizontal).toString() + ' ' + (coords.y0 + arrowHeightHorizontal); 
		d   += " M " + midpointX + ' ' + (coords.y0 - arrowHeightHorizontal).toString(); 
		d   += " L " + (midpointX - arrowWidthHorizontal).toString() + ' ' + (coords.y0 + arrowHeightHorizontal);
	}
	if(drawSide.right){
		d   += " M " + (coords.x1 + arrowWidthVertical).toString() + ' ' + midpointY;
		d   += " L " + (coords.x1 - arrowWidthVertical).toString() + ' ' + (midpointY - arrowHeightVertical).toString();
		d   += " M " + (coords.x1 + arrowWidthVertical).toString() + ' ' + midpointY;
		d   += " L " + (coords.x1 - arrowWidthVertical).toString() + ' ' + (midpointY + arrowHeightVertical).toString();
	}
	if(drawSide.bottom){
		d   += " M " + midpointX + ' ' + (coords.y1 + arrowHeightHorizontal).toString(); 
		d   += " L " + (midpointX - arrowWidthHorizontal).toString() + ' ' + (coords.y1 - arrowHeightHorizontal);
		d   += " M " + midpointX + ' ' + (coords.y1 + arrowHeightHorizontal).toString(); 
		d   += " L " + (midpointX + arrowWidthHorizontal).toString() + ' ' + (coords.y1 - arrowHeightHorizontal);
	}
	if(drawSide.left){
		d   += " M " + (coords.x0 - arrowWidthVertical).toString() + ' ' + midpointY;
		d   += " L " + (coords.x0 + arrowWidthVertical).toString() + ' ' + (midpointY - arrowHeightVertical).toString();
		d   += " M " + (coords.x0 - arrowWidthVertical).toString() + ' ' + midpointY;
		d   += " L " + (coords.x0 + arrowWidthVertical).toString() + ' ' + (midpointY + arrowHeightVertical).toString();
	}

	var path = document.createElementNS('http://www.w3.org/2000/svg','path');
	path.setAttribute('stroke', NodeDrawer.selectedStroke);
	path.setAttribute('stroke-width', '2');
	path.setAttribute('fill', 'none');
	path.setAttribute('d', d);
	path.setAttribute('class', 'pulse-element-black');
	this.moveStateOverlay = path;
	this.svg.appendChild(this.moveStateOverlay);
	return;
}

NodeDrawer.prototype.textState = function(coords){
	var height 		= coords.y1 - coords.y0;
	var width  		= coords.x1 - coords.x0;
	var midpointY = Math.floor(coords.y1 - height/2);
	var midpointX = Math.floor(coords.x1 - width/2);	

	var d = " M " + midpointX + ' ' + (midpointY - 8);
	d    += " L " + midpointX + ' ' + (midpointY + 8);

	var path = document.createElementNS('http://www.w3.org/2000/svg','path');
	path.setAttribute('stroke', NodeDrawer.selectedStroke);
	path.setAttribute('stroke-width', '2');
	path.setAttribute('fill', 'none');
	path.setAttribute('d', d);
	path.setAttribute('class', 'pulse-element-white');
	this.textStateOverlay = path;
	this.svg.appendChild(this.textStateOverlay);
	return;
}



