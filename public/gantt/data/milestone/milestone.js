var error = "Milestone, error: ";

function Milestone(name, color, date){
	this.name 	  = name;
	this.color    = color;
	this.date     = date;
}

Milestone.prototype.create = function(gantt, cb){
	if(!gantt || !gantt.hasOwnProperty('_id')){
		return console.error(error + 'missing gantt from create function');
	}
	if(this.name && this.color && this.date){
		
		var http = new XMLHttpRequest();
		http.open('POST', '/api/milestone');
		http.setRequestHeader("Content-Type", "application/json");

		
		http.onreadystatechange = function(){
			if(http.readyState === XMLHttpRequest.DONE && http.status === 200){
				var response = JSON.parse(http.responseText);
				this._id = response._id;
				return cb(null, response);
			}
		}

		http.onerror = function(){
			console.error(error, 'posting data', http);
			return cb(http.responseText);
		}

		http.send({name:this.name, color:this.color,
				   date:this.date, chart:gantt._id});
	}else{
		console.error(error + 'missing values to create');
		return cb(error);
	}
}

Milestone.prototype.delete = function(){
	if(this._id){
		var http = new XMLHttpRequest();
		http.open('DELETE', '/api/milestone/' + this._id);

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

