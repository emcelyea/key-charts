'use strict';

var flowchartError = "Flowchart Class Error:";

//init chart and chart state
var Flowchart = function (name) {
	if (name) {
		this.create(type);
	}
};

Flowchart.nodeTypes = ['terminal', 'process', 'decision'];

Flowchart.prototype.create = function (name) {
	if (name || this.name) {
		return HttpUtil.post('/api/flowchart', { name: name || this.name }).then(success => {
			//setup fields
			this._id = success._id;
			this.name = success.name;

			//create entry node
			var newNode = new Node();
			return newNode.create({ type: 'terminal', positionX: 0, positionY: 0, flowchart: this._id }).then(() => {

				this.nodes = [];
				this.nodes.push(newNode);
			});
		}, err => {
			console.error(flowchartError, ' return from server, ', err);
		});
	} else {
		console.error(flowchartError, ' create type invalid');
	}
};

Flowchart.prototype.update = function () {
	if (this._id) {
		return HttpUtil.put('/api/flowchart/' + this._id, this);
	} else {
		console.error(flowchartError, ' cannot run an update before chart created');
	}
};

Flowchart.prototype.read = function (id) {
	if (id) {
		return HttpUtil.get('/api/flowchart/' + id).then(success => {
			this.name = success.name;
			this._id = success._id;
		});
	} else {
		console.error(flowchartError, ' Get id param missing');
	}
};

Flowchart.prototype.delete = function () {
	if (this._id) {
		return HttpUtil.delete('/api/flowchart/' + this._id).then(success => {
			delete this._id;
			delete this.name;
		});
	} else {
		console.error(flowchartError, ' cannot delete an uncreated flowchart');
	}
};

//insert line type node unless coords are all even
Flowchart.prototype.insertNode = function (coords) {
	var type;
	var newNode = new Node();
	if (coords.x % 2 === 0 && coords.y % 2 === 0) {
		type = 'process';
	} else if (coords.x % 2 !== 0) {
		type = "line-horizontal";
	} else if (coords.y % 2 !== 0) {
		type = "line-vertical";
	}
	this.nodes.push(newNode);
	return newNode.create({ type: type, positionX: coords.x, positionY: coords.y, flowchart: this._id });
};

Flowchart.prototype.setSelectedNodeType = function (selected, type) {};

Flowchart.prototype.setSelectedNodeContent = function (selected, content) {
	var node = this.nodeExists(selected);
	if (node) {
		if (node.settingContent) {
			clearTimeout(node.settingContent);
		}
		if (node.content) {
			if (content) {
				node.content += content;
			} else {
				node.content = node.content.slice(0, node.content.length - 1);
			}
		} else {
			if (content) node.content = content;
		}
		node.settingContent = setTimeout(() => {
			//	node.update();
		}, 3000);
	}
};

Flowchart.prototype.nodeExists = function (selected) {
	var found = false;
	this.nodes.map(function (elem) {
		if (elem.positionX === selected.x && elem.positionY === selected.y) {
			return found = elem;
		}
	});
	return found;
};

var controllerError = "Flowchart controller Error: ";

var FlowchartController = function () {
	this.states = ['movement', 'toggle', 'text'];
	this.lineStates = ['movement', 'text'];
	this.state = 'toggle';
	this.selected = { x: 0, y: 0 };
};

FlowchartController.prototype.initialize = function (container, name, chartId) {
	if (container && name) {
		this.container = document.getElementById(container);
		this.container.focus();
		if (chartId) {
			//handle already created charts
		} else {
			this.flowchart = new Flowchart();
			this.flowchart.create(name).then(nodesCreated => {
				//setup drawer chart etc;
				this.drawer = new FlowchartDrawer();
				this.drawer.initialize(this.container);
				this.drawer.drawChart(this.flowchart.nodes);
				this.drawer.setSelectedStateDisplay(this.flowchart.nodes, this.selected, this.state);
				this.setupListeners();

				window.addEventListener('optimizedResize', () => {
					this.drawer.initialize(this.container);
					this.drawer.drawChart(this.flowchart.nodes);
					this.drawer.setSelectedStateDisplay(this.flowchart.nodes, this.selected, this.state);
				});
			});
		}
	} else {
		console.error(controllerError, 'constructor missing container param');
	}
};

FlowchartController.prototype.resolveState = function () {
	var index;
	if (this.selected.x % 2 === 0 && this.selected.y % 2 === 0) {
		index = this.states.indexOf(this.state);
		return this.states[index + 1] ? this.states[index + 1] : this.states[0];
	} else {
		index = this.lineStates.indexOf(this.state);
		return this.lineStates[index + 1] ? this.lineStates[index + 1] : this.lineStates[0];
	}
};

