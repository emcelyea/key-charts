var ganttError = 'Gantt Chart Errors: ';

function Gantt() {
	this.timeperiod = false;
	this.teams = false;
	this.tasks = false;
	this.milestones = false;
}

Gantt.prototype.find = function (id) {
	if (typeof id === 'string') {

		var http = new XMLHttpRequest();
		http.open('GET', '/api/gantt/' + gantt._id);

		http.onreadystatechange = function () {
			var response;
			if (http.readyState === XMLHttpRequest.DONE && http.status === 200) {
				response = JSON.parse(http.responseText);
				return cb(null, response);
			} else {
				response = JSON.parse(http.responseText);
				return cb(response);
			}
		};
		http.send();
	} else {
		console.error(gantError, 'Id parameter errors', id);
	}
};

Gantt.prototype.create = function (title, cb) {
	this.title = title;
	if (this.title) {
		var that = this;
		var http = new XMLHttpRequest();
		http.open('POST', '/api/gantt');
		http.setRequestHeader("Content-Type", "application/json");

		http.onreadystatechange = function () {
			var response;
			if (http.readyState === XMLHttpRequest.DONE && http.status === 200) {
				response = JSON.parse(http.responseText);
				that._id = response._id;
				return cb(null, response);
			} else {
				response = http.responseText;
				return cb(response);
			}
		};
		http.send(JSON.stringify({ title: this.title }));
	} else {
		console.error(ganttError, ' missing field to create chart');
	}
};

Gantt.prototype.update = function (title, cb) {
	if (title && this._id) {

		var that = this;
		var http = new XMLHttpRequest();
		http.open('PUT', '/api/gantt/' + this._id);
		http.setRequestHeader("Content-Type", "application/json");

		http.onreadystatechange = function () {
			var response;
			if (http.readyState === XMLHttpRequest.DONE && http.status === 200) {
				response = JSON.parse(http.responseText);
				that.title = title;
				return cb(null, response);
			} else {
				response = http.responseText;
				return cb(response);
			}
		};

		http.send(JSON.stringify({ title: this.title }));
	} else {
		console.error(ganttError, ' missing field for title create');
	}
};

Gantt.prototype.delete = function (cb) {
	if (this._id) {
		var that = this;
		var http = new XMLHttpRequest();
		http.open('DELETE', '/api/gantt/' + this._id);
		http.setRequestHeader("Content-Type", "application/json");

		http.onreadystatechange = function () {
			var response;
			if (http.readyState === XMLHttpRequest.DONE && http.status === 200) {
				response = JSON.parse(http.responseText);
				that._id = null;
				return cb(null, response);
			} else {
				response = http.responseText;
				return cb(response);
			}
		};

		http.send();
	}
};

/* 	$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
					TIMEPERIOD FUNCTIONALITY
		$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ */
Gantt.prototype.addTimeperiod = function (startTime, cb) {
	var timeperiod = new Timeperiod();
	timeperiod.create(this, startTime, (err, success) => {
		if (!err) {
			this.timeperiod = success;
			return cb(null, success);
		}
	});
};

Gantt.prototype.findTimeperiod = function (cb) {
	this.timeperiod = new Timeperiod();
	this.timeperiod.find(this, (err, success) => {
		if (!err) {
			this.timeperiod = success || null;
		}
		if (cb) {
			return cb(err, success);
		}
	});
};

Gantt.prototype.updateTimeperiod = function (startTime, endTime, cb) {
	this.timeperiod.update(startTime, endTime, cb);
};

Gantt.prototype.deleteTimeperiod = function (cb) {
	this.timeperiod.delete((err, deleted) => {
		if (err) {
			return cb(err);
		} else {
			this.timeperiod = false;
			return cb(null, deleted);
		}
	});
};

/* 	$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
						TEAM FUNCTIONALITY
		$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ */
