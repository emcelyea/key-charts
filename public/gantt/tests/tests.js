var Gantt 	   = require('../data/gantt/gantt');


var status = document.getElementById('status-elem');
status.innerHTML = 'Starting Tests<br>';
var tests = [];

/*globals*/
var gantt;
function ganttTests (cb){
	status.fontcolor = "black";
	status.innerHTML += 'Running gantt chart tests<br>';
	
	gantt = new Gantt();
	status.innerHTML += "Constructor completed<br>";

	gantt.create('test chart', function(err, resp){
		if(err){
			status.innerHTML   += errorReturn(JSON.stringify(err));
			return cb(false)
		}else{
			status.innerHTML   += successReturn(JSON.stringify(resp));
			return cb(true);
		}
	});
}


/*  $$$$$  TIME PERIOD TEST  $$$$$*/
function timeperiodTestCreate (cb){
	status.innerHTML += "Running time period create<br>";
	gantt.addTimePeriod(new Date().getTime(), function(err, tp){
		if(err){
			status.innerHTML += errorReturn(JSON.stringify(err));
			return cb(false);
		}else{

			status.innerHTML += successReturn(JSON.stringify(tp));
			return cb(true);
		}
	});
}

function timeperiodTestUpdate (cb){
	status.innerHTML += "Running time period update<br>";
	gantt.updateTimePeriod(new Date().getTime(), new Date().getTime()+1000, function(err,tp){
		if(err){
			status.innerHTML += errorReturn(JSON.stringify(err));
			return cb(false);
		}else{
			if(tp.nModified === 1){
				status.innerHTML += successReturn(JSON.stringify(tp));
				return cb(true);
			}else{
				status.innerHTML += errorReturn(JSON.stringify(tp));
				return cb(false);
			}
		}			
	});
}

function timeperiodTestDelete (cb){
	status.innerHTML += "Running time period delete<br>";
	gantt.deleteTimePeriod(function(err, success){
		if(err){
			status.innerHTML += errorReturn(JSON.stringify(err));
			return cb(false);
		}else{
			status.innerHTML += successReturn(JSON.stringify(success));
			return cb(true);
		}
	});
}

function timeperiodTestFind (cb){
	status.innerHTML += "Running time period find<br>";
	gantt.findTimePeriod(function(err, success){
		if(err){
			status.innerHTML += errorReturn(JSON.stringify(err));
			return cb(false);
		}else{
			status.innerHTML += successReturn(JSON.stringify(success));
			return cb(true);
		}
	});
}


/*  $$$$$  TEAM TESTS  $$$$$*/
function teamTestCreate (cb){
	status.innerHTML += "Running team create<br>";
	gantt.addTeam('team one', '#43AA65', function(err, success){
		if(err){
			status.innerHTML += errorReturn(JSON.stringify(err));
			return cb(false);
		}else{
			status.innerHTML += successReturn(JSON.stringify(success));
			return cb(true);
		}		
	});
}

function teamTestCreateTwo(cb){
	status.innerHTML += "Running Team Create two<br>";
	gantt.addTeam('team twos', '#43BBCD', function(err, success){
		if(err){
			status.innerHTML += errorReturn(JSON.stringify(err));
			return cb(false);
		}else{
			status.innerHTML += successReturn(JSON.stringify(success));
			return cb(true);
		}
	});
}

function teamTestFind (cb){
	status.innerHTML += "Running team find<br>";
	gantt.findTeams(function(err, success){
		if(err){
			status.innerHTML += errorReturn(JSON.stringify(err));
			return cb(false);
		}else{
			status.innerHTML += successReturn(JSON.stringify(gantt.teams));
			return cb(true);
		}
	});
}

function teamTestUpdate (cb){
	status.innerHTML += "Running team update<br>";
	var team = gantt.teams[0];
	team.name = "team 3";
	team.update(function(err, success){
		if(err){
			status.innerHTML += errorReturn(JSON.stringify(err));
			return cb(false);
		}else{
			status.innerHTML += successReturn(JSON.stringify(success));
			return cb(true);
		}
	});
}

function teamTestDelete(cb){
	status.innerHTML += "Running team delete<br>";
	var team = gantt.teams[0];
	team.delete(function(err, success){
		if(err){
			status.innerHTML += errorReturn(JSON.stringify(err));
			return cb(false);
		}else{
			status.innerHTML += successReturn(JSON.stringify(success));
			return cb(true);
		}
	});
}



tests.push(ganttTests);
tests.push(timeperiodTestCreate);
tests.push(timeperiodTestUpdate);
tests.push(timeperiodTestDelete);
tests.push(teamTestCreate);
tests.push(teamTestCreateTwo);
tests.push(teamTestFind);
tests.push(teamTestUpdate);
tests.push(teamTestDelete);
tests.push(teamTestFind);


function runTests(tests, index){
	if(tests[index] && typeof tests[index] === 'function'){
		tests[index](function(cont){
			if(cont){
				runTests(tests, ++index);
			}
		});
	}
}

function successReturn(str){
	return '<span style="color:green">'+str+'</span><br>';
}
function errorReturn(str){
	return '<span style="color:red">'+str+'</span><br>';
}

runTests(tests, 0);