FlowchartController.prototype.setupListeners = function () {
	var saveDelay = false;
	this.container.addEventListener('keydown', evt => {
		if (evt.keyCode === 38 || evt.keyCode === 39) {
			evt.preventDefault();
		}
	});
	this.container.addEventListener('keyup', evt => {

		//enter keypress forwards states
		if (evt.keyCode === 13) {
			var index = this.states.indexOf(this.state);
			this.state = this.resolveState();
			this.drawer.setSelectedStateDisplay(this.flowchart.nodes, this.selected, this.state);
		} else {

			if (this.state === 'text') {

				this.textStateInputHandler(evt);
			} else if (this.state === 'movement') {

				this.movementStateInputHandler(evt);
			} else if (this.state === 'toggle') {

				this.toggleStateInputHandler(evt);
			}
		}
	});
};

FlowchartController.prototype.movementStateInputHandler = function (evt) {
	//unselect old node
	var oldSelected = { x: this.selected.x, y: this.selected.y };
	switch (evt.keyCode) {
		case 38:
			if (this.selected.y === 0) {
				return;
			} else if (this.selected.x % 2 === 0) {
				this.selected.y--;
			} else {
				return;
			}
			break;
		case 40:
			if (this.selected.x % 2 === 0) {
				this.selected.y++;
			} else {
				return;
			}
			break;
		case 39:
			if (this.selected.y % 2 === 0) {
				this.selected.x++;
			} else {
				return;
			}
			break;
		case 37:
			if (this.selected.y % 2 > 0) {
				return;
			} else {
				this.selected.x--;
			}
			break;
	}
	this.drawer.setSelectedStateDisplay(this.flowchart.nodes, oldSelected, false);

	//select new node
	if (this.flowchart.nodeExists(this.selected)) {
		this.drawer.setSelectedStateDisplay(this.flowchart.nodes, this.selected, this.state);
	} else {
		//insert new node
		this.state = 'movement';
		this.flowchart.insertNode(this.selected);
		this.drawer.drawChart(this.flowchart.nodes);
		this.drawer.setSelectedStateDisplay(this.flowchart.nodes, this.selected, this.state);
	}
};

FlowchartController.prototype.textStateInputHandler = function (evt) {
	var valid = validEventKey(evt.keyCode);
	if (!valid) {
		return;
	}
	if (evt.keyCode !== 8) {
		this.flowchart.setSelectedNodeContent(this.selected, evt.key);
	} else {
		this.flowchart.setSelectedNodeContent(this.selected, false);
	}
	this.drawer.drawText(this.selected, this.flowchart.nodes, evt);

	function validEventKey(keycode) {
		var valid = keycode > 47 && keycode < 58 || keycode == 32 || keycode == 8 || // spacebar & backspace & return key(s) (if you want to allow carriage returns)
		keycode > 64 && keycode < 91 || // letter keys
		keycode > 95 && keycode < 112 || // numpad keys
		keycode > 185 && keycode < 193 || // ;=,-./` (in order)
		keycode > 218 && keycode < 223;

		return valid;
	}
};

FlowchartController.prototype.toggleStateInputHandler = function (evt) {
	switch (evt.keyCode) {
		case 38:
			this.drawer.setSelectedNodeType(this.flowchart.nodes, this.selected, 'forward');
			break;
		case 39:
			this.drawer.setSelectedNodeType(this.flowchart.nodes, this.selected, 'forward');
			break;
		case 40:
			this.drawer.setSelectedNodeType(this.flowchart.nodes, this.selected, 'back');
			break;
		case 37:
			this.drawer.setSelectedNodeType(this.flowchart.nodes, this.selected, 'back');
			break;
	}
};
'use strict';

var nodeError = "Node Class Error:";

var Node = function (nodelist, type) {
	if (nodelist && type) {
		this.create(type);
	}
};

Node.potentialTypes = ['terminal', 'process', 'decision', 'line-horizontal', 'line-vertical'];

Node.prototype.create = function (node) {
	var err = Node.preSaveValidation(node);
	this.type = node.type;
	this.positionX = node.positionX;
	this.positionY = node.positionY;
	if (!err) {
		return HttpUtil.post('/api/node', node).then(success => {
			this._id = success._id;
		}, err => {
			console.error(nodeError, ' create node return from server, ', err);
			Node.prototype.recoverFromError('create', node);
		});
	} else {
		console.error(nodeError, ' creating new node:', err);
	}
};

Node.prototype.update = function () {
	if (this._id) {
		return HttpUtil.put('/api/node/' + this._id, { type: this.type, content: this.content, positionX: this.positionX, positionY: this.positionY }).then(success => {}, err => {
			console.error(nodeError, ' update node return from server ', err);
		});
	} else {
		console.error(nodeError, ' cannot update node without _id');
	}
};

Node.prototype.delete = function () {
	if (this._id) {
		return HttpUtil.delete('/api/node/' + this._id).then(success => {
			this._id = null;
			this.positionX = null;
			this.positionY = null;
		}, err => {
			console.error(nodeError, ' delete node return from server, ', err);
		});
	} else {
		console.error(nodeError, ' cannot delete node without _id');
	}
};