Gantt.prototype.addTeam = function (name, color, cb) {
	var team = new Team();
	team.create(this, name, color, (err, success) => {
		if (this.teams && Array.isArray(this.teams)) {
			this.teams.push(team);
		} else {
			this.teams = [team];
		}
		return cb(err, true);
	});
};

Gantt.prototype.findTeams = function (cb) {
	Team.find(this, (err, teams) => {
		if (Array.isArray(teams)) {
			this.teams = [];
			var team;
			for (var i = 0; i < teams.length; i++) {
				team = new Team(teams[i]);
				this.teams.push(team);
			}
			cb(err, true);
		} else {
			cb(err);
		}
	});
};

Gantt.prototype.updateTeam = function (team, cb) {
	team.update((err, success) => {
		return cb(err, success);
	});
};

Gantt.prototype.deleteTeam = function (team, cb) {
	team.delete((err, success) => {
		if (!err) {
			for (var i = 0; i < this.teams.length; i++) {

				if (team._id === this.teams[i]._id) {
					this.teams.splice(i, 1);
					return cb(err, success);
				}
			}
		} else {
			return cb(err, success);
		}
	});
};

/* 	$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
TASK FUNCTIONALITY
$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ */
Gantt.prototype.addTask = function (name, start, cb) {
	var task = new Task();
	task.create(this, name, start, (err, success) => {
		if (this.tasks && Array.isArray(this.tasks)) {
			this.tasks.push(task);
		} else {
			this.tasks = [task];
		}
		return cb(err, true);
	});
};

Gantt.prototype.findTasks = function (cb) {
	Task.find(this, (err, success) => {
		if (!err) {
			var task;
			this.tasks = [];
			for (var i = 0; i < success.length; i++) {
				task = new Task(success[i]);
				this.tasks.push(task);
			}
			return cb(null, true);
		} else {
			return cb(err);
		}
	});
};

Gantt.prototype.updateTask = function (task, cb) {
	task.update((err, success) => {
		return cb(err, success);
	});
};

Gantt.prototype.deleteTask = function (team, cb) {
	task.delete((err, success) => {
		if (!err) {
			for (var i = 0; i < this.tasks.length; i++) {
				if (task._id === this.tasks[i]._id) {
					this.tasks.splice(i, 1);
					return cb(err, success);
				}
			}
		} else {
			return cb(err, success);
		}
	});
};

/* 	$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
MILESTONE FUNCTIONALITY
$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ */

Gantt.prototype.addMilestone = function (name, color, date) {
	var mStone = new Milestone(name, color, date);
	mStone.create(this, function (err, success) {
		if (err) {
			alert('erro adding milestone', err);
		} else {
			if (Array.isArray(this.milestones)) {
				this.milestones.push(success);
			} else {
				this.milestones = [success];
			}
		}
	});
};

Gantt.prototype.deleteMilestone = function (index) {
	if (Array.isArray(this.milestones) && this.milestones[index] && this.milestones[index].hasOwnProperty('delete')) {
		this.milestones[index].delete();
	} else {
		console.error('delete milestone index error', index, this.milestones);
	}
};

Gantt.prototype.updateMilestone = function (index, updated) {};
var error = "Milestone, error: ";

function Milestone(name, color, date) {
	this.name = name;
	this.color = color;
	this.date = date;
}

Milestone.prototype.create = function (gantt, cb) {
	if (!gantt || !gantt.hasOwnProperty('_id')) {
		return console.error(error + 'missing gantt from create function');
	}
	if (this.name && this.color && this.date) {

		var http = new XMLHttpRequest();
		http.open('POST', '/api/milestone');
		http.setRequestHeader("Content-Type", "application/json");

		http.onreadystatechange = function () {
			if (http.readyState === XMLHttpRequest.DONE && http.status === 200) {
				var response = JSON.parse(http.responseText);
				this._id = response._id;
				return cb(null, response);
			}
		};

		http.onerror = function () {
			console.error(error, 'posting data', http);
			return cb(http.responseText);
		};

		http.send({ name: this.name, color: this.color,
			date: this.date, chart: gantt._id });
	} else {
		console.error(error + 'missing values to create');
		return cb(error);
	}
};

