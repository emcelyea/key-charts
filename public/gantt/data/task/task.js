var error = "Task Error: ";

function Task(task){

	this.name  = task.name  || false;
	this.start = task.start || false;
	this.end   = task.end   || false;
}

Task.find = function(gantt, cb){
	
	if(!gantt || !gantt.hasOwnProperty('_id')){
		console.error(error, ' finding tasks, gantt invalid');
		return cb('gantt invalid');
	}else{
		
		var http = new XMLHttpRequest();
		http.open('GET', '/api/task?ganttChart=' + gantt._id);
		
		http.onreadystatechange = function(){
			if(http.readyState === XMLHttpRequest.DONE){
				var response;
				if(http.responseText){
					response = JSON.parse(http.responseText);
				}
				if(http.status === 200){
					return cb(null, response);
				} else {
					return cb(response);
				}		
			}
		}

		http.send();		
	}
}

Task.prototype.create = function(gantt, name, start, cb){
	if(!gantt || !gantt.hasOwnProperty('_id')){
		return console.error(error + 'missing gantt for create function');
	}
	this.name 	   = name;
	this.startTime = start;
	if(this.name && this.startTime){
		
		var http = new XMLHttpRequest();
		http.open('POST', '/api/task');
		http.setRequestHeader("Content-Type", "application/json");
		
		http.onreadystatechange = function(){
			if(http.readyState === XMLHttpRequest.DONE){
				if(http.status === 200){
					var response = JSON.parse(http.responseText);
					this._id = response._id;
					return cb(null, response);
				}else{
					return cb(http.responseText, null);
				}
			}
		}
		http.send({name:this.name, startTime:this.startTime, gantt:gantt._id});
	}else{
		console.error(error + 'missing values to create');
		return cb(error);
	}
}

Task.prototype.delete = function(){
	if(this._id){
		var http = new XMLHttpRequest();
		http.open('DELETE', '/api/task/' + this._id);

		http.onreadystatechange	= function(){
			if(http.readyState === XMLHttpRequest.DONE && http.status === 200){
				var response = JSON.parse(http.responseText);
				return cb(null, response);
			}
		}
		http.onerror = function(){
			console.error(error, 'deleting data', http);
			return cb(http.responseText);
		}

		http.send();
	}else{
		console.error(error + 'missing values to delete');		
		return cb(error);
	}
}

