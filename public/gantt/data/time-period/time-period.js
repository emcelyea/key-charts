/*
* Time period class
*/

var timeperiodError = "Time Period Error: ";
function Timeperiod(timeperiod){
	if(timeperiod){
		this.startTime = timeperiod.startTime;
		this.endTime   = timeperiod.endTime;
		this.gantt     = timeperiod.gantt;
	}
}
/*
*	Params - Gantt Data Object 
*/
Timeperiod.prototype.find = function(gantt, cb){
	if(!gantt || !gantt.hasOwnProperty('_id')){
		console.error(timeperiodError , ' Find, gantt invalid');
		return cb('gantt invalid');
	}else{
		var that = this;
		var http = new XMLHttpRequest();
		http.open('GET', '/api/timeperiod?gantt=' + gantt._id);
		http.onreadystatechange = function(){
			if(http.readyState === XMLHttpRequest.DONE){
			 	if(http.status === 200){
			 		var response;
			 		if(http.responseText){
						response = JSON.parse(http.responseText);
					}
					if(response && response.gantt){
						that.gantt = response.gantt;
						that.startTime = response.startTime;
						that.endTime   = response.endTime;
						that._id 	   = response._id;
						return cb(null, that);
					}else{
						return cb(null, false);
					}

				}else{
					var response = http.responseText;					
					return cb(response);
				}
			}				
		}
		http.send();		
	}
}

/*
* 	Params - Gantt Data Object,
*		   	 Start of timeperiod as ms stamp
*/
Timeperiod.prototype.create = function(gantt, startTime, cb){
	if(!gantt || !gantt.hasOwnProperty('_id') || typeof startTime !== 'number'){
		console.error(timeperiodError , ' creating tasks, params invalid', gantt, startTime);
		return cb('params invalid');
	}else{
		this.gantt 	   = gantt._id;
		this.startTime = startTime;
		this.endTime   = startTime;
	}
	var that = this;
	var http = new XMLHttpRequest();
	
	http.open('POST', '/api/timeperiod');
	http.setRequestHeader("Content-Type", "application/json");
	
	http.onreadystatechange = function(){
		if(http.readyState === XMLHttpRequest.DONE){
			if(http.status === 200){
				var response = JSON.parse(http.responseText);
				that._id = response._id;
				return cb(null, that);
			}else{
				var response = JSON.parse(http.responseText);
				return cb(response);
			}
		}
	}
	http.send(JSON.stringify({gantt:this.gantt, startTime:this.startTime, endTime:this.endTime}));		
}

/*
*	Params - Gantt data object
*/
Timeperiod.prototype.delete = function(cb){
	if(this._id){
		var http = new XMLHttpRequest();
		http.open('DELETE', '/api/timeperiod/' + this._id);
		http.setRequestHeader("Content-Type", "application/json");
		http.onreadystatechange = function(){
			if(http.readyState === XMLHttpRequest.DONE){
				if(http.status === 200){
					return cb(null, true);
				}else{
					var response = JSON.parse(http.responseText);
					return cb(response);
				}
			}
		}
		http.send();	
	}else{
		return cb(timeperiodError, 'missing id');
	}
}

/*
*	Params - startTime ms time, endTime ms time
*/
Timeperiod.prototype.update = function(startTime, endTime, cb){
	if(startTime !== this.startTime || endTime !== this.endTime){
		this.startTime = startTime;
		this.endTime   = endTime;

		var that = this;
	
		var http = new XMLHttpRequest();
		http.open('PUT', '/api/timeperiod/' + this._id);
		http.setRequestHeader("Content-Type", "application/json");
		http.onreadystatechange = function(){
			if(http.readyState === XMLHttpRequest.DONE){ 
				if(http.status === 200){
					var response = JSON.parse(http.responseText);
					return cb(null, response);
				}else{
					var response = JSON.parse(http.responseText);
					return cb(response);					
				}
			}
		}
		http.send(JSON.stringify({timeperiod:this}));	
	}else{
		return cb(timeperiodError, 'fields are not updates');
	}

}