Node.prototype.recoverFromError = function (request, data) {};

Node.preSaveValidation = function (node) {
	var errs = '';
	var cpNode = {};
	if (!node.type || Node.potentialTypes.indexOf(node.type) === -1) {
		errs += '"type" field invalid: ' + node.type;
	} else if (!Number.isInteger(node.positionX)) {
		errs += '"positionX" field invalid ' + node.positionX;
	} else if (!Number.isInteger(node.positionY)) {
		errs += '"positionY" field invalid ' + node.positionY;
	} else if (!node.flowchart) {
		errs += '"flowchart" field invalid ' + node.flowchart;
	}
	return errs;
};
/*Flowchart Drawer, has knowledge of entire draw field:
	uses that to calculate x/y/width/height nodes/text should be drawn at
	and invokes nodeDrawer and textDrawer class to handle those functions
*/
var drawerError = "FlowchartDrawer Error : ";

var FlowchartDrawer = function () {};

/* Containing Div Dimensions */
FlowchartDrawer.containerWidth = "95%";
FlowchartDrawer.border = "1px solid #0285ea";

/* Node dimension variables*/
FlowchartDrawer.nodeWidthToHeightRatio = .7;
FlowchartDrawer.paddingX = 0.05;
FlowchartDrawer.paddingY = 0.05;

FlowchartDrawer.prototype.initialize = function (container, nodes) {
	this.container = container;
	this.nodeDrawer = new NodeDrawer();
	this.textDrawer = new TextDrawer();
	if (!this.container) {
		return console.error(controllerError, 'failed to initialize drawer with those parameters', nodes, container);
	} else {
		this.createContainer();
	}
};

FlowchartDrawer.prototype.createContainer = function () {
	this.container.style.width = FlowchartDrawer.containerWidth;
	this.container.style.border = FlowchartDrawer.border;
};

FlowchartDrawer.prototype.prepareDrawDimensions = function (nodes) {
	//width & nodeWidth
	this.width = Math.floor(this.container.offsetWidth * 0.96);
	this.xCount = maxX(nodes);
	if (this.xCount % 2 === 0) {
		this.xCount++;
	}
	this.nodeWidth = (this.width - 2 * FlowchartDrawer.paddingX * this.width) / this.xCount;
	//height and nodeHeight function of width
	this.yCount = maxY(nodes);
	this.height = Math.floor(this.width * (this.yCount / this.xCount * FlowchartDrawer.nodeWidthToHeightRatio));
	this.nodeHeight = (this.height - 2 * FlowchartDrawer.paddingY) / this.yCount;
};

FlowchartDrawer.prototype.createOrUpdateSvg = function (nodes) {
	this.container.style.height = this.height + 'px';
	if (this.svg) {
		this.container.removeChild(this.svg);
		stripNodeElements(nodes);
	}
	this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	this.svg.setAttribute('height', this.height);
	this.svg.setAttribute('width', this.width);
	this.svg.style.marginLeft = "2%";
	this.container.appendChild(this.svg);
};

//For drawing Chart entirely from scratch
FlowchartDrawer.prototype.drawChart = function (nodes) {
	if (nodes) {
		this.prepareDrawDimensions(nodes);
		this.createOrUpdateSvg(nodes);
		this.nodeDrawer.initialize(this.svg);
		this.textDrawer.initialize(this.svg);
	} else {
		return console.error(drawerError, 'missing params in drawChart command', nodes);
	}
	for (var i = 0; i < nodes.length; i++) {
		nodes[i].element = this.drawNode(nodes[i]);
		if (nodes[i].content) {
			this.drawText(false, false, false, nodes[i]);
		}
	}
};

//redraw a single node
FlowchartDrawer.prototype.drawNode = function (node, selected, nodes) {
	if (selected && nodes) {
		node = findNodeByCoords(nodes, selected.x, selected.y);
	}
	if (node.element) {
		this.svg.removeChild(node.element);
		node.element = false;
	}
	var nodeCoords = this.getNodeCoordinates(node);
	node.element = this.nodeDrawer.draw(nodeCoords, node);
	this.svg.appendChild(node.element);
	return node.element;
};

//redraw a single text element:
// if called with selected/nodes/evt params will attempt to draw super fast for keypress responsiveness
// if invoked with node will redraw text using node content
FlowchartDrawer.prototype.drawText = function (selected, nodes, evt, node) {
	//keypress listener fast redraw
	if (selected && nodes) {
		var node = findNodeByCoords(nodes, selected.x, selected.y);
		var nodeCoords = this.getNodeCoordinates(node);
		this.textDrawer.updateText(node, nodeCoords, evt);

		//redraw entire text element
	} else if (node) {
		//trigger for complete redraw
		if (node.textElement) {
			this.svg.removeChild(node.textElement);
			node.textElement = false;
		}
		this.textDrawer.drawText(this.getNodeCoordinates(node), node);
	} else {
		console.error(drawerError, 'Draw text parameter error', selected, nodes);
	}
};