Milestone.prototype.delete = function () {
	if (this._id) {
		var http = new XMLHttpRequest();
		http.open('DELETE', '/api/milestone/' + this._id);

		http.onreadystatechange = function () {
			if (http.readyState === XMLHttpRequest.DONE && http.status === 200) {
				var response = JSON.parse(http.responseText);
				return cb(null, response);
			}
		};
		http.onerror = function () {
			console.error(error, 'deleting data', http);
			return cb(http.responseText);
		};

		http.send();
	} else {
		console.error(error + 'missing values to delete');
		return cb(error);
	}
};
var error = "Task Error: ";

function Task(task) {

	this.name = task.name || false;
	this.start = task.start || false;
	this.end = task.end || false;
}

Task.find = function (gantt, cb) {

	if (!gantt || !gantt.hasOwnProperty('_id')) {
		console.error(error, ' finding tasks, gantt invalid');
		return cb('gantt invalid');
	} else {

		var http = new XMLHttpRequest();
		http.open('GET', '/api/task?ganttChart=' + gantt._id);

		http.onreadystatechange = function () {
			if (http.readyState === XMLHttpRequest.DONE) {
				var response;
				if (http.responseText) {
					response = JSON.parse(http.responseText);
				}
				if (http.status === 200) {
					return cb(null, response);
				} else {
					return cb(response);
				}
			}
		};

		http.send();
	}
};

Task.prototype.create = function (gantt, name, start, cb) {
	if (!gantt || !gantt.hasOwnProperty('_id')) {
		return console.error(error + 'missing gantt for create function');
	}
	this.name = name;
	this.startTime = start;
	if (this.name && this.startTime) {

		var http = new XMLHttpRequest();
		http.open('POST', '/api/task');
		http.setRequestHeader("Content-Type", "application/json");

		http.onreadystatechange = function () {
			if (http.readyState === XMLHttpRequest.DONE) {
				if (http.status === 200) {
					var response = JSON.parse(http.responseText);
					this._id = response._id;
					return cb(null, response);
				} else {
					return cb(http.responseText, null);
				}
			}
		};
		http.send({ name: this.name, startTime: this.startTime, gantt: gantt._id });
	} else {
		console.error(error + 'missing values to create');
		return cb(error);
	}
};

Task.prototype.delete = function () {
	if (this._id) {
		var http = new XMLHttpRequest();
		http.open('DELETE', '/api/task/' + this._id);

		http.onreadystatechange = function () {
			if (http.readyState === XMLHttpRequest.DONE && http.status === 200) {
				var response = JSON.parse(http.responseText);
				return cb(null, response);
			}
		};
		http.onerror = function () {
			console.error(error, 'deleting data', http);
			return cb(http.responseText);
		};

		http.send();
	} else {
		console.error(error + 'missing values to delete');
		return cb(error);
	}
};
/*
*	
*/

function Team(team) {
	if (team) {
		this.name = team.name;
		this.color = team.color;
		this.gantt = team.gantt;
		this._id = team._id;
	}
}

Team.find = function (gantt, cb) {

	if (!gantt || !gantt.hasOwnProperty('_id')) {
		console.error(error, ' finding tasks, gantt invalid');
		return cb('gantt invalid');
	} else {
		var http = new XMLHttpRequest();
		http.open('GET', '/api/team?gantt=' + gantt._id);
		http.onreadystatechange = function () {
			if (http.readyState === XMLHttpRequest.DONE) {
				if (http.status === 200) {
					var response;
					if (http.responseText) {
						response = JSON.parse(http.responseText);
					}
					return cb(null, response);
				} else {
					var response = http.responseText;
					return cb(response);
				}
			}
		};
		http.onerror = function () {
			console.error(error, 'find for chart', http);
			return cb(http.responseText);
		};
		http.send();
	}
};

