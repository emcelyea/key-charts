/*
*	
*/


function Team(team){
	if(team){
		this.name  = team.name;
		this.color = team.color;
		this.gantt = team.gantt;
		this._id   = team._id;
	}
} 

Team.find = function(gantt, cb){
	
	if(!gantt || !gantt.hasOwnProperty('_id')){
		console.error(error, ' finding tasks, gantt invalid');
		return cb('gantt invalid');
	}else{
		var http = new XMLHttpRequest();
		http.open('GET', '/api/team?gantt=' + gantt._id);
		http.onreadystatechange = function(){
			if(http.readyState === XMLHttpRequest.DONE){
			 	if(http.status === 200){
					var response;
					if(http.responseText){
						response = JSON.parse(http.responseText);
					}
					return cb(null, response);
				}else{
					var response = http.responseText;
					return cb(response);
				}
			}				
		}
		http.onerror = function(){
			console.error(error, 'find for chart', http);
			return cb(http.responseText);
		}
		http.send();		
	}
}


Team.prototype.create = function(gantt, name, color, cb){
	if(!gantt || !gantt.hasOwnProperty('_id') || !name || !color){
		console.error(error, ' creating team, gantt invalid');
		return cb('gantt invalid');
	}else{
		
		this.gantt = gantt._id || gantt;
		this.name  = name;
		this.color = color;
		var that   = this;
		var http = new XMLHttpRequest();
		http.open('POST', '/api/team');
		http.setRequestHeader("Content-Type", "application/json");

		http.onreadystatechange = function(){
			if(http.readyState === XMLHttpRequest.DONE){
			 	if(http.status === 200){
					var response = JSON.parse(http.responseText);
					that._id     = response._id;
					return cb(null, that);
				}else{
					var response = http.responseText;
					return cb(response, null);
				}
			}				
		}

		http.send(JSON.stringify({gantt:this.gantt, name:this.name, color:this.color}));		
	}
}

Team.prototype.update = function(cb){
	var http = new XMLHttpRequest();
	http.open('PUT', '/api/team/' + this._id);
	http.setRequestHeader("Content-Type", "application/json");

	http.onreadystatechange = function(){
		if(http.readyState === XMLHttpRequest.DONE){
		 	if(http.status === 200){
				var response = JSON.parse(http.responseText);
				return cb(null, response);
			}else{
				var response = http.responseText;
				return cb(response, null);
			}
		}				
	}

	http.send(JSON.stringify({color:this.color, name:this.name}));
}

Team.prototype.delete = function(cb){
	var http = new XMLHttpRequest();
	http.open('DELETE', '/api/team/' + this._id);

	http.onreadystatechange = function(){
		if(http.readyState === XMLHttpRequest.DONE){
		 	if(http.status === 200){
				var response = JSON.parse(http.responseText);
				return cb(null, response);
			}else{
				var response = http.responseText;
				return cb(response, null);
			}
		}				
	}

	http.send();
}