//toggle state display on currently selected node
FlowchartDrawer.prototype.setSelectedStateDisplay = function (nodes, selected, state) {
	var node = findNodeByCoords(nodes, selected.x, selected.y);
	return this.nodeDrawer.switchState(node, this.getNodeCoordinates(node), state);
};

FlowchartDrawer.prototype.getNodeCoordinates = function (node) {
	var coords = {};
	//sets x position as if 0 is center of chart
	var normalizeXPosition = Math.ceil(this.xCount / 2) + node.positionX;
	var paddingY = FlowchartDrawer.paddingY * this.height;
	var paddingX = FlowchartDrawer.paddingX * this.width;

	coords.x0 = Math.floor(paddingX + normalizeXPosition * this.nodeWidth - this.nodeWidth);
	coords.x1 = Math.floor(coords.x0 + this.nodeWidth);
	coords.y0 = Math.floor(paddingY + node.positionY * this.nodeHeight);
	coords.y1 = Math.floor(coords.y0 + this.nodeHeight);
	return coords;
};

//listener for nodes in type state changes state
FlowchartDrawer.prototype.setSelectedNodeType = function (nodes, selected, direction) {
	var node = findNodeByCoords(nodes, selected.x, selected.y);
	if (direction === 'forward') {
		node.type = getNodeType(node, 1);
	} else {
		node.type = getNodeType(node, -1);
	}
	if (node.element) {
		this.svg.removeChild(node.element);
		node.element = false;
	}
	var nodeCoords = this.getNodeCoordinates(node);
	node.element = this.nodeDrawer.draw(nodeCoords, node);
	this.svg.appendChild(node.element);
	this.nodeDrawer.switchState(node, false);
	return this.nodeDrawer.switchState(node, nodeCoords, 'toggle');
	/*NEXT TIME FINSIH THIS TOTGGGLE NODE TYPES FUNCTIONS*/
};

/* Helper Math functions*/
function maxX(nodes) {
	var max = 2;
	var min = 0;
	nodes.map(function (node) {
		min = min > node.positionX ? node.positionX : min;
		max = max < node.positionX ? node.positionX : max;
	});
	max = max > Math.abs(min) ? 2 * max : 2 * Math.abs(min);
	return max;
}

function maxY(nodes) {
	var max = 3;
	nodes.map(function (node) {
		max = max < node.positionY + 1 ? node.positionY + 1 : max;
	});
	return max + 1;
}

function stripNodeElements(nodes) {
	for (var i = 0; i < nodes.length; i++) {
		nodes[i].element = null;
		nodes[i].textElement = null;
	}
	return nodes;
}

function findNodeByCoords(nodes, x, y) {
	for (var i = 0; i < nodes.length; i++) {
		if (nodes[i].positionX === x && nodes[i].positionY === y) {
			return nodes[i];
		}
	}
	console.error('Could not find node in drawer nodes with coordinates: ', x, ', ', y);
}

//finds next node type in list of node types on the Flowchart object
function getNodeType(node, move) {
	var current = Flowchart.nodeTypes.indexOf(node.type);
	if (current + move > Flowchart.nodeTypes.length - 1) {
		current = 0;
	} else if (current + move < 0) {
		current = Flowchart.nodeTypes.length - 1;
	} else {
		current += move;
	}
	return Flowchart.nodeTypes[current];
}


var nodeDrawerError = 'NodeDrawer Error : ';

var NodeDrawer = function () {};

NodeDrawer.strokeWidth = '2';
NodeDrawer.lineStrokeWidth = '6';
NodeDrawer.selectedStroke = '#2FACE0';
NodeDrawer.selectedFill = "#fff";
NodeDrawer.defaultStroke = "#000";
NodeDrawer.defaultFill = "#fff";

NodeDrawer.movementArrowHeight = 0.04;
NodeDrawer.movementArrowWidth = 0.2;

NodeDrawer.fontSize = "14";
NodeDrawer.fontFamily = "Serif";

NodeDrawer.prototype.initialize = function (svg) {
	this.svg = svg;
};

//draw call, input is coords/node returns path element 
NodeDrawer.prototype.draw = function (coords, node) {
	var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	path.setAttribute('stroke', NodeDrawer.defaultStroke);
	if (node.type === 'line-horizontal' || node.type === 'line-vertical') {
		path.setAttribute('stroke-width', NodeDrawer.lineStrokeWidth);
	} else {
		path.setAttribute('stroke-width', NodeDrawer.strokeWidth);
	}
	path.setAttribute('fill', 'none');
	switch (node.type) {
		case 'terminal':
			path.setAttribute('d', this.drawTerminal(coords));
			break;
		case 'process':
			path.setAttribute('d', this.drawProcess(coords));
			break;
		case 'decision':
			path.setAttribute('d', this.drawDecision(coords));
			break;
		case 'line-horizontal':
			path.setAttribute('d', this.drawLineHorizontal(coords));
			break;
		case 'line-vertical':
			path.setAttribute('d', this.drawLineVertical(coords));
			break;
	}
	return path;
};

