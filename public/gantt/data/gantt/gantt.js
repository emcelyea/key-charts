var ganttError = 'Gantt Chart Errors: ';

function Gantt () {
 this.timeperiod = false;
 this.teams  		 = false;
 this.tasks 		 = false;
 this.milestones = false;
}

Gantt.prototype.find = function (id){
	if(typeof id === 'string'){
		
		var http = new XMLHttpRequest();
		http.open('GET', '/api/gantt/' + gantt._id);
		
		http.onreadystatechange = function(){
			var response;
			if(http.readyState === XMLHttpRequest.DONE && http.status === 200){
				response = JSON.parse(http.responseText);
				return cb(null, response);
			}else{
				response = JSON.parse(http.responseText);
				return cb(response);
			}	
		};
		http.send();			
	}else{
		console.error(gantError, 'Id parameter errors', id);		
	}
};

Gantt.prototype.create = function(title, cb){
	this.title = title;
	if(this.title){
		var that = this;
		var http = new XMLHttpRequest();
		http.open('POST', '/api/gantt');
		http.setRequestHeader("Content-Type", "application/json");

		http.onreadystatechange = function(){
			var response;
			if(http.readyState === XMLHttpRequest.DONE && http.status === 200){
				response = JSON.parse(http.responseText);
				that._id = response._id;
				return cb(null, response);
			}else{
				response = http.responseText;
				return cb(response);
			}
		};
		http.send(JSON.stringify({title:this.title}));		
	}else{
		console.error(ganttError, ' missing field to create chart');
	}
};

Gantt.prototype.update = function(title, cb){
	if(title && this._id){

		var that = this;
		var http = new XMLHttpRequest();
		http.open('PUT', '/api/gantt/' + this._id);
		http.setRequestHeader("Content-Type", "application/json");

		http.onreadystatechange = function(){
			var response;			
			if(http.readyState === XMLHttpRequest.DONE && http.status === 200){
				response = JSON.parse(http.responseText);
				that.title = title;
				return cb(null, response);
			}else{
				response = http.responseText;
				return cb(response);
			}
		};
		
		http.send(JSON.stringify({title:this.title}));	

	}else{
		console.error(ganttError, ' missing field for title create');
	}
};

Gantt.prototype.delete = function(cb){
	if(this._id){
		var that = this;
		var http = new XMLHttpRequest();
		http.open('DELETE', '/api/gantt/' + this._id);
		http.setRequestHeader("Content-Type", "application/json");

		http.onreadystatechange = function(){
			var response;			
			if(http.readyState === XMLHttpRequest.DONE && http.status === 200){
				response = JSON.parse(http.responseText);
				that._id = null;
				return cb(null, response);
			}else{
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
Gantt.prototype.addTimeperiod = function(startTime, cb){
	var timeperiod = new Timeperiod();
	timeperiod.create(this, startTime, (err, success) =>{
		if(!err){
			this.timeperiod = success;
			return cb(null, success);
		}
	});
};

Gantt.prototype.findTimeperiod = function(cb){
	this.timeperiod = new Timeperiod();
	this.timeperiod.find(this, (err, success) => {
		if(!err){
			this.timeperiod = success || null;
		}
		if(cb){
			return cb(err, success);
		}
	});
};

Gantt.prototype.updateTimeperiod = function(startTime, endTime, cb){
	this.timeperiod.update(startTime, endTime, cb);
};

Gantt.prototype.deleteTimeperiod = function(cb){
	this.timeperiod.delete( (err, deleted) => {
		if(err){
			return cb(err);
		}else{
			this.timeperiod = false;
			return cb(null, deleted);
		}
	});
};


/* 	$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
						TEAM FUNCTIONALITY
		$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ */
Gantt.prototype.addTeam = function(name, color, cb){
	var team = new Team();
	team.create(this, name, color, (err, success) => {
		if(this.teams && Array.isArray(this.teams)){
			this.teams.push(team);
		}else{
			this.teams = [team];
		}
		return cb(err, true);
	});
};

Gantt.prototype.findTeams  = function(cb){
	Team.find(this, (err, teams) => {
		if(Array.isArray(teams)){
			this.teams = [];
			var team;
			for(var i = 0; i < teams.length; i++){
				team = new Team(teams[i]);
				this.teams.push(team);
			}
			cb(err, true);
		}else{
			cb(err);
		}
	});
};

Gantt.prototype.updateTeam = function(team, cb){
	team.update( (err, success) => {
		return cb(err, success);
	});
};

Gantt.prototype.deleteTeam = function(team, cb){
	team.delete((err, success) => {
		if(!err){
			for(var i = 0; i < this.teams.length; i++){
				
				if(team._id === this.teams[i]._id){
					this.teams.splice(i,1);
					return cb(err, success);
				}
			
			}
		}else{
			return cb(err, success);
		}
	});
};

/* 	$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
TASK FUNCTIONALITY
$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ */
Gantt.prototype.addTask = function(name, start, cb){
	var task = new Task();
	task.create(this, name, start, (err, success) => {
		if(this.tasks && Array.isArray(this.tasks)){
			this.tasks.push(task);
		}else{
			this.tasks = [task];
		}
		return cb(err, true);

	});
};

Gantt.prototype.findTasks = function(cb){
	Task.find(this, (err, success) => {
		if(!err){
			var task;
			this.tasks = [];
			for(var i = 0; i < success.length; i++){
				task = new Task(success[i]);
				this.tasks.push(task);
			}
			return cb(null, true);
		}else{
			return cb(err);
		}
	});
}

Gantt.prototype.updateTask = function(task, cb){
	task.update( (err, success) => {
		return cb(err, success);
	});
};

Gantt.prototype.deleteTask = function(team, cb){
	task.delete((err, success) => {
		if(!err){
			for(var i = 0; i < this.tasks.length; i++){
				if(task._id === this.tasks[i]._id){
					this.tasks.splice(i,1);
					return cb(err, success);
				}
			}
		}else{
			return cb(err, success);
		}
	});
};



/* 	$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
MILESTONE FUNCTIONALITY
$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ */

Gantt.prototype.addMilestone = function(name, color, date){
	var mStone = new Milestone(name, color, date);
	mStone.create(this, function(err, success){
		if(err){
			alert('erro adding milestone', err);
		}else{
			if(Array.isArray(this.milestones)){
				this.milestones.push(success);
			}else{
				this.milestones = [success];
			}
		}
	});
};

Gantt.prototype.deleteMilestone = function(index){
	if(Array.isArray(this.milestones) && this.milestones[index] && this.milestones[index].hasOwnProperty('delete')){
		this.milestones[index].delete();
	}else{
		console.error('delete milestone index error', index, this.milestones);
	}
};

Gantt.prototype.updateMilestone = function(index, updated){

};