Team.prototype.create = function (gantt, name, color, cb) {
	if (!gantt || !gantt.hasOwnProperty('_id') || !name || !color) {
		console.error(error, ' creating team, gantt invalid');
		return cb('gantt invalid');
	} else {

		this.gantt = gantt._id || gantt;
		this.name = name;
		this.color = color;
		var that = this;
		var http = new XMLHttpRequest();
		http.open('POST', '/api/team');
		http.setRequestHeader("Content-Type", "application/json");

		http.onreadystatechange = function () {
			if (http.readyState === XMLHttpRequest.DONE) {
				if (http.status === 200) {
					var response = JSON.parse(http.responseText);
					that._id = response._id;
					return cb(null, that);
				} else {
					var response = http.responseText;
					return cb(response, null);
				}
			}
		};

		http.send(JSON.stringify({ gantt: this.gantt, name: this.name, color: this.color }));
	}
};

Team.prototype.update = function (cb) {
	var http = new XMLHttpRequest();
	http.open('PUT', '/api/team/' + this._id);
	http.setRequestHeader("Content-Type", "application/json");

	http.onreadystatechange = function () {
		if (http.readyState === XMLHttpRequest.DONE) {
			if (http.status === 200) {
				var response = JSON.parse(http.responseText);
				return cb(null, response);
			} else {
				var response = http.responseText;
				return cb(response, null);
			}
		}
	};

	http.send(JSON.stringify({ color: this.color, name: this.name }));
};

Team.prototype.delete = function (cb) {
	var http = new XMLHttpRequest();
	http.open('DELETE', '/api/team/' + this._id);

	http.onreadystatechange = function () {
		if (http.readyState === XMLHttpRequest.DONE) {
			if (http.status === 200) {
				var response = JSON.parse(http.responseText);
				return cb(null, response);
			} else {
				var response = http.responseText;
				return cb(response, null);
			}
		}
	};

	http.send();
};
/*
* Time period class
*/

var timeperiodError = "Time Period Error: ";
function Timeperiod(timeperiod) {
	if (timeperiod) {
		this.startTime = timeperiod.startTime;
		this.endTime = timeperiod.endTime;
		this.gantt = timeperiod.gantt;
	}
}
/*
*	Params - Gantt Data Object 
*/
Timeperiod.prototype.find = function (gantt, cb) {
	if (!gantt || !gantt.hasOwnProperty('_id')) {
		console.error(timeperiodError, ' Find, gantt invalid');
		return cb('gantt invalid');
	} else {
		var that = this;
		var http = new XMLHttpRequest();
		http.open('GET', '/api/timeperiod?gantt=' + gantt._id);
		http.onreadystatechange = function () {
			if (http.readyState === XMLHttpRequest.DONE) {
				if (http.status === 200) {
					var response;
					if (http.responseText) {
						response = JSON.parse(http.responseText);
					}
					if (response && response.gantt) {
						that.gantt = response.gantt;
						that.startTime = response.startTime;
						that.endTime = response.endTime;
						that._id = response._id;
						return cb(null, that);
					} else {
						return cb(null, false);
					}
				} else {
					var response = http.responseText;
					return cb(response);
				}
			}
		};
		http.send();
	}
};