//switch state call, updates state (toggle/movement/text)
NodeDrawer.prototype.switchState = function (node, coords, state) {
	if (this.moveStateOverlay && this.moveStateOverlay.nodeType > 0) {
		this.svg.removeChild(this.moveStateOverlay);
		this.moveStateOverlay = null;
	}

	this.unselectedState(node);
	if (node.element) {
		switch (state) {
			case 'toggle':
				return this.selectedState(node);
			case 'movement':
				return this.moveState(node, coords);
			case 'text':
				return this.textState(coords);
			default:
				return this.unselectedState(node);
		}
	} else {
		console.error(nodeDrawerError, 'attempted to toggle state on a node with no element', node);
	}
};

//terminal is a pill shape
NodeDrawer.prototype.drawTerminal = function (coords) {
	var width = coords.x1 - coords.x0;
	var height = coords.y1 - coords.y0;

	var terminalArcWidth = Math.floor(width * 0.2);

	var midpointY = Math.floor(coords.y1 - height / 2);
	var control1Y = Math.floor(coords.y1);
	var control0Y = Math.floor(coords.y0);
	var controlRightX = Math.floor(coords.x1 + terminalArcWidth / 2);
	var controlLeftX = Math.floor(coords.x0 - terminalArcWidth / 2);

	var d;
	//top line
	d = ' M ' + (coords.x0 + terminalArcWidth).toString() + ' ' + coords.y0;
	d += ' L ' + (coords.x1 - terminalArcWidth).toString() + ' ' + coords.y0;
	//right arc
	d += ' C ' + controlRightX + ' ' + control0Y + ' ' + controlRightX + ' ' + control1Y + ' ' + (coords.x1 - terminalArcWidth) + ' ' + coords.y1;
	//bottom
	d += ' L ' + (coords.x0 + terminalArcWidth).toString() + ' ' + coords.y1;
	//left arc
	d += ' C ' + controlLeftX + ' ' + control1Y + ' ' + controlLeftX + ' ' + control0Y + ' ' + (coords.x0 + terminalArcWidth) + ' ' + coords.y0;

	return d;
};

//decision node is horizontal diamond shape
NodeDrawer.prototype.drawDecision = function (coords) {
	var width = coords.x1 - coords.x0;
	var height = coords.y1 - coords.y0;

	var midpointY = Math.floor(coords.y1 - height / 2);
	var midpointX = Math.floor(coords.x1 - width / 2);

	var d = '';
	//upper middle
	d += ' M ' + midpointX + ' ' + coords.y0;
	d += ' L ' + coords.x1 + ' ' + midpointY;
	d += ' L ' + midpointX + ' ' + coords.y1;
	d += ' L ' + coords.x0 + ' ' + midpointY + ' Z';

	return d;
};

//process shape is just a rect
NodeDrawer.prototype.drawProcess = function (coords) {
	var d = '';
	d += 'M ' + coords.x0 + ' ' + coords.y0;
	d += ' L ' + coords.x1 + ' ' + coords.y0;
	d += ' L ' + coords.x1 + ' ' + coords.y1;
	d += ' L ' + coords.x0 + ' ' + coords.y1 + ' Z';
	return d;
};

NodeDrawer.prototype.drawLineVertical = function (coords) {
	var width = coords.x1 - coords.x0;

	var midpointX = Math.floor(coords.x0 + width / 2);
	var d = '';
	d += ' M ' + midpointX + ' ' + coords.y0;
	d += ' L ' + midpointX + ' ' + coords.y1;
	return d;
};

NodeDrawer.prototype.drawLineHorizontal = function (coords) {
	var height = coords.y1 - coords.y0;

	var midpointY = Math.floor(coords.y0 + height / 2);
	var d = '';
	d += ' M ' + coords.x0 + ' ' + midpointY;
	d += ' L ' + coords.x1 + ' ' + midpointY;
	return d;
};

NodeDrawer.prototype.unselectedState = function (node) {
	node.element.setAttribute('stroke', NodeDrawer.defaultStroke);
	node.element.classList.remove('pulse-element-white');
	if (node.type === 'line') {
		node.element.setAttribute('fill', NodeDrawer.defaultFill);
	}
};

NodeDrawer.prototype.selectedState = function (node) {
	this.selectedElement = node.element;
	node.element.setAttribute('stroke', NodeDrawer.selectedStroke);
	node.element.classList.add('pulse-element-white');
	if (node.type === 'line') {
		node.element.setAttribute('fill', NodeDrawer.selectedFill);
	}
};

