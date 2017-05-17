/*
	Drawing a Gantt Chart functionality
*/


var error = 'Gantt Drawer Error: ';
function GanttDraw(gantt, elem, height, width){
	if(!gantt.create){
		return console.error(error, 'provided invalid gantt data object'); 
	}
	if(!elem.setAttribute){
		return console.error(error, 'provided invalid element to append canvas too');
	}
	this.gantt = gantt;
	this.elem  = elem;
	if(height){
		this.height = height;
	}
	if(width){
		this.width  = width;
	}

	this.chartId = Math.random() * 1000;
}

//creates a new canvas element inside this.elem; 
GanttDraw.prototype.create = function(){
	//create status update element
	var div    = document.createElement('div');
	div.style.width  = "100%";
	div.style.height = "50px";
	
	var chartStatus  = document.createElement('h5');
	chartStatus.setAttribute('id', 'status-' + this.chartId.toString());

	//create canvas for chart
	var canvas = document.createElement('canvas');
	var canvasHeight = this.height || window.innerHeight / 2;
	var canvasWidth  = this.width  || window.innerWidth  / 2;
	
	canvas.setAttribute('height', canvasHeight);
	canvas.setAttribute( 'width', canvasWidth );
	canvas.setAttribute( 'id',  'chart-' + this.chartId.toString());
	
	//append elements to chart id
	div.appendChild(chartStatus)

	this.elem.appendChild(div);
	this.elem.appendChild(canvas);

	this.status = chartStatus;
	this.canvas = canvas;

	//draw current chart based on data in this.gantt
	this.draw();
}

/*FINISH LOGIC STUFF FOR STATUS AT TOP*/ 

GanttDraw.prototype.draw   = function(){
	this.drawStatus();
	this.drawButtons();
	this.drawChart();
}

GanttDraw.prototype.drawStatus = function(){
	if(this.milestoneDrawer){
		this.status.innerHTML = "Add Milestones";
	}else if(this.taskDrawer){
		this.status.innerHTML = "Add Tasks";
	}else if(this.teamDrawer){
		this.status.innerHTML = "Add Teams";
	}else{
		this.status.innerHTML = "Add Time Period";
	}
}

GanttDraw.prototype.drawButtons = function(){

}

GanttDraw.prototype.drawChart = function(){
	//draw timeperiod x axis
	if(this.timePeriodDrawer){
		this.timePeriodDrawer.update(this.gantt.timeperiod, this.canvas);
	}else if(this.gantt.hasOwnProperty('timeperiod')){
		this.timePeriodDrawer = new TimePeriodDrawer(this.gantt.timeperiod, this.canvas);
		this.timePeriodDrawer.draw();
	}
	
	//draw team y axis
	if(this.teamDrawer){
		this.teamDrawer.update(this.gantt.team, this.canvas);
	}else if(this.gantt.hasOwnProperty('team')){
		this.teamDrawer = new TeamDrawer(this.gantt.team, this.canvas);
		this.teamDrawer.draw();
	}

	//add tasks to chart
	if(this.taskDrawer){
		this.taskDrawer.update(this.gantt.task, this.canvas);
	}else if(this.gantt.hasOwnProperty('task')){
		this.taskDrawer = new TaskDrawer(this.gantt.task, this.canvas);
		this.taskDrawer.draw();
	}

	if(this.milestoneDrawer){
		this.milestoneDrawer.update(this.gantt.milestone, this.canvas);
	}else if(this.gantt.hasOwnProperty('milestone')){
		this.milestoneDrawer = new MilestoneDrawer(this.gantt.milestone, this.canvas);
		this.milestoneDrawer.draw();
	}
}