/*
* 	Params - Gantt Data Object,
*		   	 Start of timeperiod as ms stamp
*/
Timeperiod.prototype.create = function (gantt, startTime, cb) {
	if (!gantt || !gantt.hasOwnProperty('_id') || typeof startTime !== 'number') {
		console.error(timeperiodError, ' creating tasks, params invalid', gantt, startTime);
		return cb('params invalid');
	} else {
		this.gantt = gantt._id;
		this.startTime = startTime;
		this.endTime = startTime;
	}
	var that = this;
	var http = new XMLHttpRequest();

	http.open('POST', '/api/timeperiod');
	http.setRequestHeader("Content-Type", "application/json");

	http.onreadystatechange = function () {
		if (http.readyState === XMLHttpRequest.DONE) {
			if (http.status === 200) {
				var response = JSON.parse(http.responseText);
				that._id = response._id;
				return cb(null, that);
			} else {
				var response = JSON.parse(http.responseText);
				return cb(response);
			}
		}
	};
	http.send(JSON.stringify({ gantt: this.gantt, startTime: this.startTime, endTime: this.endTime }));
};

/*
*	Params - Gantt data object
*/
Timeperiod.prototype.delete = function (cb) {
	if (this._id) {
		var http = new XMLHttpRequest();
		http.open('DELETE', '/api/timeperiod/' + this._id);
		http.setRequestHeader("Content-Type", "application/json");
		http.onreadystatechange = function () {
			if (http.readyState === XMLHttpRequest.DONE) {
				if (http.status === 200) {
					return cb(null, true);
				} else {
					var response = JSON.parse(http.responseText);
					return cb(response);
				}
			}
		};
		http.send();
	} else {
		return cb(timeperiodError, 'missing id');
	}
};

/*
*	Params - startTime ms time, endTime ms time
*/
Timeperiod.prototype.update = function (startTime, endTime, cb) {
	if (startTime !== this.startTime || endTime !== this.endTime) {
		this.startTime = startTime;
		this.endTime = endTime;

		var that = this;

		var http = new XMLHttpRequest();
		http.open('PUT', '/api/timeperiod/' + this._id);
		http.setRequestHeader("Content-Type", "application/json");
		http.onreadystatechange = function () {
			if (http.readyState === XMLHttpRequest.DONE) {
				if (http.status === 200) {
					var response = JSON.parse(http.responseText);
					return cb(null, response);
				} else {
					var response = JSON.parse(http.responseText);
					return cb(response);
				}
			}
		};
		http.send(JSON.stringify({ timeperiod: this }));
	} else {
		return cb(timeperiodError, 'fields are not updates');
	}
};
/*
	Drawing a Gantt Chart functionality
*/

var error = 'Gantt Drawer Error: ';
function GanttDraw(gantt, elem, height, width) {
	if (!gantt.create) {
		return console.error(error, 'provided invalid gantt data object');
	}
	if (!elem.setAttribute) {
		return console.error(error, 'provided invalid element to append canvas too');
	}
	this.gantt = gantt;
	this.elem = elem;
	if (height) {
		this.height = height;
	}
	if (width) {
		this.width = width;
	}

	this.chartId = Math.random() * 1000;
}

//creates a new canvas element inside this.elem; 
GanttDraw.prototype.create = function () {
	//create status update element
	var div = document.createElement('div');
	div.style.width = "100%";
	div.style.height = "50px";

	var chartStatus = document.createElement('h5');
	chartStatus.setAttribute('id', 'status-' + this.chartId.toString());

	//create canvas for chart
	var canvas = document.createElement('canvas');
	var canvasHeight = this.height || window.innerHeight / 2;
	var canvasWidth = this.width || window.innerWidth / 2;

	canvas.setAttribute('height', canvasHeight);
	canvas.setAttribute('width', canvasWidth);
	canvas.setAttribute('id', 'chart-' + this.chartId.toString());

	//append elements to chart id
	div.appendChild(chartStatus);

	this.elem.appendChild(div);
	this.elem.appendChild(canvas);

	this.status = chartStatus;
	this.canvas = canvas;

	//draw current chart based on data in this.gantt
	this.draw();
};

/*FINISH LOGIC STUFF FOR STATUS AT TOP*/

GanttDraw.prototype.draw = function () {
	this.drawStatus();
	this.drawButtons();
	this.drawChart();
};

