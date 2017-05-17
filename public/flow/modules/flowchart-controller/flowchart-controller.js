
var controllerError = "Flowchart controller Error: ";

var FlowchartController = function(){
	this.states = ['movement', 'toggle', 'text'];
	this.lineStates = ['movement', 'text'];
	this.state  = 'toggle';
	this.selected = {x:0, y:0};
}

FlowchartController.prototype.initialize = function(container, name, chartId){
	if(container && name){
		this.container = document.getElementById(container);
		this.container.focus();
		if(chartId){
			//handle already created charts
		}else{
			this.flowchart = new Flowchart();
			this.flowchart.create(name).then( (nodesCreated) => {
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
	}else{
		console.error(controllerError, 'constructor missing container param');
	}
}

FlowchartController.prototype.resolveState = function(){
	var index; 
	if(this.selected.x % 2 === 0 && this.selected.y % 2 === 0){
		index = this.states.indexOf(this.state);
		return this.states[index + 1] ? this.states[index + 1] : this.states[0];
	} else {
		index = this.lineStates.indexOf(this.state);
		return this.lineStates[index + 1] ? this.lineStates[index + 1] : this.lineStates[0];
	}
}

FlowchartController.prototype.setupListeners = function(){
	var saveDelay = false;
	this.container.addEventListener('keydown', (evt) => {
		if(evt.keyCode === 38 || evt.keyCode === 39){
			evt.preventDefault();	
		}	
	});
	this.container.addEventListener('keyup', (evt) => {
		
		//enter keypress forwards states
		if (evt.keyCode === 13) {
			var index = this.states.indexOf(this.state);
			this.state = this.resolveState();			
			this.drawer.setSelectedStateDisplay(this.flowchart.nodes, this.selected, this.state);
		} else {
		
			if(this.state === 'text'){

				this.textStateInputHandler(evt)

			}else if(this.state === 'movement'){

				this.movementStateInputHandler(evt);

			}else if(this.state === 'toggle'){

				this.toggleStateInputHandler(evt);
	
			}
		}	
	});
}

FlowchartController.prototype.movementStateInputHandler = function(evt){
	//unselect old node
	var oldSelected = {x:this.selected.x, y:this.selected.y};
	switch(evt.keyCode){
		case 38:
			if(this.selected.y === 0){
				return;
			}else if (this.selected.x % 2 === 0){
				this.selected.y--;
			}else{
				return;
			}
			break;
		case 40:
			if(this.selected.x % 2 === 0){
				this.selected.y++;
			}else{
				return;
			}
			break;
		case 39:
			if(this.selected.y % 2 === 0){
				this.selected.x++;
			}else{
				return;
			}
			break;
		case 37:
			if(this.selected.y % 2 > 0){
				return;
			}else{
				this.selected.x--;
			}
			break;
	}
	this.drawer.setSelectedStateDisplay(this.flowchart.nodes, oldSelected, false);

	//select new node
	if(this.flowchart.nodeExists(this.selected)){
		this.drawer.setSelectedStateDisplay(this.flowchart.nodes, this.selected, this.state);
	}else {
	//insert new node
		this.state = 'movement';
		this.flowchart.insertNode(this.selected);
		this.drawer.drawChart(this.flowchart.nodes);
		this.drawer.setSelectedStateDisplay(this.flowchart.nodes, this.selected, this.state);
	}		
}

FlowchartController.prototype.textStateInputHandler = function(evt){
	var valid = validEventKey(evt.keyCode);
	if(!valid){
		return;
	}
	if(evt.keyCode !== 8){
		this.flowchart.setSelectedNodeContent(this.selected, evt.key);
	}else{
		this.flowchart.setSelectedNodeContent(this.selected, false);
	}
	this.drawer.drawText(this.selected, this.flowchart.nodes, evt);

	function validEventKey(keycode){
	  var valid = (keycode > 47 && keycode < 58)   || keycode == 32  || keycode == 8 || // spacebar & backspace & return key(s) (if you want to allow carriage returns)
	  (keycode > 64 && keycode < 91)   || // letter keys
	  (keycode > 95 && keycode < 112)  || // numpad keys
	  (keycode > 185 && keycode < 193) || // ;=,-./` (in order)
	  (keycode > 218 && keycode < 223); 
	  
	  return valid;
	}
}

FlowchartController.prototype.toggleStateInputHandler = function(evt){
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
}