NodeDrawer.prototype.moveState = function (node, coords) {
	var height = coords.y1 - coords.y0;
	var width = coords.x1 - coords.x0;
	var midpointY = Math.floor(coords.y1 - height / 2);
	var midpointX = Math.floor(coords.x1 - width / 2);

	var arrowHeightVertical = Math.floor(height * NodeDrawer.movementArrowWidth);
	var arrowWidthVertical = Math.floor(height * NodeDrawer.movementArrowHeight);

	var arrowHeightHorizontal = Math.floor(width * NodeDrawer.movementArrowHeight);
	var arrowWidthHorizontal = Math.floor(width * NodeDrawer.movementArrowWidth);

	var drawSide = { top: true, right: true, bottom: true, left: true };
	if (node.positionY === 0) {
		drawSide.top = false;
	}
	if (node.positionY % 2 !== 0) {
		drawSide.right = false;
		drawSide.left = false;
	}
	if (node.positionX % 2 !== 0) {
		drawSide.top = false;
		drawSide.bottom = false;
	}

	var d = '';
	if (drawSide.top) {
		d += " M " + midpointX + ' ' + (coords.y0 - arrowHeightHorizontal).toString();
		d += " L " + (midpointX + arrowWidthHorizontal).toString() + ' ' + (coords.y0 + arrowHeightHorizontal);
		d += " M " + midpointX + ' ' + (coords.y0 - arrowHeightHorizontal).toString();
		d += " L " + (midpointX - arrowWidthHorizontal).toString() + ' ' + (coords.y0 + arrowHeightHorizontal);
	}
	if (drawSide.right) {
		d += " M " + (coords.x1 + arrowWidthVertical).toString() + ' ' + midpointY;
		d += " L " + (coords.x1 - arrowWidthVertical).toString() + ' ' + (midpointY - arrowHeightVertical).toString();
		d += " M " + (coords.x1 + arrowWidthVertical).toString() + ' ' + midpointY;
		d += " L " + (coords.x1 - arrowWidthVertical).toString() + ' ' + (midpointY + arrowHeightVertical).toString();
	}
	if (drawSide.bottom) {
		d += " M " + midpointX + ' ' + (coords.y1 + arrowHeightHorizontal).toString();
		d += " L " + (midpointX - arrowWidthHorizontal).toString() + ' ' + (coords.y1 - arrowHeightHorizontal);
		d += " M " + midpointX + ' ' + (coords.y1 + arrowHeightHorizontal).toString();
		d += " L " + (midpointX + arrowWidthHorizontal).toString() + ' ' + (coords.y1 - arrowHeightHorizontal);
	}
	if (drawSide.left) {
		d += " M " + (coords.x0 - arrowWidthVertical).toString() + ' ' + midpointY;
		d += " L " + (coords.x0 + arrowWidthVertical).toString() + ' ' + (midpointY - arrowHeightVertical).toString();
		d += " M " + (coords.x0 - arrowWidthVertical).toString() + ' ' + midpointY;
		d += " L " + (coords.x0 + arrowWidthVertical).toString() + ' ' + (midpointY + arrowHeightVertical).toString();
	}

	var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	path.setAttribute('stroke', NodeDrawer.selectedStroke);
	path.setAttribute('stroke-width', '2');
	path.setAttribute('fill', 'none');
	path.setAttribute('d', d);
	path.setAttribute('class', 'pulse-element-black');
	this.moveStateOverlay = path;
	this.svg.appendChild(this.moveStateOverlay);
	return;
};

NodeDrawer.prototype.textState = function (coords) {
	var height = coords.y1 - coords.y0;
	var width = coords.x1 - coords.x0;
	var midpointY = Math.floor(coords.y1 - height / 2);
	var midpointX = Math.floor(coords.x1 - width / 2);

	var d = " M " + midpointX + ' ' + (midpointY - 8);
	d += " L " + midpointX + ' ' + (midpointY + 8);

	var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	path.setAttribute('stroke', NodeDrawer.selectedStroke);
	path.setAttribute('stroke-width', '2');
	path.setAttribute('fill', 'none');
	path.setAttribute('d', d);
	path.setAttribute('class', 'pulse-element-white');
	this.textStateOverlay = path;
	this.svg.appendChild(this.textStateOverlay);
	return;
};


var textDrawerError = 'TextDrawer Error : ';

var TextDrawer = function () {};

TextDrawer.fontSize = "14";
TextDrawer.fontFamily = "Serif";
TextDrawer.textPadding = "10";

//initialize with coords of a node so it knows how to draw overlays
TextDrawer.prototype.initialize = function (svg) {
	this.svg = svg;
	this.textSizes = TextDrawer.buildTextSizeReferenceObject(TextDrawer.fontSize, TextDrawer.fontFamily);
};