GanttDraw.prototype.drawStatus = function () {
	if (this.milestoneDrawer) {
		this.status.innerHTML = "Add Milestones";
	} else if (this.taskDrawer) {
		this.status.innerHTML = "Add Tasks";
	} else if (this.teamDrawer) {
		this.status.innerHTML = "Add Teams";
	} else {
		this.status.innerHTML = "Add Time Period";
	}
};

GanttDraw.prototype.drawButtons = function () {};

GanttDraw.prototype.drawChart = function () {
	//draw timeperiod x axis
	if (this.timePeriodDrawer) {
		this.timePeriodDrawer.update(this.gantt.timeperiod, this.canvas);
	} else if (this.gantt.hasOwnProperty('timeperiod')) {
		this.timePeriodDrawer = new TimePeriodDrawer(this.gantt.timeperiod, this.canvas);
		this.timePeriodDrawer.draw();
	}

	//draw team y axis
	if (this.teamDrawer) {
		this.teamDrawer.update(this.gantt.team, this.canvas);
	} else if (this.gantt.hasOwnProperty('team')) {
		this.teamDrawer = new TeamDrawer(this.gantt.team, this.canvas);
		this.teamDrawer.draw();
	}

	//add tasks to chart
	if (this.taskDrawer) {
		this.taskDrawer.update(this.gantt.task, this.canvas);
	} else if (this.gantt.hasOwnProperty('task')) {
		this.taskDrawer = new TaskDrawer(this.gantt.task, this.canvas);
		this.taskDrawer.draw();
	}

	if (this.milestoneDrawer) {
		this.milestoneDrawer.update(this.gantt.milestone, this.canvas);
	} else if (this.gantt.hasOwnProperty('milestone')) {
		this.milestoneDrawer = new MilestoneDrawer(this.gantt.milestone, this.canvas);
		this.milestoneDrawer.draw();
	}
};
/*
*	Milestone Draw class
*   Takes a team data object and a canvas and
* 	renders the timeperiod to the screen
*/

function MilestoneDrawer(team, canvas) {
	this.team = team;
	this.canvas = canvas;
}

MilestoneDrawer.prototype.draw = function () {};
/*
*	Task Draw class
*   Takes a task data object and a canvas and
* 	renders the timeperiod to the screen
*/

function TaskDrawer(task, canvas) {
	this.task = task;
	this.canvas = canvas;
}

TaskDrawer.prototype.draw = function () {};
/*
*	Team Draw class
*   Takes a team data object and a canvas and
* 	renders the timeperiod to the screen
*/

function TeamDrawer(team, canvas) {
	this.team = team;
	this.canvas = canvas;
}

TeamDrawer.prototype.draw = function () {};
/*
*	Time Period Draw class
*   Takes a timeperiod data object and a canvas and
* 	renders the timeperiod to the screen
*/

function TimePeriodDrawer(timeperiod, canvas) {
	this.timeperiod = timeperiod;
	this.canvas = canvas;
}

TimePeriodDrawer.prototype.draw = function () {};


//sinit();

function init() {
	addTitleCreateListener('title-create-button');
}

function addTitleCreateListener(buttonId) {
	var button = document.getElementById(buttonId);
	button.addEventListener('click', function () {
		var title = document.getElementById('title-input').value;
		if (title.length > 0) {
			var ganttData = new Gantt();
			ganttData.create(title, function (err, success) {
				if (err) {
					alert(err);
				} else {
					setChartTitle(title);
					shiftView('title-view', 'create-view');
				}
			});
		}
	});
}

function setChartTitle(title) {
	var chartTitle = document.getElementById('chart-title-display');
	chartTitle.innerHTML = title;
}
function shiftView(view1, view2) {
	view1 = document.getElementById(view1);
	view2 = document.getElementById(view2);

	view1.style.display = 'none';
	view2.style.display = 'block';
}