//keypress listener 
//will draw key immediately, then run more intensive redraw operation after 200ms,
//not responsive enough if you run redraw every time
TextDrawer.prototype.updateText = function (node, coords, evt) {
	if (!this.drawingText) {
		this.drawingText = true;
		//element already exists, fast draw text
		if (node.textElement) {
			if (evt.keyCode === 8) {
				node.textElement.lastChild.innerHTML = node.textElement.lastChild.innerHTML.slice(0, node.textElement.lastChild.innerHTML.length - 1);
			} else {
				node.textElement.lastChild.innerHTML += evt.key;
			}
			if (node.textElementBackground) {
				addWhiteBackground(node, this.svg);
			}
			if (node.redrawTimeout) {
				clearTimeout(node.redrawTimeout);
			}
			//redraw text
			node.redrawTimeout = setTimeout(() => {
				var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
				text.setAttribute('font-family', TextDrawer.fontFamily);
				text.setAttribute('font-size', TextDrawer.fontSize);

				var textVariables = this.getTextCoords(coords, node.content);

				text.setAttribute('x', textVariables.x);
				text.setAttribute('y', textVariables.y);
				for (var i = 0; i < textVariables.children.length; i++) {
					text.appendChild(textVariables.children[i]);
				}
				this.svg.removeChild(node.textElement);
				node.textElement = text;
				if (node.type === 'line-horizontal' || node.type === 'line-vertical') {
					this.svg.removeChild(node.textElementBackground);
					addWhiteBackground(node, this.svg);
				}
				this.svg.appendChild(node.textElement);
			}, 200);

			//draw text for first time
		} else {
			var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
			text.setAttribute('font-family', TextDrawer.fontFamily);
			text.setAttribute('font-size', TextDrawer.fontSize);

			var textVariables = this.getTextCoords(coords, node.content);

			text.setAttribute('x', textVariables.x);
			text.setAttribute('y', textVariables.y);
			for (var i = 0; i < textVariables.children.length; i++) {
				text.appendChild(textVariables.children[i]);
			}
			node.textElement = text;
			//draw white behind text
			if (node.type === 'line-horizontal' || node.type === 'line-vertical') {
				addWhiteBackground(node, this.svg);
			}
			this.svg.appendChild(node.textElement);
		}
		this.drawingText = false;
	}
};
function addWhiteBackground(node, svg) {
	if (!node.textElementBackground) node.textElementBackground = document.createElementNS("http://www.w3.org/2000/svg", "rect");
	var bBox = node.textElement.getBBox();
	node.textElementBackground.setAttribute("x", bBox.x);
	node.textElementBackground.setAttribute("y", bBox.y);
	node.textElementBackground.setAttribute("width", bBox.width);
	node.textElementBackground.setAttribute("height", bBox.height);
	node.textElementBackground.setAttribute("fill", "white");
	svg.appendChild(node.textElementBackground);
}
//for regular drawing of node
TextDrawer.prototype.drawText = function (coords, node) {
	var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
	text.setAttribute('font-family', TextDrawer.fontFamily);
	text.setAttribute('font-size', TextDrawer.fontSize);

	var textVariables = this.getTextCoords(coords, node.content || '');

	text.setAttribute('x', textVariables.x);
	text.setAttribute('y', textVariables.y);
	for (var i = 0; i < textVariables.children.length; i++) {
		text.appendChild(textVariables.children[i]);
	}
	node.textElement = text;
	this.svg.appendChild(node.textElement);
};
//returns object with variables necessary to draw multi-line text elem
TextDrawer.prototype.getTextCoords = function (coords, content) {
	var textLength = 0;
	for (let i = 0; i < content.length; i++) {
		textLength += this.textSizes[content[i]] || 0;
	}

	//calculate # tspans needed
	var tspans = [];
	var width = coords.x1 - coords.x0;
	var height = coords.y1 - coords.y0;
	var midpointX = coords.x0 + width / 2;
	var midpointY = coords.y0 + height / 2;

	var linesNeeded = textLength / width;
	linesNeeded = linesNeeded >= 1 ? Math.ceil(linesNeeded) : 1;

	var lineWidth = linesNeeded > 1 ? width - 2 * Number(TextDrawer.textPadding) : textLength;
	var pointX = midpointX - lineWidth / 2;
	var pointY = midpointY - linesNeeded / 2 * (Number(TextDrawer.fontSize) * 1.2);

	//create tspan elements	
	for (let i = 0; i < linesNeeded; i++) {
		tspans.push(document.createElementNS('http://www.w3.org/2000/svg', 'tspan'));
		tspans[i].setAttribute('x', pointX);
		tspans[i].setAttribute('dy', '1.2em');
		let sliceIndex = this.getSliceIndex(content, Math.ceil(textLength / linesNeeded));
		let stringContent = content.slice(0, sliceIndex);
		content = content.replace(stringContent, '');
		tspans[i].innerHTML = stringContent;
	}

	//return attributes needed to draw text element
	return { y: pointY, x: pointX, children: tspans };
};

//build an object that references character size for family/size
TextDrawer.buildTextSizeReferenceObject = function (fontsize, fontfamily) {
	var charRef = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVXYZ 1234567890-=`!@#$%^&*()_+~[]\\;\',./{}|:"<>?';
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext('2d');
	ctx.font = fontsize + 'px ' + fontfamily;
	var sizeRef = {};

	for (var i = 0; i < charRef.length; i++) {
		sizeRef[charRef[i]] = ctx.measureText(charRef[i]).width;
	}
	return sizeRef;
};

//returns index where text[index+1] > width or text.length - 1; 
TextDrawer.prototype.getSliceIndex = function (text, width) {
	let textLength = 0;
	for (let i = 0; i < text.length; i++) {
		textLength += this.textSizes[text[i]] || 0;
		if (textLength > width) {
			return i - 1;
		}
	}
	return text.length;
};
'use strict';

var HttpUtil = {

	post: function (url, body) {
		return new Promise(function (resolve, reject) {

			var request = new XMLHttpRequest();
			request.open('POST', url);
			request.setRequestHeader("Content-Type", "application/json");

			request.onload = function () {
				if (request.readyState === XMLHttpRequest.DONE) {
					if (request.status == 200) {
						resolve(JSON.parse(request.responseText));
					} else {
						reject(Error(request.statusText));
					}
				}
			};

			request.onerror = function () {
				reject(Error('Network Error'));
			};
			request.send(JSON.stringify(body));
		});
	},

	get: function (url) {
		return new Promise(function (resolve, reject) {
			var request = new XMLHttpRequest();
			request.open('GET', url);

			request.onload = function () {
				if (request.readyState === XMLHttpRequest.DONE) {
					if (request.status == 200) {
						resolve(JSON.parse(request.responseText));
					} else {
						reject(Error(request.statusText));
					}
				}
			};
			request.onerror = function () {
				reject(Error('Network Error'));
			};
			request.send();
		});
	},

	put: function (url, body) {
		return new Promise(function (resolve, reject) {

			var request = new XMLHttpRequest();
			request.open('PUT', url);
			request.setRequestHeader("Content-Type", "application/json");

			request.onload = function () {
				if (request.readyState === XMLHttpRequest.DONE) {
					if (request.status == 200) {
						resolve(JSON.parse(request.responseText));
					} else {
						reject(Error(request.statusText));
					}
				}
			};
			request.onerror = function () {
				reject(Error('Network Error'));
			};
			request.send(JSON.stringify(body));
		});
	},

	delete: function (url) {
		return new Promise(function (resolve, reject) {

			var request = new XMLHttpRequest();
			request.open('DELETE', url);
			request.setRequestHeader("Content-Type", "application/json");

			request.onload = function () {
				if (request.readyState === XMLHttpRequest.DONE) {
					if (request.status == 200) {
						resolve(JSON.parse(request.responseText));
					} else {
						reject(Error(request.statusText));
					}
				}
			};
			request.onerror = function () {
				reject(Error('Network Error'));
			};
			request.send();
		});
	}

};

(function () {
	function optimizeEvent(event, customEvent, delay) {

		var waiting = false;
		window.addEventListener(event, function () {
			if (waiting) {
				clearTimeout(waiting);
			}
			setTimeout(function () {
				window.dispatchEvent(new CustomEvent(customEvent));
			}, delay);
		});
	}
	//optimizedResize
	optimizeEvent('resize', 'optimizedResize', 333);
})();
(function () {
	var nameButton = document.getElementById('save-title-button');
	var nameInput = document.getElementById('name-input');

	var nameDisplay = document.getElementById('chart-name');
	var chartArea = document.getElementById('chart-div');
	var controller;

	var chartCreated = false;

	if (location.search && location.search.indexOf('chart') > -1) {
		var chartId = location.search.split('=')[1];
	}

	//save name click listener
	nameButton.addEventListener('click', function () {
		if (nameInput.value) {
			initChart(nameInput.value);
		}
	});
	//enter listener
	nameInput.addEventListener('keyup', function (evt) {
		if (evt.keyCode === 13) {
			if (nameInput.value) {
				initChart(nameInput.value);
			}
		}
	});

	function initChart(name) {
		if (chartCreated) {
			//update chart
		} else {
			nameDisplay.innerHTML = name;
			controller = new FlowchartController();
			controller.initialize('chart-div', name, chartId || false);
			chartCreated = true;
		}
	}
})();

/* FOR NEXT TIME:::: INITIALIZE THE GOTDAMN MOFUKN DRAW STUFF */
/*	


if(chartId){
	controller.flowchart.read(chartId).then(function(){
		//controller
	});
}*/